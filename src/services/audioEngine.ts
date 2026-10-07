/**
 * Advanced Multi-Part Audio Engine for IELTS Listening Practice
 * Supports HTML5 Audio & Native SpeechSynthesis with multi-part sequential playback,
 * section transition chimes, speaker voices, and full ~10-minute continuous test simulation.
 */

import { ListeningPart } from '../types';

export interface AudioPlaybackState {
  isPlaying: boolean;
  currentTime: number; // Current playback time of active part
  duration: number; // Duration of active part (e.g. 155s)
  overallCurrentTime: number; // Total elapsed time across all 4 parts
  overallDuration: number; // Total duration of all 4 parts combined (~10:00)
  activePartIndex: number; // 0, 1, 2, or 3
  activePartNumber: number; // 1, 2, 3, or 4
  playbackMode: 'part' | 'continuous'; // play one part vs continuous test
  playbackRate: number;
  volume: number;
  isMuted: boolean;
  statusText?: string;
}

export type PlaybackListener = (state: AudioPlaybackState) => void;

interface TimedDialogueLine {
  speaker: string;
  text: string;
  startTime: number;
  spoken?: boolean;
}

class ListeningAudioEngine {
  private audioElement: HTMLAudioElement | null = null;
  private isUsingSpeechSynthesis: boolean = true;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private keepAliveInterval: any = null;

  // Multi-part state
  private parts: ListeningPart[] = [];
  private activePartIndex: number = 0;
  private playbackMode: 'part' | 'continuous' = 'continuous';

  // Timers and duration tracking
  private partDurations: number[] = []; // seconds per part
  private partCurrentTimes: number[] = []; // seconds elapsed per part
  private isPlaying: boolean = false;
  private playbackRate: number = 1.0;
  private volume: number = 1.0;
  private isMuted: boolean = false;
  private timerInterval: any = null;
  private listeners: Set<PlaybackListener> = new Set();

  // Dialogue lines for current part
  private partTimedLines: TimedDialogueLine[] = [];
  private lastSpokenIndex: number = -1;

