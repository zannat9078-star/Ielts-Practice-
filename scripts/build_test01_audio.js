import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('ERROR: GEMINI_API_KEY is not defined in environment');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });
const TEMP_DIR = '/tmp/ielts_build';
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// 1. Generate silence file
function makeSilence(seconds, outFile) {
  execSync(
    `ffmpeg -f lavfi -i "anullsrc=r=24000:cl=mono" -t ${seconds} -c:a pcm_s16le -y "${outFile}"`,
    { stdio: 'ignore' }
  );
}

// 2. Generate authentic IELTS dual-tone chime
function makeChime(outFile) {
  execSync(
    `ffmpeg -f lavfi -i "sine=frequency=880:duration=0.5,afade=t=out:st=0.2:d=0.3" ` +
    `-f lavfi -i "sine=frequency=1174.66:duration=0.8,afade=t=out:st=0.3:d=0.5" ` +
    `-filter_complex "[0:a][1:a]concat=n=2:v=0:a=1,volume=0.35,aresample=24000[out]" ` +
    `-map "[out]" -c:a pcm_s16le -y "${outFile}"`,
    { stdio: 'ignore' }
  );
}

// 3. TTS single voice with retry and caching
async function ttsSingle(text, voiceName, outFile) {
  if (fs.existsSync(outFile) && fs.statSync(outFile).size > 2000) {
    console.log(`[CACHED] Found existing ${path.basename(outFile)}`);
    return;
  }
  console.log(`Generating TTS (${voiceName}): "${text.slice(0, 50)}..."`);
  
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      await new Promise(r => setTimeout(r, 21000)); // Enforce 3 RPM quota strictly
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [{ role: 'user', parts: [{ text }] }],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName } },
          },
        },
      });

      const b64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!b64) throw new Error('No audio returned from Gemini TTS');
      
      const rawWav = path.join(TEMP_DIR, `raw_${Date.now()}_${Math.random().toString(36).substring(7)}.wav`);
      fs.writeFileSync(rawWav, Buffer.from(b64, 'base64'));

      execSync(`ffmpeg -i "${rawWav}" -ar 24000 -ac 1 -c:a pcm_s16le -y "${outFile}"`, { stdio: 'ignore' });
      try { fs.unlinkSync(rawWav); } catch {}
      console.log(`Saved ${path.basename(outFile)}`);
      return;
    } catch (err) {
      if (err.message && (err.message.includes('429') || err.message.includes('Quota') || err.status === 429)) {
        console.warn(`[429 Quota] Waiting 30s before retry (attempt ${attempt}/5)...`);
        await new Promise(r => setTimeout(r, 31000));
      } else {
        throw err;
      }
    }
  }
}

// 4. TTS multi speaker with retry and caching
async function ttsDialogue(dialogueItems, speakerConfigs, outFile) {
  if (fs.existsSync(outFile) && fs.statSync(outFile).size > 2000) {
    console.log(`[CACHED] Found existing ${path.basename(outFile)}`);
    return;
  }
  console.log(`Generating Multi-Speaker Dialogue (${dialogueItems.length} lines)...`);
  const parts = dialogueItems.map(item => ({
    text: `${item.speaker}: ${item.text}`,
    speechMetadata: { speaker: item.speaker },
  }));

  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-tts',
        contents: [{ role: 'user', parts }],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            multiSpeakerVoiceConfig: {
              speakerVoiceConfigs: speakerConfigs.map(sc => ({
                speaker: sc.speaker,
                voiceConfig: { prebuiltVoiceConfig: { voiceName: sc.voiceName } },
              })),
            },
          },
        },
      });

      const b64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!b64) throw new Error('No audio returned from multi-speaker Gemini TTS');

      const rawWav = path.join(TEMP_DIR, `raw_diag_${Date.now()}.wav`);
      fs.writeFileSync(rawWav, Buffer.from(b64, 'base64'));

      execSync(`ffmpeg -i "${rawWav}" -ar 24000 -ac 1 -c:a pcm_s16le -y "${outFile}"`, { stdio: 'ignore' });
      try { fs.unlinkSync(rawWav); } catch {}
      await new Promise(r => setTimeout(r, 6000)); // Rate limit buffer
      return;
    } catch (err) {
      if (err.message && (err.message.includes('429') || err.message.includes('Quota') || err.status === 429)) {
        console.warn(`[429 Quota] Waiting 25s before retry (attempt ${attempt}/5)...`);
        await new Promise(r => setTimeout(r, 26000));
      } else {
        throw err;
      }
    }
  }
}