  // Web Audio Context for chimes and ambient room tone
  private audioContext: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioElement = new Audio();
      this.audioElement.addEventListener('timeupdate', () => {
        if (!this.isUsingSpeechSynthesis && this.audioElement) {
          this.partCurrentTimes[this.activePartIndex] = this.audioElement.currentTime;
          this.notify();
        }
      });
      this.audioElement.addEventListener('ended', () => {
        this.handlePartEnded();
      });
      this.audioElement.addEventListener('error', () => {
        this.fallbackToSpeech();
      });
    }
  }

  public subscribe(listener: PlaybackListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((listener) => listener(state));
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.audioContext || this.audioContext.state === 'closed') {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) this.audioContext = new AudioCtx();
      }
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      return this.audioContext;
    } catch {
      return null;
    }
  }

  public getState(): AudioPlaybackState {
    const curPartDur = this.partDurations[this.activePartIndex] || 155;
    const curPartTime = Math.min(this.partCurrentTimes[this.activePartIndex] || 0, curPartDur);

    // Calculate total duration and elapsed time across all parts
    const totalDuration = this.partDurations.reduce((acc, d) => acc + d, 0) || 610;
    let totalElapsed = 0;
    for (let i = 0; i < this.parts.length; i++) {
      if (i < this.activePartIndex) {
        totalElapsed += this.partDurations[i] || 0;
      } else if (i === this.activePartIndex) {
        totalElapsed += curPartTime;
      }
    }

    const curPart = this.parts[this.activePartIndex];
    let status = 'Ready to play';
    if (this.isPlaying) {
      status = `Playing Part ${this.activePartIndex + 1}: ${curPart ? curPart.title.replace(/^Part \d+:\s*/, '') : ''}`;
    }

    return {
      isPlaying: this.isPlaying,
      currentTime: curPartTime,
      duration: curPartDur,
      overallCurrentTime: Math.min(totalElapsed, totalDuration),
      overallDuration: totalDuration,
      activePartIndex: this.activePartIndex,
      activePartNumber: this.activePartIndex + 1,
      playbackMode: this.playbackMode,
      playbackRate: this.playbackRate,
      volume: this.volume,
      isMuted: this.isMuted,
      statusText: status,
    };
  }

  /**
   * Loads a multi-part test with Part 1, 2, 3, 4
   */
  public loadMultiPartTest(
    parts: ListeningPart[],
    initialPartIndex = 0,
    mode: 'part' | 'continuous' = 'continuous'
  ) {
    this.stop();
    this.parts = parts.length > 0 ? parts : [];
    this.activePartIndex = Math.max(0, Math.min(initialPartIndex, this.parts.length - 1));
    this.playbackMode = mode;

    // Calculate exact duration for each part
    this.partDurations = this.parts.map((part) => {
      if (part.durationSeconds && part.durationSeconds > 60) {
        return part.durationSeconds;
      }
      if (part.durationMinutes && part.durationMinutes > 0) {
        return Math.round(part.durationMinutes * 60);
      }
      return 150;
    });

    this.partCurrentTimes = this.parts.map(() => 0);
    this.prepareCurrentPart();
    this.notify();
  }

  public loadTrack(audioUrl: string | undefined, scriptText: string, estimatedDurationSec: number = 600) {
    const singlePart: ListeningPart = {
      id: 'part-single',
      partNumber: 1,
      title: 'Full Test',
      situation: 'Complete Listening Audio',
      durationMinutes: Math.round(estimatedDurationSec / 60) || 10,
      durationSeconds: estimatedDurationSec,
      audioUrl,
      audioScript: scriptText,
      questions: [],
    };
    this.loadMultiPartTest([singlePart], 0, 'part');
  }

  private prepareCurrentPart() {
    const curPart = this.parts[this.activePartIndex];
    if (!curPart) return;

    if (curPart.audioUrl && curPart.audioUrl.startsWith('http')) {
      this.isUsingSpeechSynthesis = false;
      if (this.audioElement) {
        this.audioElement.src = curPart.audioUrl;
        this.audioElement.currentTime = this.partCurrentTimes[this.activePartIndex] || 0;
        this.audioElement.load();
      }
    } else {
      this.isUsingSpeechSynthesis = true;
      this.prepareTimedDialogue(curPart);
    }
  }

  /**
   * Parses the script text into dialogue lines with realistic exam scheduling
   */
  private prepareTimedDialogue(part: ListeningPart) {
    const rawScript = part.audioScript || '';
    const totalPartSec = this.partDurations[this.activePartIndex] || 155;

    // Break lines by speaker labels or paragraphs
    const lines = rawScript
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    // Reserved time: Intro (12s), Check answers end (20s)
    const introDuration = 12;
    const endDuration = 20;
    const speechWindow = Math.max(30, totalPartSec - introDuration - endDuration);

    const timedLines: TimedDialogueLine[] = [];

    // IELTS official intro line
    timedLines.push({
      speaker: 'Narrator',
      text: `Part ${part.partNumber}. ${part.title}. Look at the questions. Listen carefully.`,
      startTime: 0,
      spoken: false,
    });

    if (lines.length > 0) {
      const step = speechWindow / Math.max(1, lines.length);
      lines.forEach((line, idx) => {
        let speaker = 'Speaker';
        let text = line;
        const match = line.match(/^([^:]+):\s*(.+)$/);
        if (match) {
          speaker = match[1].trim();
          text = match[2].trim();
        }
        timedLines.push({
          speaker,
          text,
          startTime: introDuration + idx * step,
          spoken: false,
        });
      });
    }

    // End line
    timedLines.push({
      speaker: 'Narrator',
      text: `That is the end of Part ${part.partNumber}. You now have half a minute to check your answers.`,
      startTime: totalPartSec - endDuration,
      spoken: false,
    });

    this.partTimedLines = timedLines;
    this.lastSpokenIndex = -1;
  }

  /**
   * Plays authentic IELTS section chime tones (dual tone high-pitched chime)
   */
  public playTone(freq: number = 880, durationMs: number = 250) {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(this.isMuted ? 0 : 0.08 * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + durationMs / 1000);
    } catch {
      // AudioContext unavailable
    }
  }

  public play() {
    if (this.isPlaying) return;

    const curPart = this.parts[this.activePartIndex];
    if (!curPart) return;

    this.getAudioContext();

    if (!this.isUsingSpeechSynthesis && this.audioElement && this.audioElement.src) {
      this.audioElement.playbackRate = this.playbackRate;
      this.audioElement.volume = this.isMuted ? 0 : this.volume;
      this.audioElement.currentTime = this.partCurrentTimes[this.activePartIndex] || 0;
      this.audioElement
        .play()
        .then(() => {
          this.isPlaying = true;
          this.startSimulatedTimer();
          this.notify();
        })
        .catch(() => {
          this.fallbackToSpeech();
          this.startSpeechPlayback();
        });
    } else {
      this.startSpeechPlayback();
    }
  }

  private fallbackToSpeech() {
    this.isUsingSpeechSynthesis = true;
    const curPart = this.parts[this.activePartIndex];
    if (curPart) this.prepareTimedDialogue(curPart);
  }

  private startSpeechPlayback() {
    this.isPlaying = true;
    this.playTone(880, 200);

    // Start keep-alive interval to defeat Chrome 15s pause bug
    this.startKeepAlive();

    // Start clock timer
    this.startSimulatedTimer();

    // Check dialogue line for current timestamp
    this.checkDialogueAtCurrentTime();
    this.notify();
  }

  private startKeepAlive() {
    this.stopKeepAlive();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.keepAliveInterval = setInterval(() => {
        if (this.isPlaying && window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 6000);
    }
  }

  private stopKeepAlive() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
  }

  private checkDialogueAtCurrentTime() {
    if (!this.isPlaying || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const curTime = this.partCurrentTimes[this.activePartIndex] || 0;

    // Find the next eligible line that hasn't been spoken yet
    for (let i = 0; i < this.partTimedLines.length; i++) {
      const line = this.partTimedLines[i];
      if (!line.spoken && curTime >= line.startTime) {
        line.spoken = true;
        this.lastSpokenIndex = i;
        this.speakSingleLine(line);
        break;
      }
    }
  }

  private speakSingleLine(line: TimedDialogueLine) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(line.text);
      utterance.rate = Math.max(0.75, Math.min(1.4, this.playbackRate * 0.98));
      utterance.volume = this.isMuted ? 0 : this.volume;

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const enVoices = voices.filter(
          (v) =>
            v.lang.startsWith('en') ||
            v.name.includes('UK') ||
            v.name.includes('British') ||
            v.name.includes('Australian') ||
            v.name.includes('English')
        );

        if (enVoices.length > 0) {
          // Alternate voices based on speaker hash
          const hash = line.speaker.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
          utterance.voice = enVoices[hash % enVoices.length];
        }
      }

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch {
      // SpeechSynthesis suppressed
    }
  }

  private startSimulatedTimer() {
    this.stopTimer();
    const intervalMs = 250;
    this.timerInterval = setInterval(() => {
      if (this.isPlaying) {
        const curDur = this.partDurations[this.activePartIndex] || 155;
        this.partCurrentTimes[this.activePartIndex] = Math.min(
          curDur,
          (this.partCurrentTimes[this.activePartIndex] || 0) + (intervalMs / 1000) * this.playbackRate
        );

        // Check dialogue cues
        if (this.isUsingSpeechSynthesis) {
          this.checkDialogueAtCurrentTime();
        }

        if (this.partCurrentTimes[this.activePartIndex] >= curDur) {
          this.handlePartEnded();
        } else {
          this.notify();
        }
      }
    }, intervalMs);
  }

  private stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private handlePartEnded() {
    this.stopTimer();
    this.stopKeepAlive();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    const curDur = this.partDurations[this.activePartIndex] || 155;
    this.partCurrentTimes[this.activePartIndex] = curDur;

    // In continuous mode, auto-advance to next part until end of Part 4!
    if (this.playbackMode === 'continuous' && this.activePartIndex < this.parts.length - 1) {
      this.playTone(660, 300);
      this.activePartIndex += 1;
      this.partCurrentTimes[this.activePartIndex] = 0;
      this.prepareCurrentPart();
      this.notify();
      // Brief transitional pause (1s) then resume next part
      setTimeout(() => {
        if (this.playbackMode === 'continuous') {
          this.play();
        }
      }, 1000);
    } else {
      // Completed final part
      this.isPlaying = false;
      this.playTone(523, 400); // Concluding chime
      this.notify();
    }
  }

  public pause() {
    this.isPlaying = false;
    this.stopTimer();
    this.stopKeepAlive();

    if (!this.isUsingSpeechSynthesis && this.audioElement) {
      this.audioElement.pause();
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    this.notify();
  }

  public stop() {
    this.isPlaying = false;
    this.stopTimer();
    this.stopKeepAlive();

    if (!this.isUsingSpeechSynthesis && this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    this.partCurrentTimes = this.parts.map(() => 0);
    this.notify();
  }

  public switchPart(index: number) {
    const targetIdx = Math.max(0, Math.min(index, this.parts.length - 1));
    const wasPlaying = this.isPlaying;
    this.pause();
    this.activePartIndex = targetIdx;
    this.partCurrentTimes[targetIdx] = 0;
    this.prepareCurrentPart();
    this.notify();
    if (wasPlaying) {
      this.play();
    }
  }

  public setPlaybackMode(mode: 'part' | 'continuous') {
    this.playbackMode = mode;
    this.notify();
  }

  public seek(targetPartSeconds: number) {
    const curDur = this.partDurations[this.activePartIndex] || 155;
    const clamped = Math.max(0, Math.min(targetPartSeconds, curDur));
    this.partCurrentTimes[this.activePartIndex] = clamped;

    if (!this.isUsingSpeechSynthesis && this.audioElement) {
      this.audioElement.currentTime = clamped;
    } else {
      // Reset spoken flags for lines after clamped time
      this.partTimedLines.forEach((line) => {
        line.spoken = line.startTime < clamped;
      });
      if (this.isPlaying) {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        this.checkDialogueAtCurrentTime();
      }
    }
    this.notify();
  }

  public seekOverall(totalSeconds: number) {
    let accumulated = 0;
    for (let i = 0; i < this.parts.length; i++) {
      const partDur = this.partDurations[i] || 155;
      if (totalSeconds <= accumulated + partDur || i === this.parts.length - 1) {
        const wasPlaying = this.isPlaying;
        if (this.activePartIndex !== i) {
          this.pause();
          this.activePartIndex = i;
          this.prepareCurrentPart();
        }
        const offset = Math.max(0, totalSeconds - accumulated);
        this.seek(offset);
        if (wasPlaying) this.play();
        return;
      }
      accumulated += partDur;
    }
  }

  public skip(secondsDelta: number) {
    const curTime = this.partCurrentTimes[this.activePartIndex] || 0;
    this.seek(curTime + secondsDelta);
  }

  public setPlaybackRate(rate: number) {
    this.playbackRate = rate;
    if (!this.isUsingSpeechSynthesis && this.audioElement) {
      this.audioElement.playbackRate = rate;
    } else if (this.isPlaying) {
      this.pause();
      this.play();
    }
    this.notify();
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    this.isMuted = this.volume === 0;
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
    this.notify();
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.audioElement) {
      this.audioElement.muted = this.isMuted;
    }
    this.notify();
  }
}

export const audioEngine = new ListeningAudioEngine();