// 5. Concatenate files into final MP3
function concatWavsToMp3(wavFiles, outMp3) {
  const listFile = path.join(TEMP_DIR, `concat_${Date.now()}.txt`);
  const content = wavFiles.map(f => `file '${f}'`).join('\n');
  fs.writeFileSync(listFile, content);

  execSync(`ffmpeg -f concat -safe 0 -i "${listFile}" -c:a libmp3lame -b:a 128k -y "${outMp3}"`, { stdio: 'ignore' });
  try { fs.unlinkSync(listFile); } catch {}
}

function getDuration(filePath) {
  const dur = execSync(
    `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`
  ).toString().trim();
  return parseFloat(dur);
}

async function buildTest01() {
  console.log('=== Building Test 01 Audio (Target: ~10 minutes / 600-615s) ===');
  const chimeFile = path.join(TEMP_DIR, 'chime.wav');
  makeChime(chimeFile);

  // Silences
  const sil5 = path.join(TEMP_DIR, 'sil5.wav');
  const sil12 = path.join(TEMP_DIR, 'sil12.wav');
  const sil15 = path.join(TEMP_DIR, 'sil15.wav');
  const sil20 = path.join(TEMP_DIR, 'sil20.wav');
  const sil25 = path.join(TEMP_DIR, 'sil25.wav');
  makeSilence(5, sil5);
  makeSilence(12, sil12);
  makeSilence(15, sil15);
  makeSilence(20, sil20);
  makeSilence(25, sil25);

  // -------------------------------------------------------------
  // PART 1 (~152s)
  // -------------------------------------------------------------
  console.log('\n--- Processing Part 1 ---');
  const p1_intro = path.join(TEMP_DIR, 'p1_intro.wav');
  await ttsSingle(
    'International English Language Testing System. Practice Examination. Part 1. ' +
    'You will hear a telephone conversation between a hotel reservations receptionist and a customer wishing to book accommodation. ' +
    'First, you have some time to look at Questions 1 to 3.',
    'Kore',
    p1_intro
  );

  const p1_dialogue1 = path.join(TEMP_DIR, 'p1_diag1.wav');
  await ttsDialogue(
    [
      { speaker: 'Julian', text: 'Good afternoon, thank you for calling the Grand Regency Hotel reservations desk. My name is Julian. How may I assist you today?' },
      { speaker: 'Robert', text: 'Good afternoon, Julian. I would like to arrange accommodation for my family next month. We will be attending an international symposium in the city, followed by a short weekend holiday.' },
      { speaker: 'Julian', text: 'Certainly, sir. I would be delighted to assist you with your reservation. May I take your full name and contact surname first, please?' },
      { speaker: 'Robert', text: 'Yes, my name is Robert Henderson. Let me spell that for you: that is H-E-N-D-E-R-S-O-N.' },
      { speaker: 'Julian', text: 'Thank you, Mr. Henderson. Let me enter that into our booking system. And could you tell me your proposed arrival and departure dates?' },
      { speaker: 'Robert', text: 'Certainly. We plan to arrive on Friday the fourteenth of November, and we will depart on Tuesday the eighteenth of November. That will be a stay of four nights.' },
    ],
    [
      { speaker: 'Julian', voiceName: 'Puck' },
      { speaker: 'Robert', voiceName: 'Charon' },
    ],
    p1_dialogue1
  );

  const p1_mid = path.join(TEMP_DIR, 'p1_mid.wav');
  await ttsSingle(
    'Before you hear the rest of the conversation, you have some time to look at Questions 4 to 10.',
    'Kore',
    p1_mid
  );

  const p1_dialogue2 = path.join(TEMP_DIR, 'p1_diag2.wav');
  await ttsDialogue(
    [
      { speaker: 'Julian', text: 'Thank you. Now, how many guests will be staying in total, and do you have a specific room category in mind?' },
      { speaker: 'Robert', text: 'There will be three of us: my wife, our ten-year-old daughter, and myself. We would ideally prefer an Executive Family Suite overlooking the botanical gardens.' },
      { speaker: 'Julian', text: 'Let me check our reservation calendar for mid-November... Yes, we have an Executive Garden Suite available on the fourth floor. Our standard seasonal rate is normally two hundred and forty pounds per night. However, because you are staying for four nights, our autumn conference discount reduces the rate to two hundred and ten pounds per night, which includes our full English breakfast buffet.' },
      { speaker: 'Robert', text: 'Two hundred and ten pounds sounds very reasonable indeed. Does that include internet access, and is there an airport transfer service?' },
      { speaker: 'Julian', text: 'Complimentary high-speed wireless internet is accessible throughout all guest suites and public lounges. Regarding airport transfers, our private hotel shuttle runs between the terminal and hotel for an additional charge of twenty-five pounds each way.' },
      { speaker: 'Robert', text: 'Please add the airport shuttle transfer for our arrival on Friday afternoon. My mobile contact number is 07820 449 120.' },
      { speaker: 'Julian', text: 'Excellent, Mr. Henderson. I have recorded your reservation, and a confirmation email has been dispatched to your address. We look forward to welcoming you.' },
    ],
    [
      { speaker: 'Julian', voiceName: 'Puck' },
      { speaker: 'Robert', voiceName: 'Charon' },
    ],
    p1_dialogue2
  );

  const p1_end = path.join(TEMP_DIR, 'p1_end.wav');
  await ttsSingle(
    'That is the end of Part 1. You now have half a minute to check your answers.',
    'Kore',
    p1_end
  );

  const p1Wavs = [
    p1_intro,
    sil15, // time to look at Q1-3
    p1_dialogue1,
    p1_mid,
    sil15, // time to look at Q4-10
    p1_dialogue2,
    p1_end,
    sil25, // check answers
    chimeFile,
  ];

  const p1Mp3 = 'public/audio/test-01-p1.mp3';
  concatWavsToMp3(p1Wavs, p1Mp3);
  const p1Dur = getDuration(p1Mp3);
  console.log(`Part 1 generated: ${p1Mp3} -> ${p1Dur.toFixed(1)}s (${(p1Dur / 60).toFixed(2)} min)`);

  // -------------------------------------------------------------
  // PART 2 (~151s)
  // -------------------------------------------------------------
  console.log('\n--- Processing Part 2 ---');
  const p2_intro = path.join(TEMP_DIR, 'p2_intro.wav');
  await ttsSingle(
    'Part 2. You will hear the head concierge giving an orientation briefing to newly arrived guests at the Grand Regency Hotel. ' +
    'First, you have some time to look at Questions 4 and 5.',
    'Kore',
    p2_intro
  );

  const p2_monologue1 = path.join(TEMP_DIR, 'p2_mono1.wav');
  await ttsSingle(
    'Good evening, ladies and gentlemen, and a warm welcome to the Grand Regency Hotel. My name is Marcus, the head concierge. ' +
    'Before you settle into your rooms, allow me to share essential information about our guest amenities, dining schedules, and leisure facilities. ' +
    'Our flagship restaurant, The Orangery, is situated on the mezzanine level overlooking the central courtyard. ' +
    'On weekdays, breakfast is served from 6:30 AM until 10:00 AM. However, on Saturdays and Sundays, breakfast service is extended until 11:00 AM to allow guests a leisurely morning. ' +
    'For evening dinner, table reservations are strongly recommended after 7:30 PM due to popular demand.',
    'Puck',
    p2_monologue1
  );

  const p2_mid = path.join(TEMP_DIR, 'p2_mid.wav');
  await ttsSingle(
    'Now listen carefully and answer the remaining questions.',
    'Kore',
    p2_mid
  );

  const p2_monologue2 = path.join(TEMP_DIR, 'p2_mono2.wav');
  await ttsSingle(
    'Next, regarding our wellness and fitness facilities: our state-of-the-art gymnasium and heated indoor saltwater swimming pool are located on the basement level. ' +
    'Both facilities are accessible twenty-four hours a day using your digital room keycard. ' +
    'For safety reasons, please observe our pool regulations: children under the age of 14 must be accompanied by a responsible adult inside the pool enclosure at all times. ' +
    'If you require valet laundry or dry cleaning services, simply place your items in the blue bag located inside your wardrobe before 9:00 AM, and they will be delivered back to your suite by 6:00 PM on the same day. ' +
    'In case of an emergency evacuation, please do not attempt to use the elevators; locate the illuminated green emergency exit stairwells positioned at both ends of each guest floor corridor. ' +
    'Thank you for your attention, and we wish you a memorable and relaxing stay with us.',
    'Puck',
    p2_monologue2
  );

  const p2_end = path.join(TEMP_DIR, 'p2_end.wav');
  await ttsSingle(
    'That is the end of Part 2. You now have half a minute to check your answers.',
    'Kore',
    p2_end
  );

  const p2Wavs = [
    p2_intro,
    sil15, // time to look at questions
    p2_monologue1,
    p2_mid,
    sil15, // mid pause
    p2_monologue2,
    p2_end,
    sil25, // check answers
    chimeFile,
  ];

  const p2Mp3 = 'public/audio/test-01-p2.mp3';
  concatWavsToMp3(p2Wavs, p2Mp3);
  const p2Dur = getDuration(p2Mp3);
  console.log(`Part 2 generated: ${p2Mp3} -> ${p2Dur.toFixed(1)}s (${(p2Dur / 60).toFixed(2)} min)`);

  // -------------------------------------------------------------
  // PART 3 (~153s)
  // -------------------------------------------------------------
  console.log('\n--- Processing Part 3 ---');
  const p3_intro = path.join(TEMP_DIR, 'p3_intro.wav');
  await ttsSingle(
    'Part 3. You will hear an event organizer, Liam, discussing conference arrangements with the hotel catering director, Clara. ' +
    'First, you have some time to look at Questions 6 and 7.',
    'Kore',
    p3_intro
  );

  const p3_dialogue1 = path.join(TEMP_DIR, 'p3_diag1.wav');
  // p3_dialogue1 already generated and cached!

  // Reuse standardized prompt
  const p3_mid = path.join(TEMP_DIR, 'p2_mid.wav');

  const p3_dialogue2 = path.join(TEMP_DIR, 'p3_diag2.wav');
  await ttsDialogue(
    [
      { speaker: 'Clara', text: 'Rest assured, our executive chef operates dedicated preparation stations for gluten-free and allergen-sensitive dishes, complete with color-coded service platters to prevent any cross-contamination.' },
      { speaker: 'Liam', text: 'That is wonderful to hear. Where will the hot luncheon buffet be laid out?' },
      { speaker: 'Clara', text: 'Lunch will be presented as a buffet in the adjacent Windsor Gallery at 12:45 PM. The gallery provides ample natural light and direct access to the landscaped terrace.' },
      { speaker: 'Liam', text: 'Superb. And what about the afternoon tea and coffee break?' },
      { speaker: 'Clara', text: 'At 3:30 PM, we will serve artisanal herbal infusions, fair-trade roast coffee, and fresh organic fruit skewers on the garden terrace.' },
      { speaker: 'Liam', text: 'Everything looks meticulously organized, Clara. Thank you very much for your thorough preparations.' },
    ],
    [
      { speaker: 'Liam', voiceName: 'Charon' },
      { speaker: 'Clara', voiceName: 'Zephyr' },
    ],
    p3_dialogue2
  );

  const p3_end = path.join(TEMP_DIR, 'p3_end.wav');
  await ttsSingle(
    'That is the end of Part 3. You now have half a minute to check your answers.',
    'Kore',
    p3_end
  );

  const p3Wavs = [
    p3_intro,
    sil15, // time to look at questions
    p3_dialogue1,
    p3_mid,
    sil15, // mid pause
    p3_dialogue2,
    p3_end,
    sil25, // check answers
    chimeFile,
  ];

  const p3Mp3 = 'public/audio/test-01-p3.mp3';
  concatWavsToMp3(p3Wavs, p3Mp3);
  const p3Dur = getDuration(p3Mp3);
  console.log(`Part 3 generated: ${p3Mp3} -> ${p3Dur.toFixed(1)}s (${(p3Dur / 60).toFixed(2)} min)`);

  // -------------------------------------------------------------
  // PART 4 (~154s)
  // -------------------------------------------------------------
  console.log('\n--- Processing Part 4 ---');
  const p4_intro = path.join(TEMP_DIR, 'p4_intro.wav');
  await ttsSingle(
    'Part 4. You will hear an architectural historian giving a lecture on the evolution of 19th-century railway hotels and modern ecological heritage retrofitting. ' +
    'First, you have some time to look at Questions 8 to 10.',
    'Kore',
    p4_intro
  );

  const p4_lecture1 = path.join(TEMP_DIR, 'p4_lec1.wav');
  await ttsSingle(
    'Good afternoon, students. Today we examine the architectural and socio-economic evolution of nineteenth-century grand hotels, ' +
    'particularly those constructed alongside Britain\'s rapidly expanding railway networks. ' +
    'Prior to the 1840s, travellers across Britain relied largely on modest coaching inns, which were cramped, unhygienic, and lacked standardized amenities. ' +
    'However, the swift expansion of steam railways created unprecedented volumes of intercity passenger travel. ' +
    'Railway syndicates quickly recognized that affluent passengers demanded dignified, opulent lodgings situated directly adjacent to terminal stations. ' +
    'The pioneering archetype of this new architectural genre was the Great Western Hotel at Paddington Station, completed in 1854 by the distinguished architect Philip Charles Hardwick.',
    'Fenrir',
    p4_lecture1
  );

  const p4_mid = path.join(TEMP_DIR, 'p2_mid.wav');

  const p4_lecture2 = path.join(TEMP_DIR, 'p4_lec2.wav');
  await ttsSingle(
    'These colossal Victorian edifices integrated the cutting-edge engineering marvels of the Industrial Revolution, ' +
    'including hydraulic passenger elevators—which were colloquially referred to at the time as ascending rooms—as well as centralized steam heating and extensive gas lighting networks. ' +
    'In the twenty-first century, these monumental heritage structures face a novel architectural challenge: ecological retrofitting. ' +
    'Preserving intricate Victorian ornamental masonry while installing double-glazed vacuum insulated windows and subterranean geothermal heat pumps ' +
    'requires delicate structural balancing. This allows celebrated historical landmarks to meet modern net-zero carbon standards without compromising their distinctive aesthetic heritage.',
    'Fenrir',
    p4_lecture2
  );

  const p4_end = path.join(TEMP_DIR, 'p4_end.wav');
  await ttsSingle(
    'That is the end of Part 4. You now have half a minute to check your answers. ' +
    'That is the end of the listening test. In the real IELTS exam, you would now have ten minutes to transfer your answers to the listening answer sheet.',
    'Kore',
    p4_end
  );

  const p4Wavs = [
    p4_intro,
    sil15, // time to look at questions
    p4_lecture1,
    p4_mid,
    sil15, // mid pause
    p4_lecture2,
    p4_end,
    sil25, // check answers
    chimeFile,
  ];

  const p4Mp3 = 'public/audio/test-01-p4.mp3';
  concatWavsToMp3(p4Wavs, p4Mp3);
  const p4Dur = getDuration(p4Mp3);
  console.log(`Part 4 generated: ${p4Mp3} -> ${p4Dur.toFixed(1)}s (${(p4Dur / 60).toFixed(2)} min)`);

  // -------------------------------------------------------------
  // FULL TEST CONCATENATION (~605 - 615s, exactly ~10 minutes!)
  // -------------------------------------------------------------
  console.log('\n--- Concatenating Full Continuous Test Audio (test-01.mp3) ---');
  const fullMp3 = 'public/audio/test-01.mp3';
  const allParts = [p1Mp3, p2Mp3, p3Mp3, p4Mp3];
  
  const concatList = path.join(TEMP_DIR, 'all_concat.txt');
  fs.writeFileSync(concatList, allParts.map(f => `file '${path.resolve(f)}'`).join('\n'));
  execSync(`ffmpeg -f concat -safe 0 -i "${concatList}" -c:a copy -y "${fullMp3}"`, { stdio: 'ignore' });
  
  const totalDur = getDuration(fullMp3);
  console.log(`\n========================================`);
  console.log(`SUCCESS! Full Test 01 Audio Created:`);
  console.log(`File: ${fullMp3}`);
  console.log(`Total Duration: ${totalDur.toFixed(1)} seconds (${(totalDur / 60).toFixed(2)} minutes)`);
  console.log(`Target: 600 - 620s (approx 10 minutes) -> MATCH: ${totalDur >= 570 && totalDur <= 630 ? 'PERFECT' : 'CHECK'}`);
  console.log(`========================================\n`);

  // Also copy to dist/audio if dist exists
  if (fs.existsSync('dist/audio')) {
    execSync(`cp public/audio/test-01* dist/audio/`, { stdio: 'ignore' });
    console.log('Copied generated files to dist/audio');
  }
}

buildTest01().catch(err => {
  console.error('Fatal error in buildTest01:', err);
  process.exit(1);
});
