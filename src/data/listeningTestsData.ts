import { ListeningTest } from '../types';

export const SEED_LISTENING_TESTS: ListeningTest[] = [
  // Test 01: Booking a Hotel Room
  {
    id: 'list-01',
    slug: 'test-01',
    audioUrl: '/audio/test-01.mp3',
    title: 'Listening Test 01: Booking a Hotel Room',
    topic: 'Booking a Hotel Room',
    description: 'Complete 10-minute IELTS Listening exam simulation featuring 4 progressive parts: room reservation enquiry, guest services overview, corporate conference logistics, and architectural history of urban hotels.',
    difficulty: 'Intermediate',
    durationMinutes: 10,
    totalDurationSeconds: 610,
    section: 1,
    parts: [
      {
        id: 'list-01-p1',
        partNumber: 1,
        audioUrl: '/audio/test-01-p1.mp3',
        title: 'Part 1: Room Reservation & Special Requirements',
        situation: 'Telephone conversation between an international traveler and the reservation manager at the Grand Regency Hotel.',
        durationMinutes: 2.5,
        durationSeconds: 155,
        audioScript: `Receptionist: Good afternoon and welcome to the Grand Regency Hotel reservations desk. My name is Julian. How may I assist you today?
Customer: Hello Julian. I would like to book accommodation for next month. My family and I are visiting for a conference and a brief holiday.
Receptionist: Certainly, sir. Let me assist you with that. Could I first have your full name, please?
Customer: Yes, it is Robert Henderson. That is H-E-N-D-E-R-S-O-N.
Receptionist: Thank you, Mr. Henderson. And what dates are you planning to check in and check out?
Customer: We will be arriving on Friday the 14th of November and departing on Tuesday the 18th of November, so that will be four nights in total.
Receptionist: Excellent. How many guests will be in your party, and what type of room would you prefer?
Customer: There will be three of us: my wife, our ten-year-old daughter, and myself. We would ideally like an executive family suite with two queen-sized beds and a balcony facing the botanical gardens.
Receptionist: Let me check our availability calendar for November... Yes, we have an Executive Garden Suite available on the fourth floor. The standard rate is normally two hundred and forty pounds per night, but because you are staying for four nights, our seasonal discount brings it down to two hundred and ten pounds per night, which includes a full English breakfast.
Customer: That sounds very reasonable. Does the suite include high-speed wireless internet and airport transfer?
Receptionist: Complimentary high-speed Wi-Fi is included throughout the property. Airport transfers can be arranged with our private shuttle service for an additional charge of twenty-five pounds each way.
Customer: Wonderful, please add the airport pickup for our arrival on Friday afternoon. My mobile contact number is 07820 449 120.
Receptionist: Splendid. I have reserved the suite under your name, and an email confirmation will be sent shortly.`,
        questions: [
          {
            id: 'lq-01-1',
            number: 1,
            type: 'form_completion',
            prompt: 'Guest Surname: __________',
            instructions: 'Write ONE WORD ONLY.',
            correctAnswers: ['henderson'],
            explanation: {
              whyCorrect: 'The customer explicitly spells his surname: "Robert Henderson. That is H-E-N-D-E-R-S-O-N."',
              timestamp: '0:32',
              importantClue: 'H-E-N-D-E-R-S-O-N',
              vocabularyNote: 'Surname dictation is a key IELTS Section 1 test item.',
              mistakeCategory: 'Spelling mistake',
            },
          },
          {
            id: 'lq-01-2',
            number: 2,
            type: 'short_answer',
            prompt: 'What is the discounted nightly room rate in pounds?',
            instructions: 'Write ONE NUMBER ONLY.',
            correctAnswers: ['210', '£210', '210 pounds'],
            explanation: {
              whyCorrect: 'Julian says: "...our seasonal discount brings it down to two hundred and ten pounds per night."',
              timestamp: '1:18',
              importantClue: 'two hundred and ten pounds (distractor: 240 standard rate)',
              vocabularyNote: 'Watch out for price distractors before final discount.',
              mistakeCategory: 'Distractor confusion',
            },
          },
          {
            id: 'lq-01-3',
            number: 3,
            type: 'form_completion',
            prompt: 'Additional fee for airport shuttle: £__________ each way',
            instructions: 'Write the number only.',
            correctAnswers: ['25'],
            explanation: {
              whyCorrect: 'Julian clarifies: "...for an additional charge of twenty-five pounds each way."',
              timestamp: '1:45',
              importantClue: 'twenty-five pounds each way',
              vocabularyNote: 'Numerical cost identification.',
              mistakeCategory: 'Number confusion',
            },
          },
        ],
      },
      {
        id: 'list-01-p2',
        partNumber: 2,
        audioUrl: '/audio/test-01-p2.mp3',
        title: 'Part 2: Hotel Guest Amenities & Safety Briefing',
        situation: 'Monologue by the head concierge addressing new hotel guests in the reception atrium.',
        durationMinutes: 2.2,
        durationSeconds: 145,
        audioScript: `Good evening everyone, and a cordial welcome to the Grand Regency Hotel. My name is Marcus, the head concierge. Before you unpack and unwind, I would like to share key information regarding our amenities, leisure facilities, and dining schedule.
First, our flagship dining room, The Orangery, is situated on the mezzanine level. Breakfast is served daily from 6:30 AM until 10:00 AM on weekdays, and is extended until 11:00 AM on weekends. For evening dining, table reservations are strongly recommended after 7:30 PM due to high demand.
Second, for health and wellness, our state-of-the-art fitness centre and heated saltwater swimming pool are located on the basement level. These facilities are accessible 24 hours a day using your digital keycard. Please note that children under the age of 14 must be accompanied by an adult inside the pool enclosure at all times.
Finally, if you require dry cleaning or laundry services, garments placed in the blue laundry bag before 9:00 AM will be returned by 6:00 PM on the same business day. In the unlikely event of an emergency evacuation, please do not use the elevators; locate the green illuminated stairwell exits at both ends of each corridor. We wish you an exceptional stay with us.`,
        questions: [
          {
            id: 'lq-01-4',
            number: 4,
            type: 'multiple_choice',
            prompt: 'On weekends, what time does breakfast service conclude in The Orangery?',
            options: ['9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'],
            correctAnswers: ['11:00 AM'],
            explanation: {
              whyCorrect: 'Marcus states: "...extended until 11:00 AM on weekends."',
              timestamp: '0:38',
              importantClue: '10:00 AM is for weekdays, 11:00 AM for weekends.',
              vocabularyNote: 'Listen for contrasting schedule conditions.',
              mistakeCategory: 'Distractor confusion',
            },
          },
          {
            id: 'lq-01-5',
            number: 5,
            type: 'sentence_completion',
            prompt: 'Children under the age of __________ must be accompanied by an adult in the pool enclosure.',
            instructions: 'Write ONE NUMBER ONLY.',
            correctAnswers: ['14'],
            explanation: {
              whyCorrect: 'Marcus states: "Please note that children under the age of 14 must be accompanied..."',
              timestamp: '1:12',
              importantClue: 'under the age of 14',
              vocabularyNote: 'Age threshold listening.',
              mistakeCategory: 'Number confusion',
            },
          },
        ],
      },
      {
        id: 'list-01-p3',
        partNumber: 3,
        audioUrl: '/audio/test-01-p3.mp3',
        title: 'Part 3: Corporate Event & Catering Review Meeting',
        situation: 'Discussion between an event organizer and hotel catering director reviewing seminar arrangements.',
        durationMinutes: 2.6,
        durationSeconds: 160,
        audioScript: `Organizer: Good morning, Clara. Thank you for meeting with me to review the final arrangements for our upcoming International Renewable Energy Symposium.
Catering Director: My pleasure, Liam. Let us verify the room allocation and technical setup first. You have selected the Churchill Auditorium for the morning plenary sessions, correct?
Organizer: Yes, that is correct. We expect approximately 140 delegates. We will need three roaming lapel microphones for the panel discussion, along with dual high-definition projection screens.
Catering Director: Not a problem. Our technical team will test all audio-visual feeds at 7:30 AM before the delegates arrive. Now, regarding the dietary requirements for the luncheon: you indicated earlier that 18 delegates requested vegan options, while 12 delegates have strict gluten intolerances.
Organizer: Precisely. We also have two keynote speakers from Japan who requested halal-certified meals. Can the kitchen accommodate this without cross-contamination?
Catering Director: Absolutely. Our executive chef has established separate prep stations for specific allergen and halal requests, complete with color-coded service trays. Lunch will be presented as a buffet in the adjacent Windsor Gallery at 12:45 PM.
Organizer: That is comforting to know. And what about the afternoon refreshments?
Catering Director: At 3:30 PM, we will serve artisanal herbal infusions, fair-trade coffee, and organic fruit skewers in the garden terrace.`,
        questions: [
          {
            id: 'lq-01-6',
            number: 6,
            type: 'multiple_choice',
            prompt: 'How many delegates have requested gluten-free meal options?',
            options: ['12 delegates', '14 delegates', '18 delegates', '140 delegates'],
            correctAnswers: ['12 delegates'],
            explanation: {
              whyCorrect: 'Liam confirms: "...while 12 delegates have strict gluten intolerances." (18 is vegan, 140 is total delegates).',
              timestamp: '0:54',
              importantClue: '12 delegates have strict gluten intolerances',
              vocabularyNote: 'Careful with numerical distractor sets.',
              mistakeCategory: 'Distractor confusion',
            },
          },
          {
            id: 'lq-01-7',
            number: 7,
            type: 'note_completion',
            prompt: 'Lunch buffet will be served in the __________ Gallery at 12:45 PM.',
            instructions: 'Write ONE WORD ONLY.',
            correctAnswers: ['windsor'],
            explanation: {
              whyCorrect: 'Clara notes: "Lunch will be presented as a buffet in the adjacent Windsor Gallery..."',
              timestamp: '1:32',
              importantClue: 'Windsor Gallery',
              vocabularyNote: 'Proper noun facility location.',
              mistakeCategory: 'Missed keyword',
            },
          },
        ],
      },
      {
        id: 'list-01-p4',
        partNumber: 4,
        audioUrl: '/audio/test-01-p4.mp3',
        title: 'Part 4: The Evolution of Grand Railway Hotels',
        situation: 'University lecture in architectural history detailing the rise and ecological adaptation of heritage hospitality buildings.',
        durationMinutes: 2.7,
        durationSeconds: 150,
        audioScript: `Lecturer: Good afternoon, students. Today we examine the architectural and socio-economic evolution of 19th-century grand hotels, particularly those constructed alongside Britain's expanding railway networks.
Prior to the 1840s, travelers relied largely on modest coaching inns, which were cramped and lacked standardized amenities. However, the rapid expansion of steam locomotives created unprecedented volumes of intercity passenger traffic. Railway syndicates quickly realized that affluent travelers required dignified, opulent lodgings immediately adjacent to terminal stations.
The pioneering archetype was the Great Western Hotel at Paddington Station, completed in 1854 by architect Philip Charles Hardwick. These colossal edifices integrated cutting-edge technological innovations of the Industrial Revolution, including hydraulic passenger elevators—colloquially called 'ascending rooms'—centralized steam heating, and gas lighting networks.
In the 21st century, these heritage structures face a novel architectural challenge: ecological retrofitting. Preserving ornamental Victorian masonry while installing double-glazed vacuum insulated glass and geothermal heat pumps requires delicate structural balancing, allowing historical landmarks to meet contemporary net-zero carbon standards without compromising their aesthetic heritage.`,
        questions: [
          {
            id: 'lq-01-8',
            number: 8,
            type: 'short_answer',
            prompt: 'What architectural term was colloquially used for hydraulic elevators in early grand hotels?',
            instructions: 'Write NO MORE THAN TWO WORDS.',
            correctAnswers: ['ascending rooms', 'ascending room'],
            explanation: {
              whyCorrect: 'The lecturer notes: "...hydraulic passenger elevators—colloquially called \'ascending rooms\'..."',
              timestamp: '1:10',
              importantClue: 'colloquially called ascending rooms',
              vocabularyNote: 'Colloquial historical vocabulary.',
              mistakeCategory: 'Vocabulary problem',
            },
          },
          {
            id: 'lq-01-9',
            number: 9,
            type: 'sentence_completion',
            prompt: 'Modern retrofitting installs geothermal __________ pumps to achieve net-zero carbon standards.',
            instructions: 'Write ONE WORD ONLY.',
            correctAnswers: ['heat'],
            explanation: {
              whyCorrect: 'Lecturer states: "...installing double-glazed vacuum insulated glass and geothermal heat pumps..."',
              timestamp: '1:50',
              importantClue: 'geothermal heat pumps',
              vocabularyNote: 'Environmental engineering term.',
              mistakeCategory: 'Missed keyword',
            },
          },
          {
            id: 'lq-01-10',
            number: 10,
            type: 'multiple_choice',
            prompt: 'In which year was the archetype Great Western Hotel at Paddington Station completed?',
            options: ['1840', '1848', '1854', '1864'],
            correctAnswers: ['1854'],
            explanation: {
              whyCorrect: 'Lecturer affirms: "...completed in 1854 by architect Philip Charles Hardwick."',
              timestamp: '0:58',
              importantClue: 'completed in 1854',
              vocabularyNote: 'Historical year date listening.',
              mistakeCategory: 'Number confusion',
            },
          },
        ],
      },
    ],
  },

  // Test 02: University Student Orientation
  {
    id: 'list-02',
    slug: 'test-02',
    audioUrl: '/audio/test-02.mp3',
    title: 'Listening Test 02: University Student Orientation',
    topic: 'University Student Orientation',
    description: 'Comprehensive 10-minute 4-part IELTS listening exam covering campus registration, student union clubs, academic integrity tutorial, and lecture on cognitive study habits.',
    difficulty: 'Intermediate',
    durationMinutes: 10,
    totalDurationSeconds: 615,
    section: 1,
    parts: [
      {
        id: 'list-02-p1',
        partNumber: 1,
        audioUrl: '/audio/test-02-p1.mp3',
        title: 'Part 1: Student Registration & ID Badge Issuance',
        situation: 'New student registering with the university international admissions officer.',
        durationMinutes: 2.5,
        durationSeconds: 155,
        audioScript: `Officer: Good morning. Welcome to Saint Jude University admissions registry. Are you here to collect your enrollment pack?
Student: Yes, good morning. I just arrived yesterday from Canada. My name is Thomas Albright.
Officer: Welcome to the campus, Thomas. Let me pull up your student portal file. Could you give me your student ID number?
Student: Yes, it is S-T-U-8-8-4-0-9.
Officer: Perfect. You are enrolled in the Bachelor of Science in Environmental Engineering, correct?
Student: That is correct. I have also brought my original passport and my academic transcript from Vancouver.
Officer: Excellent. I have verified your visa status. Now, regarding your student smartcard: this card serves as your library access key, your dormitory door pass, and your bus transit pass for city routes. To activate it, you will need to upload a digital passport photo before Friday 5:00 PM.
Student: Where do I collect the physical card once activated?
Officer: From the Student Service Hub on the ground floor of the Carrington Building, right next to the central bookstore.`,
        questions: [
          {
            id: 'lq-02-1',
            number: 1,
            type: 'form_completion',
            prompt: 'Student ID Number: STU-__________',
            instructions: 'Write the digits only.',
            correctAnswers: ['88409'],
            explanation: {
              whyCorrect: 'Thomas recites: "S-T-U-8-8-4-0-9."',
              timestamp: '0:35',
              importantClue: '88409',
              vocabularyNote: 'Alphanumeric identification dictation.',
              mistakeCategory: 'Number confusion',
            },
          },
          {
            id: 'lq-02-2',
            number: 2,
            type: 'short_answer',
            prompt: 'In which building is the Student Service Hub located?',
            instructions: 'Write ONE WORD ONLY.',
            correctAnswers: ['carrington'],
            explanation: {
              whyCorrect: 'Officer specifies: "...ground floor of the Carrington Building..."',
              timestamp: '1:32',
              importantClue: 'Carrington Building',
              vocabularyNote: 'Campus location name.',
              mistakeCategory: 'Spelling mistake',
            },
          },
        ],
      },
      {
        id: 'list-02-p2',
        partNumber: 2,
        audioUrl: '/audio/test-02-p2.mp3',
        title: 'Part 2: Student Union Societies & Volunteer Opportunities',
        situation: 'Student Union President briefing first-year students on extracurricular activities.',
        durationMinutes: 2.3,
        durationSeconds: 145,
        audioScript: `Hello everyone! I am Priya, President of the Student Union. University life is not merely about lecture halls and laboratory tutorials; it is about building lifelong friendships and discovering unexpected passions.
This week we have over 120 registered societies showcasing their activities in the Great Hall. Whether you are passionate about competitive debating, photography, ballroom dancing, or rock climbing, there is something for everyone.
Annual membership for most societies is just £5, which covers workshops and equipment usage. Furthermore, our Community Outreach Volunteer Scheme offers certified volunteering hours that appear on your official graduation transcript. If you are interested in tutoring local primary school pupils in mathematics or assisting with urban tree planting, sign up at desk 14 before Wednesday.`,
        questions: [
          {
            id: 'lq-02-3',
            number: 3,
            type: 'short_answer',
            prompt: 'How much is the typical annual membership fee for societies in pounds?',
            instructions: 'Write ONE NUMBER ONLY.',
            correctAnswers: ['5', '£5', '5 pounds'],
            explanation: {
              whyCorrect: 'Priya states: "Annual membership for most societies is just £5..."',
              timestamp: '0:50',
              importantClue: 'just £5',
              vocabularyNote: 'Currency figure listening.',
              mistakeCategory: 'Number confusion',
            },
          },
          {
            id: 'lq-02-4',
            number: 4,
            type: 'multiple_choice',
            prompt: 'At which desk can students sign up for community outreach volunteer programs?',
            options: ['Desk 4', 'Desk 12', 'Desk 14', 'Desk 20'],
            correctAnswers: ['Desk 14'],
            explanation: {
              whyCorrect: 'Priya states: "...sign up at desk 14 before Wednesday."',
              timestamp: '1:20',
              importantClue: 'desk 14',
              vocabularyNote: 'Desk number identification.',
              mistakeCategory: 'Number confusion',
            },
          },
        ],
      },
      {
        id: 'list-02-p3',
        partNumber: 3,
        audioUrl: '/audio/test-02-p3.mp3',
        title: 'Part 3: Academic Writing & Plagiarism Avoidance Tutorial',
        situation: 'Tutorial between a faculty advisor and two undergraduate researchers reviewing thesis citations.',
        durationMinutes: 2.6,
        durationSeconds: 160,
        audioScript: `Advisor: Good afternoon, Liam and Maya. I asked you both here today to discuss referencing conventions and academic integrity for your literature review project.
Maya: Thank you, Dr. Evans. We noticed that our department uses APA 7th edition referencing, but some of our journal articles use Harvard style.
Advisor: That is common. What matters is internal consistency within your submitted paper. Every paraphrase or direct citation must have both an in-text author-date citation and a full entry in your alphabetical bibliography. Remember: paraphrasing without citing the original conceptual author constitutes academic misconduct, even if you altered the phrasing.
Liam: What is the maximum recommended percentage of direct quotations in our essay?
Advisor: In scientific writing, direct verbatim quotes should account for less than five percent of your total word count. We expect you to synthesize and critique findings in your own words.`,
        questions: [
          {
            id: 'lq-02-5',
            number: 5,
            type: 'multiple_choice',
            prompt: 'According to Dr. Evans, direct quotations should not exceed what percentage of total word count?',
            options: ['Less than 5 percent', 'Less than 10 percent', 'Less than 15 percent', 'Less than 20 percent'],
            correctAnswers: ['Less than 5 percent', '5%'],
            explanation: {
              whyCorrect: 'Dr. Evans advises: "...direct verbatim quotes should account for less than five percent of your total word count."',
              timestamp: '1:15',
              importantClue: 'less than five percent',
              vocabularyNote: 'Percentage listening in academic advice.',
              mistakeCategory: 'Number confusion',
            },
          },
          {
            id: 'lq-02-6',
            number: 6,
            type: 'note_completion',
            prompt: 'Every source must have an in-text author-date citation and a full entry in the __________ bibliography.',
            instructions: 'Write ONE WORD ONLY.',
            correctAnswers: ['alphabetical'],
            explanation: {
              whyCorrect: 'Dr. Evans states: "...and a full entry in your alphabetical bibliography."',
              timestamp: '0:48',
              importantClue: 'alphabetical bibliography',
              vocabularyNote: 'Academic formatting conventions.',
              mistakeCategory: 'Spelling mistake',
            },
          },
        ],
      },
      {
        id: 'list-02-p4',
        partNumber: 4,
        audioUrl: '/audio/test-02-p4.mp3',
        title: 'Part 4: Cognitive Science of Spaced Retrieval Practice',
        situation: 'Psychology lecture explaining how spaced repetition and active recall optimize long-term semantic memory.',
        durationMinutes: 2.6,
        durationSeconds: 155,
        audioScript: `Lecturer: In today's study skills symposium, we examine empirical research into neuroplasticity and mnemonic retention.
Most undergraduate students rely intuitively upon passive re-reading of textbooks and linear highlighting. Cognitive trials pioneered by Hermann Ebbinghaus demonstrate that passive review yields a staggering seventy percent decay in retention within forty-eight hours—a phenomenon termed the forgetting curve.
In contrast, active retrieval practice—such as self-testing with digital flashcards or writing explanatory summaries from memory without looking at notes—forces the prefrontal cortex to reconstruct synaptic pathways. When combined with spaced repetition intervals of two, four, and eight days, information is consolidated from labile working memory into stable long-term neocortical networks.`,
        questions: [
          {
            id: 'lq-02-7',
            number: 7,
            type: 'short_answer',
            prompt: 'What proportion of passive review information decays within forty-eight hours according to the forgetting curve?',
            instructions: 'Write the percentage.',
            correctAnswers: ['70 percent', '70%'],
            explanation: {
              whyCorrect: 'The lecturer notes: "...passive review yields a staggering seventy percent decay in retention within forty-eight hours..."',
              timestamp: '0:45',
              importantClue: 'seventy percent decay',
              vocabularyNote: 'Numerical data extraction.',
              mistakeCategory: 'Number confusion',
            },
          },
          {
            id: 'lq-02-8',
            number: 8,
            type: 'sentence_completion',
            prompt: 'Spaced repetition combined with active retrieval transfers memories from labile working memory to the __________.',
            instructions: 'Write ONE WORD ONLY.',
            correctAnswers: ['neocortex', 'neocortical networks'],
            explanation: {
              whyCorrect: 'Lecturer confirms: "...into stable long-term neocortical networks."',
              timestamp: '1:40',
              importantClue: 'into stable long-term neocortical networks',
              vocabularyNote: 'Biological neuroscience terminology.',
              mistakeCategory: 'Vocabulary problem',
            },
          },
        ],
      },
    ],
  },

  // Test 03: Joining a Sports Club
  {
    id: 'list-03',
    slug: 'test-03',
    audioUrl: '/audio/test-03.mp3',
    title: 'Listening Test 03: Joining a Sports Club',
    topic: 'Joining a Sports Club',
    description: '10-minute 4-part IELTS listening exam covering sports club membership enquiry, gym safety induction, sports nutrition lecture, and physiology of anaerobic training.',
    difficulty: 'Intermediate',
    durationMinutes: 10,
    totalDurationSeconds: 605,
    section: 1,
    parts: [
      {
        id: 'list-03-p1',
        partNumber: 1,
        audioUrl: '/audio/test-03-p1.mp3',
        title: 'Part 1: Sports Complex Membership Registration',
        situation: 'Conversation between a prospective member and a sports centre receptionist.',
        durationMinutes: 2.5,
        durationSeconds: 150,
        audioScript: `Receptionist: Good morning, Riverside Athletic Club. How can I help you today?
Customer: Hello. I recently relocated to the district and would like to inquire about joining your fitness club.
Receptionist: Welcome to the neighborhood! We offer three membership tiers: Bronze, Silver, and Gold. Silver is our most popular tier; it gives you unlimited access to our Olympic swimming pool, free weights room, and tennis courts. The monthly fee is £45.
Customer: Does that include group fitness classes like yoga or spinning?
Receptionist: Yoga and pilates are included in the Silver membership. High-intensity spinning classes require a supplementary fee of £3 per session unless you upgrade to the Gold tier at £60 per month.
Customer: I see. What are your opening hours on weekdays and weekends?
Receptionist: On weekdays, we open from 6:00 AM to 10:00 PM. On Saturdays and Sundays, we are open from 7:30 AM to 8:00 PM.
Customer: That suits my working hours perfectly. Can I register today? My name is Daniel Webster.
Receptionist: Certainly, Daniel. You will also receive one free personal training assessment during your first week.`,
        questions: [
          {
            id: 'lq-03-1',
            number: 1,
            type: 'form_completion',
            prompt: 'Monthly fee for Silver membership: £__________',
            instructions: 'Write ONE NUMBER ONLY.',
            correctAnswers: ['45'],
            explanation: {
              whyCorrect: 'Receptionist affirms: "The monthly fee is £45."',
              timestamp: '0:38',
              importantClue: 'monthly fee is £45',
              vocabularyNote: 'Numerical membership cost.',
              mistakeCategory: 'Number confusion',
            },
          },
          {
            id: 'lq-03-2',
            number: 2,
            type: 'short_answer',
            prompt: 'What time does the club open on weekends?',
            instructions: 'Write the time.',
            correctAnswers: ['7:30 am', '7:30', '7.30 am'],
            explanation: {
              whyCorrect: 'Receptionist states: "On Saturdays and Sundays, we are open from 7:30 AM..."',
              timestamp: '1:10',
              importantClue: '7:30 AM',
              vocabularyNote: 'Time schedule comprehension.',
              mistakeCategory: 'Distractor confusion',
            },
          },
        ],
      },
      {
        id: 'list-03-p2',
        partNumber: 2,
        audioUrl: '/audio/test-03-p2.mp3',
        title: 'Part 2: Gym Equipment Safety & Etiquette',
        situation: 'Facility manager providing a safety induction tour to new gym members.',
        durationMinutes: 2.3,
        durationSeconds: 145,
        audioScript: `Welcome everyone to your facility induction. Before you start lifting and training, safety is paramount.
First, all members must carry a sweat towel and wipe down benches, dumbbells, and cardio consoles after each use using the disinfectant dispensers located on every support pillar.
Second, when using barbell squat racks and bench presses, always engage safety spotter arms and ask our floor staff for assistance if lifting heavy weights. Closed-toe athletic footwear is mandatory; sandals or open slippers are strictly prohibited on the workout floor.
Finally, lockers operate using personal padlocks. You may bring your own padlock or purchase one at the reception desk for £4. Please ensure you empty your locker overnight, as locks left on doors after midnight will be removed by security.`,
        questions: [
          {
            id: 'lq-03-3',
            number: 3,
            type: 'short_answer',
            prompt: 'How much does a padlock cost at the reception desk in pounds?',
            instructions: 'Write ONE NUMBER ONLY.',
            correctAnswers: ['4', '£4', '4 pounds'],
            explanation: {
              whyCorrect: 'Speaker states: "...purchase one at the reception desk for £4."',
              timestamp: '1:18',
              importantClue: 'for £4',
              vocabularyNote: 'Small transaction price.',
              mistakeCategory: 'Number confusion',
            },
          },
        ],
      },
      {
        id: 'list-03-p3',
        partNumber: 3,
        audioUrl: '/audio/test-03-p3.mp3',
        title: 'Part 3: Sports Nutrition and Hydration Protocol',
        situation: 'Sports nutritionist answering questions from two student marathon runners.',
        durationMinutes: 2.6,
        durationSeconds: 155,
        audioScript: `Nutritionist: Hello Sophie, hello Kevin. Let's discuss your marathon fueling plan.
Sophie: We've been experiencing energy crashes during our twenty-kilometer weekend training runs.
Nutritionist: That usually stems from depleted glycogen stores. During prolonged aerobic exertion exceeding ninety minutes, your body requires thirty to sixty grams of easily digestible carbohydrates per hour, along with electrolyte replenishment.
Kevin: Should we rely on commercial energy gels or whole foods like bananas?
Nutritionist: Both are effective. However, consume them with at least two hundred milliliters of water to prevent gastrointestinal cramping. Hydration should be calibrated by monitoring sweat rate: aim to drink four hundred to eight hundred milliliters of fluid per hour depending on ambient temperature.`,
        questions: [
          {
            id: 'lq-03-4',
            number: 4,
            type: 'multiple_choice',
            prompt: 'How many grams of carbohydrates per hour are recommended during runs exceeding ninety minutes?',
            options: ['10 to 20 grams', '30 to 60 grams', '70 to 90 grams', '100 grams'],
            correctAnswers: ['30 to 60 grams'],
            explanation: {
              whyCorrect: 'Nutritionist advises: "...your body requires thirty to sixty grams of easily digestible carbohydrates per hour..."',
              timestamp: '0:42',
              importantClue: 'thirty to sixty grams',
              vocabularyNote: 'Quantity range listening.',
              mistakeCategory: 'Number confusion',
            },
          },
        ],
      },
      {
        id: 'list-03-p4',
        partNumber: 4,
        audioUrl: '/audio/test-03-p4.mp3',
        title: 'Part 4: Exercise Physiology and Muscle Hypertrophy',
        situation: 'Kinesiology university lecture on mechanical tension and muscle fiber recruitment.',
        durationMinutes: 2.6,
        durationSeconds: 155,
        audioScript: `Lecturer: Today we investigate the biomechanical stimuli governing skeletal muscle adaptation.
For decades, athletes believed that metabolic fatigue—the burning sensation induced by hydrogen ion accumulation—was the sole prerequisite for muscle growth. Contemporary exercise physiology proves that mechanical tension is the primary driver of myofibrillar protein synthesis.
When muscle fibers are subjected to high mechanical loads near muscular failure, mechanosensors inside the sarcolemma trigger intracellular signaling cascades mediated by the mTOR pathway. This stimulates satellite cells to donate nuclei to damaged muscle fibers, resulting in cross-sectional hypertrophy and increased contractile force.`,
        questions: [
          {
            id: 'lq-03-5',
            number: 5,
            type: 'sentence_completion',
            prompt: 'Contemporary exercise physiology proves that mechanical __________ is the primary driver of protein synthesis.',
            instructions: 'Write ONE WORD ONLY.',
            correctAnswers: ['tension'],
            explanation: {
              whyCorrect: 'Lecturer explains: "...proves that mechanical tension is the primary driver of myofibrillar protein synthesis."',
              timestamp: '0:44',
              importantClue: 'mechanical tension is the primary driver',
              vocabularyNote: 'Biomechanics terminology.',
              mistakeCategory: 'Vocabulary problem',
            },
          },
        ],
      },
    ],
  },

  // Test 04: Library Membership
  {
    id: 'list-04',
    slug: 'test-04',
    audioUrl: '/audio/test-04.mp3',
    title: 'Listening Test 04: Library Membership & Academic Archives',
    topic: 'Library Membership',
    description: '10-minute 4-part IELTS listening test covering municipal library membership, digital archives tour, research database consultation, and history of papermaking technology.',
    difficulty: 'Intermediate',
    durationMinutes: 10,
    totalDurationSeconds: 610,
    section: 1,
    parts: [
      {
        id: 'list-04-p1',
        partNumber: 1,
        audioUrl: '/audio/test-04-p1.mp3',
        title: 'Part 1: Library Card Registration',
        situation: 'New resident registering for a borrowing card at the City Central Library.',
        durationMinutes: 2.5,
        durationSeconds: 150,
        audioScript: `Librarian: Good afternoon. Welcome to the Central Metropolitan Library. Can I help you register for a membership card?
Resident: Yes please. I just moved into town. What documents do I need to present?
Librarian: You only need two documents: one photographic ID, such as a passport or driver's license, and one proof of address, such as a utility bill or bank statement issued within the last three months.
Resident: I have my driver's license and my electricity bill right here.
Librarian: Perfect. Let me record your details. What is your full legal name?
Resident: Catherine Vance. That is V-A-N-C-E.
Librarian: And your residential address?
Resident: Flat 3B, 84 Meadowbrook Avenue.
Librarian: Thank you, Catherine. With this card, you can borrow up to twelve physical books and five audiobooks for a loan period of three weeks. Renewals can be completed online via our mobile application.`,
        questions: [
          {
            id: 'lq-04-1',
            number: 1,
            type: 'form_completion',
            prompt: 'Member Surname: __________',
            instructions: 'Write ONE WORD ONLY.',
            correctAnswers: ['vance'],
            explanation: {
              whyCorrect: 'Catherine clarifies: "Catherine Vance. That is V-A-N-C-E."',
              timestamp: '0:42',
              importantClue: 'V-A-N-C-E',
              vocabularyNote: 'Name spelling dictation.',
              mistakeCategory: 'Spelling mistake',
            },
          },
          {
            id: 'lq-04-2',
            number: 2,
            type: 'short_answer',
            prompt: 'How many physical books can members borrow simultaneously?',
            instructions: 'Write ONE NUMBER ONLY.',
            correctAnswers: ['12', 'twelve'],
            explanation: {
              whyCorrect: 'Librarian states: "...borrow up to twelve physical books..."',
              timestamp: '1:15',
              importantClue: 'twelve physical books',
              vocabularyNote: 'Quantity extraction.',
              mistakeCategory: 'Number confusion',
            },
          },
        ],
      },
      {
        id: 'list-04-p2',
        partNumber: 2,
        audioUrl: '/audio/test-04-p2.mp3',
        title: 'Part 2: Special Collections & Microfilm Room Tour',
        situation: 'Head archivist describing local history records and rare manuscripts.',
        durationMinutes: 2.3,
        durationSeconds: 145,
        audioScript: `Welcome to the third-floor Heritage and Rare Archives wing. Unlike our general lending sections, items stored here are reference-only and cannot be taken outside the facility.
On the north wall, we hold bound regional newspapers dating back to 1832. For fragile newsprint printed before 1900, please use our high-resolution digital microfilm readers in alcove C.
Gloves must be worn when examining pre-Victorian town registers. If you require photoduplication or archival scans, please submit a request slip to the preservation desk. Scans cost 50 pence per page and are delivered electronically within 24 hours.`,
        questions: [
          {
            id: 'lq-04-3',
            number: 3,
            type: 'short_answer',
            prompt: 'In which alcove are the digital microfilm readers located?',
            instructions: 'Write the letter only.',
            correctAnswers: ['c', 'alcove c'],
            explanation: {
              whyCorrect: 'Archivist states: "...digital microfilm readers in alcove C."',
              timestamp: '0:48',
              importantClue: 'alcove C',
              vocabularyNote: 'Alphabetical alcove identification.',
              mistakeCategory: 'Missed keyword',
            },
          },
        ],
      },
      {
        id: 'list-04-p3',
        partNumber: 3,
        audioUrl: '/audio/test-04-p3.mp3',
        title: 'Part 3: Academic Database Research Consultation',
        situation: 'University librarian guiding a graduate student through Boolean search operators.',
        durationMinutes: 2.6,
        durationSeconds: 155,
        audioScript: `Librarian: Good afternoon, Jordan. How is your dissertation research progressing?
Student: I am finding thousands of results on JSTOR and Scopus, but most of them are irrelevant to my specific research question on coastal erosion.
Librarian: That is a classic query syntax challenge. To narrow your results, apply Boolean operators like AND, OR, and NOT. You should also enclose specific keyword phrases in quotation marks, such as "mangrove restoration" AND "sediment accretion".
Student: Does the library provide access to interlibrary loan services if a monograph is not in our catalog?
Librarian: Yes, we collaborate with sixty academic libraries nationwide. Interlibrary digital chapters are typically fulfilled within forty-eight hours free of charge.`,
        questions: [
          {
            id: 'lq-04-4',
            number: 4,
            type: 'short_answer',
            prompt: 'Within how many hours are interlibrary digital loan chapters typically fulfilled?',
            instructions: 'Write the number of hours.',
            correctAnswers: ['48 hours', '48', 'forty-eight hours'],
            explanation: {
              whyCorrect: 'Librarian explains: "...typically fulfilled within forty-eight hours free of charge."',
              timestamp: '1:20',
              importantClue: 'forty-eight hours',
              vocabularyNote: 'Turnaround timeframe listening.',
              mistakeCategory: 'Number confusion',
            },
          },
        ],
      },
      {
        id: 'list-04-p4',
        partNumber: 4,
        audioUrl: '/audio/test-04-p4.mp3',
        title: 'Part 4: The Invention and Dissemination of Rag Paper',
        situation: 'History of technology lecture on medieval papermaking mills in Europe.',
        durationMinutes: 2.6,
        durationSeconds: 160,
        audioScript: `Lecturer: Today we turn our attention to one of the most consequential technological transfers in human intellectual history: the transition from vellum parchment to rag paper.
Prior to the fourteenth century, European book production depended almost exclusively on animal skins—parchment and vellum—which were prohibitively expensive. A single comprehensive Bible required the hides of several hundred sheep or calves.
Papermaking originated in China during the Han dynasty, reaching Samarkand in the eighth century, before spreading into Moorish Spain and Italy. European craftsmen mechanized the maceration process by employing watermills to drive heavy wooden stamping hammers, transforming discarded linen rags and old fishing nets into uniform cellulose pulp. This dramatic reduction in production cost catalyzed the rapid spread of movable type printing a century later.`,
        questions: [
          {
            id: 'lq-04-5',
            number: 5,
            type: 'sentence_completion',
            prompt: 'European artisans used watermills to drive heavy wooden __________ hammers to pulp linen rags.',
            instructions: 'Write ONE WORD ONLY.',
            correctAnswers: ['stamping'],
            explanation: {
              whyCorrect: 'Lecturer explains: "...watermills to drive heavy wooden stamping hammers..."',
              timestamp: '1:18',
              importantClue: 'wooden stamping hammers',
              vocabularyNote: 'Historical mechanical terminology.',
              mistakeCategory: 'Vocabulary problem',
            },
          },
        ],
      },
    ],
  },

  // Test 05: Environmental Research Project
  {
    id: 'list-05',
    slug: 'test-05',
    audioUrl: '/audio/test-05.mp3',
    title: 'Listening Test 05: Environmental Research Project',
    topic: 'Environmental Research Project',
    description: '10-minute 4-part IELTS listening exam covering field trip logistics, wildlife volunteer survey, thesis methodology discussion, and wetland ecosystem lecture.',
    difficulty: 'Advanced',
    durationMinutes: 10,
    totalDurationSeconds: 615,
    section: 3,
    parts: [
      {
        id: 'list-05-p1',
        partNumber: 1,
        audioUrl: '/audio/test-05-p1.mp3',
        title: 'Part 1: Field Trip Gear & Logistics',
        situation: 'Biology student checking in equipment with the departmental lab technician.',
        durationMinutes: 2.5,
        durationSeconds: 150,
        audioScript: `Technician: Good morning, Greg. Ready for the coastal biodiversity field trip to the estuary?
Student: Yes, Maria. I need to collect water sampling kits, waterproof data loggers, and pH meters for our team of four.
Technician: All items are prepared in equipment box number 7. Remember to calibrate the optical dissolved oxygen sensor before every dive. The battery life is approximately six hours, so recharge them at the base station each evening.
Student: What time is the departure bus leaving tomorrow morning?
Technician: The bus departs promptly at 6:45 AM from behind the science building. If you arrive late, you will miss the morning low-tide window.`,
        questions: [
          {
            id: 'lq-05-1',
            number: 1,
            type: 'short_answer',
            prompt: 'What equipment box number is assigned to Greg\'s team?',
            instructions: 'Write ONE NUMBER ONLY.',
            correctAnswers: ['7', 'number 7'],
            explanation: {
              whyCorrect: 'Technician specifies: "...prepared in equipment box number 7."',
              timestamp: '0:35',
              importantClue: 'box number 7',
              vocabularyNote: 'Equipment box identifier.',
              mistakeCategory: 'Number confusion',
            },
          },
          {
            id: 'lq-05-2',
            number: 2,
            type: 'short_answer',
            prompt: 'At what time does the field trip bus depart tomorrow morning?',
            instructions: 'Write the departure time.',
            correctAnswers: ['6:45 am', '6:45', '6.45 am'],
            explanation: {
              whyCorrect: 'Technician clarifies: "The bus departs promptly at 6:45 AM..."',
              timestamp: '1:10',
              importantClue: '6:45 AM',
              vocabularyNote: 'Departure schedule listening.',
              mistakeCategory: 'Number confusion',
            },
          },
        ],
      },
      {
        id: 'list-05-p2',
        partNumber: 2,
        audioUrl: '/audio/test-05-p2.mp3',
        title: 'Part 2: Estuary Habitat Conservation Volunteers',
        situation: 'Conservation officer briefing local volunteers on salt marsh bird censuses.',
        durationMinutes: 2.3,
        durationSeconds: 145,
        audioScript: `Good morning everyone. Thank you for volunteering for the annual Blackwater Estuary avian survey.
Today we will cover three distinct habitat zones: the mudflats, the spartina grass marshes, and the shingle beach.
Volunteers in Zone 1 will focus on recording migrant wader populations, particularly redshanks and curlews. We ask you to record your tallies using the mobile survey application every 30 minutes. Binoculars can be borrowed from the visitor center with a refundable £10 deposit. Remember to stay clear of the high-water line as the tide moves rapidly across these flat sands.`,
        questions: [
          {
            id: 'lq-05-3',
            number: 3,
            type: 'short_answer',
            prompt: 'How much is the refundable deposit for borrowing binoculars in pounds?',
            instructions: 'Write ONE NUMBER ONLY.',
            correctAnswers: ['10', '£10', '10 pounds'],
            explanation: {
              whyCorrect: 'Officer states: "...refundable £10 deposit."',
              timestamp: '1:02',
              importantClue: 'refundable £10 deposit',
              vocabularyNote: 'Deposit cost listening.',
              mistakeCategory: 'Number confusion',
            },
          },
        ],
      },
      {
        id: 'list-05-p3',
        partNumber: 3,
        audioUrl: '/audio/test-05-p3.mp3',
        title: 'Part 3: Thesis Methodology Review: Microplastics in Benthic Sediments',
        situation: 'Two postgraduate researchers discussing sediment core extraction with their supervisor.',
        durationMinutes: 2.6,
        durationSeconds: 160,
        audioScript: `Supervisor: Good afternoon, Clara and Ethan. How did your core sampling proceed at the intertidal mudflats?
Clara: We extracted twenty core samples at depths of up to thirty centimeters using stainless steel sediment augers.
Ethan: To prevent synthetic polymer contamination, we avoided all plastic containers and stored samples strictly in pre-rinsed glass jars sealed with aluminum foil.
Supervisor: Excellent procedural control. And what density separation liquid will you employ to float the microplastic fibers?
Clara: We chose concentrated zinc chloride solution with a density of 1.6 grams per milliliter, which reliably separates high-density polymers like PVC and PET that standard sodium chloride solutions fail to float.`,
        questions: [
          {
            id: 'lq-05-4',
            number: 4,
            type: 'multiple_choice',
            prompt: 'What density separation solution was selected to isolate high-density microplastics?',
            options: ['Sodium chloride', 'Zinc chloride', 'Calcium carbonate', 'Magnesium sulfate'],
            correctAnswers: ['Zinc chloride'],
            explanation: {
              whyCorrect: 'Clara confirms: "We chose concentrated zinc chloride solution..."',
              timestamp: '1:12',
              importantClue: 'zinc chloride solution',
              vocabularyNote: 'Chemical reagent identification.',
              mistakeCategory: 'Vocabulary problem',
            },
          },
        ],
      },
      {
        id: 'list-05-p4',
        partNumber: 4,
        audioUrl: '/audio/test-05-p4.mp3',
        title: 'Part 4: Blue Carbon Sequestration in Tidal Wetlands',
        situation: 'Ecology lecture discussing carbon storage capacity of mangrove forests and salt marshes.',
        durationMinutes: 2.6,
        durationSeconds: 160,
        audioScript: `Lecturer: Today we evaluate the carbon sequestration dynamics of coastal vegetated ecosystems, broadly termed 'blue carbon'.
While terrestrial rainforests have long dominated popular conservation narratives, tidal salt marshes and mangrove forests sequester carbon at rates up to ten times higher per hectare than mature tropical rainforests.
The underlying mechanism resides in the anoxic, waterlogged nature of tidal soils. Because oxygen diffusion in saline mud is negligible, microbial decomposition of organic matter is severely inhibited. Consequently, organic carbon remains locked in subterranean sediment strata for millennia rather than returning to the atmosphere as carbon dioxide.`,
        questions: [
          {
            id: 'lq-05-5',
            number: 5,
            type: 'short_answer',
            prompt: 'Tidal salt marshes sequester carbon at rates up to how many times higher per hectare than mature rainforests?',
            instructions: 'Write the number or text.',
            correctAnswers: ['10 times', '10', 'ten times'],
            explanation: {
              whyCorrect: 'Lecturer confirms: "...at rates up to ten times higher per hectare than mature tropical rainforests."',
              timestamp: '0:48',
              importantClue: 'up to ten times higher',
              vocabularyNote: 'Comparative rate listening.',
              mistakeCategory: 'Number confusion',
            },
          },
        ],
      },
    ],
  },

  // Test 06: Travel and Transportation
  {
    id: 'list-06',
    slug: 'test-06',
    audioUrl: '/audio/test-06.mp3',
    title: 'Listening Test 06: Travel and Transportation Networks',
    topic: 'Travel and Transportation',
    description: '10-minute 4-part IELTS listening test covering intercity train booking, airport transit guidance, urban congestion pricing analysis, and maglev rail technology.',
    difficulty: 'Intermediate',
    durationMinutes: 10,
    totalDurationSeconds: 610,
    section: 2,
    parts: [
      {
        id: 'list-06-p1',
        partNumber: 1,
        audioUrl: '/audio/test-06-p1.mp3',
        title: 'Part 1: Intercity High-Speed Train Ticketing',
        situation: 'Passenger purchasing long-distance rail tickets at a railway station booking office.',
        durationMinutes: 2.5,
        durationSeconds: 150,
        audioScript: `Clerk: Good morning, National Rail reservations. Where are you heading today?
Passenger: Good morning. I need a return ticket from London King's Cross to Edinburgh Waverley.
Clerk: Certainly. What travel dates are you planning?
Passenger: Traveling up on Wednesday the 12th of October on the 8:30 AM express, and returning on Sunday the 16th of October on the late afternoon service.
Clerk: We have two seating classes available. Standard Class return is £88, and First Class return with complimentary hot meals and lounge access is £140.
Passenger: I will take the Standard Class return, please. Do I need to reserve a quiet carriage seat?
Clerk: Yes, coach D is designated as the Quiet Coach, meaning phone calls are prohibited. I can assign you seat 24 in Coach D at no extra cost.`,
        questions: [
          {
            id: 'lq-06-1',
            number: 1,
            type: 'short_answer',
            prompt: 'What is the price of the Standard Class return ticket in pounds?',
            instructions: 'Write ONE NUMBER ONLY.',
            correctAnswers: ['88', '£88', '88 pounds'],
            explanation: {
              whyCorrect: 'Clerk states: "Standard Class return is £88..."',
              timestamp: '0:45',
              importantClue: 'Standard Class return is £88',
              vocabularyNote: 'Ticket pricing listening.',
              mistakeCategory: 'Number confusion',
            },
          },
          {
            id: 'lq-06-2',
            number: 2,
            type: 'short_answer',
            prompt: 'Which railway coach letter is designated as the Quiet Coach?',
            instructions: 'Write ONE LETTER ONLY.',
            correctAnswers: ['d', 'coach d'],
            explanation: {
              whyCorrect: 'Clerk clarifies: "...coach D is designated as the Quiet Coach..."',
              timestamp: '1:12',
              importantClue: 'Coach D',
              vocabularyNote: 'Single letter identification.',
              mistakeCategory: 'Missed keyword',
            },
          },
        ],
      },
      {
        id: 'list-06-p2',
        partNumber: 2,
        audioUrl: '/audio/test-06-p2.mp3',
        title: 'Part 2: Airport Terminal Navigation and Transfer',
        situation: 'Airport customer service representative briefing international transit passengers.',
        durationMinutes: 2.3,
        durationSeconds: 145,
        audioScript: `Attention all passengers transiting through Heathrow Terminal 5. If your connecting flight departs from satellite terminals 5B or 5C, please proceed to the automated transit train on level -2.
The automated train operates every 3 minutes and journey time to terminal 5C is just under 4 minutes.
If you have a layover exceeding 3 hours and wish to visit the shower lounges, complimentary amenities are located opposite Gate B34. Free high-speed Wi-Fi is available across all gates under the network name 'AirportFreeGuest'. For lost baggage inquiries, visit desk 8 near the baggage reclaim hall.`,
        questions: [
          {
            id: 'lq-06-3',
            number: 3,
            type: 'short_answer',
            prompt: 'How frequently does the automated transit train operate between terminals in minutes?',
            instructions: 'Write ONE NUMBER ONLY.',
            correctAnswers: ['3', '3 minutes'],
            explanation: {
              whyCorrect: 'Speaker states: "The automated train operates every 3 minutes..."',
              timestamp: '0:35',
              importantClue: 'every 3 minutes',
              vocabularyNote: 'Frequency schedule listening.',
              mistakeCategory: 'Number confusion',
            },
          },
        ],
      },
      {
        id: 'list-06-p3',
        partNumber: 3,
        audioUrl: '/audio/test-06-p3.mp3',
        title: 'Part 3: Urban Congestion Pricing and Commuter Mode Shift',
        situation: 'Urban planning seminar evaluating economic impacts of electronic congestion charges.',
        durationMinutes: 2.6,
        durationSeconds: 155,
        audioScript: `Tutor: Welcome back, everyone. Let's analyze the post-implementation dataset from Stockholm's congestion pricing scheme.
Student: Looking at the traffic flow data, inner-city traffic volumes fell by twenty-two percent within the first month.
Tutor: And what happened to public transit patronage?
Student: Bus ridership increased by nine percent, while underground metro ridership expanded by six percent. More importantly, carbon monoxide emissions in the central zone dropped by fourteen percent.`,
        questions: [
          {
            id: 'lq-06-4',
            number: 4,
            type: 'multiple_choice',
            prompt: 'By what percentage did inner-city traffic volumes fall within the first month in Stockholm?',
            options: ['6 percent', '9 percent', '14 percent', '22 percent'],
            correctAnswers: ['22 percent', '22%'],
            explanation: {
              whyCorrect: 'Student explains: "...inner-city traffic volumes fell by twenty-two percent..."',
              timestamp: '0:35',
              importantClue: 'twenty-two percent',
              vocabularyNote: 'Percentage decrease data extraction.',
              mistakeCategory: 'Number confusion',
            },
          },
        ],
      },
      {
        id: 'list-06-p4',
        partNumber: 4,
        audioUrl: '/audio/test-06-p4.mp3',
        title: 'Part 4: Linear Motor Propulsion and Aerodynamic Drag in Maglev Trains',
        situation: 'Engineering lecture on magnetic levitation dynamics and vacuum tube transport.',
        durationMinutes: 2.6,
        durationSeconds: 160,
        audioScript: `Lecturer: In our previous session on high-speed rail, we examined steel-wheel adhesion limits at velocities exceeding 350 kilometers per hour.
Magnetic levitation overcomes wheel friction by deploying superconducting electromagnets to lift the train carriage approximately fifteen millimeters above a concrete guideway.
Without wheel friction, aerodynamic drag becomes the sole limiting resistive force. Because aerodynamic drag increases with the square of velocity, operating at 600 kilometers per hour consumes exponentially more energy unless trains operate within partial-vacuum tube tunnels, a design principle known as evacuated tube transport.`,
        questions: [
          {
            id: 'lq-06-5',
            number: 5,
            type: 'short_answer',
            prompt: 'Approximately how many millimeters above the guideway does the maglev train float?',
            instructions: 'Write the number only.',
            correctAnswers: ['15', '15 millimeters', '15mm'],
            explanation: {
              whyCorrect: 'Lecturer states: "...lift the train carriage approximately fifteen millimeters above a concrete guideway."',
              timestamp: '0:48',
              importantClue: 'fifteen millimeters',
              vocabularyNote: 'Distance measurement extraction.',
              mistakeCategory: 'Number confusion',
            },
          },
        ],
      },
    ],
  },

  // Test 07: Museum Tour
  {
    id: 'list-07',
    slug: 'test-07',
    audioUrl: '/audio/test-07.mp3',
    title: 'Listening Test 07: Museum Tour & Ancient Artifacts',
    topic: 'Museum Tour',
    description: '10-minute 4-part IELTS listening test covering guided tour booking, gallery orientation, curation seminar on bronze casting, and lecture on maritime archaeology.',
    difficulty: 'Intermediate',
    durationMinutes: 10,
    totalDurationSeconds: 610,
    section: 2,
    parts: [
      {
        id: 'list-07-p1',
        partNumber: 1,
        audioUrl: '/audio/test-07-p1.mp3',
        title: 'Part 1: Museum Guided Tour Booking',
        situation: 'School teacher arranging an exhibition visit for thirty pupils.',
        durationMinutes: 2.5,
        durationSeconds: 150,
        audioScript: `Officer: Good morning, National Antiquities Museum education office. My name is Arthur.
Teacher: Hello Arthur. I am calling from Oakridge Secondary School. We would like to book a guided educational tour for 30 students next Thursday.
Officer: Certainly. For school groups, admission is free of charge, but our guided docent tour costs £3 per pupil.
Teacher: That is very affordable. What is the maximum group size per tour guide?
Officer: We assign one guide for every 15 students to ensure interactive engagement. So your class will be divided into two cohorts of 15.
Teacher: Perfect. And is there a dedicated lunchroom for packed lunches?
Officer: Yes, the Clore Education Suite on the ground floor is reserved for school groups between 12:00 PM and 1:00 PM.`,
        questions: [
          {
            id: 'lq-07-1',
            number: 1,
            type: 'short_answer',
            prompt: 'How much is the guided tour fee per pupil in pounds?',
            instructions: 'Write ONE NUMBER ONLY.',
            correctAnswers: ['3', '£3', '3 pounds'],
            explanation: {
              whyCorrect: 'Arthur states: "...docent tour costs £3 per pupil."',
              timestamp: '0:42',
              importantClue: '£3 per pupil',
              vocabularyNote: 'Per-student fee listening.',
              mistakeCategory: 'Number confusion',
            },
          },
        ],
      },
      {
        id: 'list-07-p2',
        partNumber: 2,
        audioUrl: '/audio/test-07-p2.mp3',
        title: 'Part 2: Museum Gallery Layout and Facilities',
        situation: 'Docent welcoming visitors in the museum central rotunda.',
        durationMinutes: 2.3,
        durationSeconds: 145,
        audioScript: `Welcome to the Central Rotunda of the National Antiquities Museum.
Directly ahead through the marble arches lies Gallery 1, featuring ancient Mesopotamian cuneiform tablets.
To your right is Gallery 2, housing our Greek and Roman sculpture collection. If you are interested in Egyptian funerary art, head upstairs to Gallery 4 on the first floor.
Flash photography is strictly prohibited in all galleries to prevent pigment degradation. Audio guide handsets are available at desk B in seven languages.`,
        questions: [
          {
            id: 'lq-07-2',
            number: 2,
            type: 'multiple_choice',
            prompt: 'On which floor is the Egyptian funerary art collection situated?',
            options: ['Basement level', 'Ground floor', 'First floor', 'Second floor'],
            correctAnswers: ['First floor'],
            explanation: {
              whyCorrect: 'Docent announces: "...head upstairs to Gallery 4 on the first floor."',
              timestamp: '0:45',
              importantClue: 'first floor',
              vocabularyNote: 'Floor location identification.',
              mistakeCategory: 'Missed keyword',
            },
          },
        ],
      },
      {
        id: 'list-07-p3',
        partNumber: 3,
        audioUrl: '/audio/test-07-p3.mp3',
        title: 'Part 3: Conservation Seminar on Bronze Age Metallurgy',
        situation: 'Archaeology students discussing lost-wax casting methods with a museum conservator.',
        durationMinutes: 2.6,
        durationSeconds: 155,
        audioScript: `Conservator: Look closely at this Bronze Age ceremonial dagger, dated to 1200 BCE.
Student: The intricate handle detailing suggests lost-wax casting rather than a two-piece stone mold.
Conservator: Exactly. Artisans sculpted a beeswax model around a clay core, coated it in refractory plaster, and baked it in a kiln so the melted wax drained away. Molten bronze was then poured into the hollow cavity.
Student: And how do you stabilize bronze disease caused by chloride salts?
Conservator: We treat corroded artifacts with benzotriazole inhibitors in vacuum chambers to halt chemical breakdown.`,
        questions: [
          {
            id: 'lq-07-3',
            number: 3,
            type: 'sentence_completion',
            prompt: 'Bronze Age artisans sculpted a model made of __________ around a clay core for casting.',
            instructions: 'Write ONE WORD ONLY.',
            correctAnswers: ['beeswax', 'wax'],
            explanation: {
              whyCorrect: 'Conservator specifies: "Artisans sculpted a beeswax model..."',
              timestamp: '0:42',
              importantClue: 'beeswax model',
              vocabularyNote: 'Artisan materials vocabulary.',
              mistakeCategory: 'Spelling mistake',
            },
          },
        ],
      },
      {
        id: 'list-07-p4',
        partNumber: 4,
        audioUrl: '/audio/test-07-p4.mp3',
        title: 'Part 4: Maritime Archaeology and Underwater Shipwreck Preservation',
        situation: 'Academic lecture on the recovery and conservation of the Mary Rose warship.',
        durationMinutes: 2.6,
        durationSeconds: 160,
        audioScript: `Lecturer: Today we evaluate marine artifact conservation, focusing on the recovery of the Tudor flagship, the Mary Rose, which sank in the Solent in 1545.
When waterlogged oak timber is submerged in anaerobic seabed silt for centuries, bacteria degrade cellulose fibers while water fills the porous cell cavities. If allowed to dry naturally in air, surface tension forces cause the cells to collapse, shattering the timber into unrecognisable fragments.
To prevent this catastrophic shrinkage, conservators sprayed the hull continuously with polyethylene glycol—a water-soluble synthetic wax—for over seventeen years, gradually replacing cellular moisture before commencing controlled freeze-drying.`,
        questions: [
          {
            id: 'lq-07-4',
            number: 4,
            type: 'short_answer',
            prompt: 'In which year did the Tudor flagship Mary Rose sink?',
            instructions: 'Write the year.',
            correctAnswers: ['1545'],
            explanation: {
              whyCorrect: 'Lecturer states: "...which sank in the Solent in 1545."',
              timestamp: '0:35',
              importantClue: '1545',
              vocabularyNote: 'Historical date extraction.',
              mistakeCategory: 'Number confusion',
            },
          },
        ],
      },
    ],
  },

  // Test 08: Job Interview and Workplace
  {
    id: 'list-08',
    slug: 'test-08',
    audioUrl: '/audio/test-08.mp3',
    title: 'Listening Test 08: Job Interview and Workplace Dynamics',
    topic: 'Job Interview and Workplace',
    description: '10-minute 4-part IELTS listening test covering recruitment registration, employee benefits induction, performance review meeting, and organizational psychology lecture.',
    difficulty: 'Advanced',
    durationMinutes: 10,
    totalDurationSeconds: 615,
    section: 3,
    parts: [
      {
        id: 'list-08-p1',
        partNumber: 1,
        audioUrl: '/audio/test-08-p1.mp3',
        title: 'Part 1: Recruitment Agency Candidate Intake',
        situation: 'Job candidate registering with an employment agency consultant.',
        durationMinutes: 2.5,
        durationSeconds: 150,
        audioScript: `Consultant: Good morning, welcome to Apex Executive Recruitment. Let us register your professional profile. What is your full name?
Candidate: Good morning. My name is Simon Gallagher. That is G-A-L-L-A-G-H-E-R.
Consultant: Thank you, Simon. What industry sector and target salary are you seeking?
Candidate: I have six years of experience as a Senior Supply Chain Analyst. I am targeting roles with a base salary between £52,000 and £58,000 per annum.
Consultant: Excellent. Are you available for hybrid telecommuting, or strictly in-office roles?
Candidate: I prefer a hybrid arrangement with two days working remotely and three days in the office.
Consultant: What is your current notice period with your employer?
Candidate: I have a one-month notice period.`,
        questions: [
          {
            id: 'lq-08-1',
            number: 1,
            type: 'form_completion',
            prompt: 'Candidate Surname: __________',
            instructions: 'Write ONE WORD ONLY.',
            correctAnswers: ['gallagher'],
            explanation: {
              whyCorrect: 'Simon spells: "Simon Gallagher. That is G-A-L-L-A-G-H-E-R."',
              timestamp: '0:25',
              importantClue: 'G-A-L-L-A-G-H-E-R',
              vocabularyNote: 'Surname spelling listening.',
              mistakeCategory: 'Spelling mistake',
            },
          },
          {
            id: 'lq-08-2',
            number: 2,
            type: 'short_answer',
            prompt: 'What is Simon\'s notice period with his current employer?',
            instructions: 'Write NO MORE THAN TWO WORDS.',
            correctAnswers: ['one month', '1 month'],
            explanation: {
              whyCorrect: 'Simon confirms: "I have a one-month notice period."',
              timestamp: '1:15',
              importantClue: 'one-month notice period',
              vocabularyNote: 'Employment terms listening.',
              mistakeCategory: 'Missed keyword',
            },
          },
        ],
      },
      {
        id: 'list-08-p2',
        partNumber: 2,
        audioUrl: '/audio/test-08-p2.mp3',
        title: 'Part 2: Corporate Employee Benefits Induction',
        situation: 'HR Director explaining annual leave, pension matching, and health insurance.',
        durationMinutes: 2.3,
        durationSeconds: 145,
        audioScript: `Welcome to our onboarding seminar for all newly appointed team members.
Our company offers twenty-five days of paid annual leave in addition to official statutory bank holidays. For every full year of tenure, you receive one additional leave day up to a maximum of thirty days.
Our defined contribution pension scheme provides a 200 percent company match: if you contribute 4 percent of your salary, the company contributes 8 percent. Health insurance coverage begins on the first day of your third month following probationary review.`,
        questions: [
          {
            id: 'lq-08-3',
            number: 3,
            type: 'short_answer',
            prompt: 'What is the base number of paid annual leave days for new staff?',
            instructions: 'Write ONE NUMBER ONLY.',
            correctAnswers: ['25', 'twenty-five'],
            explanation: {
              whyCorrect: 'HR Director announces: "...twenty-five days of paid annual leave..."',
              timestamp: '0:32',
              importantClue: 'twenty-five days',
              vocabularyNote: 'Annual leave entitlement.',
              mistakeCategory: 'Number confusion',
            },
          },
        ],
      },
      {
        id: 'list-08-p3',
        partNumber: 3,
        audioUrl: '/audio/test-08-p3.mp3',
        title: 'Part 3: Quarterly Performance Appraisal Review',
        situation: 'Manager discussing project milestones and professional development targets with a team lead.',
        durationMinutes: 2.6,
        durationSeconds: 160,
        audioScript: `Manager: Good afternoon, Brenda. Let us review the key performance indicators from Quarter 3.
Brenda: Our software engineering squad delivered the client portal update two weeks ahead of schedule and six percent under budget.
Manager: That was exemplary. However, client satisfaction survey scores for our technical documentation hovered at seventy-two percent, below our target threshold of eighty percent.
Brenda: We recognize that documentation was rushed. We are enrolling our junior engineers in a technical writing certification course next month to address this gap.`,
        questions: [
          {
            id: 'lq-08-4',
            number: 4,
            type: 'multiple_choice',
            prompt: 'What was the target satisfaction threshold for technical documentation?',
            options: ['70 percent', '72 percent', '80 percent', '85 percent'],
            correctAnswers: ['80 percent', '80%'],
            explanation: {
              whyCorrect: 'Manager notes: "...below our target threshold of eighty percent." (72% was achieved score).',
              timestamp: '0:48',
              importantClue: 'target threshold of eighty percent',
              vocabularyNote: 'Target metric vs actual metric distractor.',
              mistakeCategory: 'Distractor confusion',
            },
          },
        ],
      },
      {
        id: 'list-08-p4',
        partNumber: 4,
        audioUrl: '/audio/test-08-p4.mp3',
        title: 'Part 4: Psychological Safety and Agile Innovation in Enterprise Teams',
        situation: 'Business psychology lecture on Amy Edmondson’s psychological safety research.',
        durationMinutes: 2.6,
        durationSeconds: 160,
        audioScript: `Lecturer: In today's organizational behavior seminar, we analyze team dynamics that cultivate breakthrough innovation.
In 1999, Harvard professor Amy Edmondson published groundbreaking findings establishing the construct of 'psychological safety'—the shared belief among teammates that the team is safe for interpersonal risk-taking.
Contrary to conventional managerial wisdom, high-performing teams do not make fewer mistakes; rather, they report substantially more errors because members do not fear humiliation, retribution, or marginalization when admitting uncertainties. In cultures characterized by high psychological safety, error disclosure accelerates feedback loops and prevents systemic corporate failures.`,
        questions: [
          {
            id: 'lq-08-5',
            number: 5,
            type: 'sentence_completion',
            prompt: 'High-performing teams report more errors because members do not fear __________ when admitting uncertainties.',
            instructions: 'Write ONE WORD ONLY.',
            correctAnswers: ['humiliation', 'retribution'],
            explanation: {
              whyCorrect: 'Lecturer explains: "...because members do not fear humiliation, retribution, or marginalization..."',
              timestamp: '1:10',
              importantClue: 'do not fear humiliation',
              vocabularyNote: 'Psychological emotional terminology.',
              mistakeCategory: 'Vocabulary problem',
            },
          },
        ],
      },
    ],
  },

  // Test 09: Community Event
  {
    id: 'list-09',
    slug: 'test-09',
    audioUrl: '/audio/test-09.mp3',
    title: 'Listening Test 09: Community Arts Festival Planning',
    topic: 'Community Event',
    description: '10-minute 4-part IELTS listening test covering festival volunteer registration, market stall layout, council sponsorship meeting, and sociology lecture on festival economics.',
    difficulty: 'Intermediate',
    durationMinutes: 10,
    totalDurationSeconds: 610,
    section: 1,
    parts: [
      {
        id: 'list-09-p1',
        partNumber: 1,
        audioUrl: '/audio/test-09-p1.mp3',
        title: 'Part 1: Volunteer Steward Registration',
        situation: 'Volunteer registering with the municipal festival coordinator.',
        durationMinutes: 2.5,
        durationSeconds: 150,
        audioScript: `Coordinator: Good afternoon, Riverside Summer Arts Festival coordination desk. Are you interested in volunteering?
Volunteer: Yes! My name is Rebecca Thornton. That is T-H-O-R-N-T-O-N.
Coordinator: Welcome, Rebecca. We have openings for stage marshals, information booth stewards, and waste management ambassadors.
Volunteer: I would love to assist at the information booth. Which days do you need support?
Coordinator: The festival takes place over the August bank holiday weekend, specifically Saturday the 24th and Sunday the 25th of August. Shifts run from 10:00 AM to 3:00 PM for the morning shift, and 3:00 PM to 8:00 PM for the evening shift.
Volunteer: I can do both morning shifts on Saturday and Sunday.
Coordinator: Excellent. We provide free meals, an official festival t-shirt, and public transport reimbursement up to £12 per day.`,
        questions: [
          {
            id: 'lq-09-1',
            number: 1,
            type: 'form_completion',
            prompt: 'Volunteer Surname: __________',
            instructions: 'Write ONE WORD ONLY.',
            correctAnswers: ['thornton'],
            explanation: {
              whyCorrect: 'Rebecca spells: "Rebecca Thornton. That is T-H-O-R-N-T-O-N."',
              timestamp: '0:22',
              importantClue: 'T-H-O-R-N-T-O-N',
              vocabularyNote: 'Surname dictation.',
              mistakeCategory: 'Spelling mistake',
            },
          },
          {
            id: 'lq-09-2',
            number: 2,
            type: 'short_answer',
            prompt: 'What is the maximum daily public transport reimbursement in pounds?',
            instructions: 'Write ONE NUMBER ONLY.',
            correctAnswers: ['12', '£12', '12 pounds'],
            explanation: {
              whyCorrect: 'Coordinator confirms: "...reimbursement up to £12 per day."',
              timestamp: '1:20',
              importantClue: 'up to £12 per day',
              vocabularyNote: 'Expense allowance figure.',
              mistakeCategory: 'Number confusion',
            },
          },
        ],
      },
      {
        id: 'list-09-p2',
        partNumber: 2,
        audioUrl: '/audio/test-09-p2.mp3',
        title: 'Part 2: Festival Artisan Market Layout & Health Protocols',
        situation: 'Market coordinator instructing artisanal food and craft vendors.',
        durationMinutes: 2.3,
        durationSeconds: 145,
        audioScript: `Welcome stallholders to Victoria Park. Stalls numbered 1 to 20 on the eastern lawn are reserved for handmade craft and ceramic vendors.
Food vendors are located on the western asphalt concourse, in stalls 21 through 45, adjacent to the municipal potable water supply.
All hot food stalls must possess an active dry-powder fire extinguisher and commercial hygiene certificate level 2. Unloading vehicles must clear the pedestrian promenade by 8:30 AM before visitor gates open at 9:00 AM.`,
        questions: [
          {
            id: 'lq-09-3',
            number: 3,
            type: 'short_answer',
            prompt: 'By what time must vendor unloading vehicles clear the promenade?',
            instructions: 'Write the time.',
            correctAnswers: ['8:30 am', '8:30', '8.30 am'],
            explanation: {
              whyCorrect: 'Speaker states: "...clear the pedestrian promenade by 8:30 AM..."',
              timestamp: '1:10',
              importantClue: 'by 8:30 AM',
              vocabularyNote: 'Time constraint listening.',
              mistakeCategory: 'Number confusion',
            },
          },
        ],
      },
      {
        id: 'list-09-p3',
        partNumber: 3,
        audioUrl: '/audio/test-09-p3.mp3',
        title: 'Part 3: City Council Grant Allocation Review',
        situation: 'Two committee members reviewing financial allocations for sound stages and accessibility ramps.',
        durationMinutes: 2.6,
        durationSeconds: 160,
        audioScript: `Member A: Let us review the £40,000 municipal arts grant allocation.
Member B: We budgeted £18,000 for mainstage audio-visual production, £12,000 for sanitation and recycling contractors, and £6,000 for accessibility ramps and wheelchair viewing platforms.
Member A: That leaves £4,000 in contingency reserves. We should allocate £1,500 of that reserve to secure sign-language interpreters for the headline spoken word performances on Sunday afternoon.
Member B: Agreed. Accessibility ensures civic inclusivity.`,
        questions: [
          {
            id: 'lq-09-4',
            number: 4,
            type: 'multiple_choice',
            prompt: 'How much was allocated specifically for accessibility ramps and viewing platforms in pounds?',
            options: ['£1,500', '£4,000', '£6,000', '£18,000'],
            correctAnswers: ['£6,000', '6000'],
            explanation: {
              whyCorrect: 'Member B notes: "...and £6,000 for accessibility ramps and wheelchair viewing platforms."',
              timestamp: '0:45',
              importantClue: '£6,000 for accessibility ramps',
              vocabularyNote: 'Budget item matching.',
              mistakeCategory: 'Number confusion',
            },
          },
        ],
      },
      {
        id: 'list-09-p4',
        partNumber: 4,
        audioUrl: '/audio/test-09-p4.mp3',
        title: 'Part 4: The Multiplier Effect of Cultural Festivals on Local Economies',
        situation: 'Economics lecture examining indirect municipal revenue generated by transient festival tourism.',
        durationMinutes: 2.6,
        durationSeconds: 155,
        audioScript: `Lecturer: In today's public finance lecture, we investigate economic impact analyses of municipal cultural events.
Civic administrators frequently face public skepticism regarding tax expenditures on short-lived cultural festivals. However, regional economic studies consistently demonstrate an economic multiplier effect of approximately three to one.
For every public pound invested in festival infrastructure, visitors expend three pounds across local independent businesses—including hospitality venues, retail shops, and regional transport networks. Furthermore, cultural vibrancy bolsters civic branding, attracting long-term skilled talent and corporate investment to post-industrial urban centers.`,
        questions: [
          {
            id: 'lq-09-5',
            number: 5,
            type: 'sentence_completion',
            prompt: 'Regional economic studies demonstrate an economic __________ effect of approximately three to one.',
            instructions: 'Write ONE WORD ONLY.',
            correctAnswers: ['multiplier'],
            explanation: {
              whyCorrect: 'Lecturer confirms: "...consistently demonstrate an economic multiplier effect of approximately three to one."',
              timestamp: '0:48',
              importantClue: 'economic multiplier effect',
              vocabularyNote: 'Macroeconomics terminology.',
              mistakeCategory: 'Vocabulary problem',
            },
          },
        ],
      },
    ],
  },

  // Test 10: Science and Technology
  {
    id: 'list-10',
    slug: 'test-10',
    audioUrl: '/audio/test-10.mp3',
    title: 'Listening Test 10: Science and Technology Innovations',
    topic: 'Science and Technology',
    description: '10-minute 4-part IELTS listening test covering lab facility booking, cleanroom protocol briefing, quantum computing discussion, and space telescope engineering lecture.',
    difficulty: 'Advanced',
    durationMinutes: 10,
    totalDurationSeconds: 615,
    section: 4,
    parts: [
      {
        id: 'list-10-p1',
        partNumber: 1,
        audioUrl: '/audio/test-10-p1.mp3',
        title: 'Part 1: University Nanotechnology Lab Access Registration',
        situation: 'Graduate student applying for access credentials to an electron microscopy suite.',
        durationMinutes: 2.5,
        durationSeconds: 150,
        audioScript: `Manager: Good morning. Welcome to the Advanced Nanofabrication Facility. Are you applying for cleanroom access?
Student: Yes, good morning. I am a master's student in materials science. My name is Gregory Bennett.
Manager: Welcome, Gregory. To obtain swipe credentials, you must complete two prerequisites: first, our online hazardous chemical safety module, and second, a two-hour practical cleanroom gowning workshop.
Student: I completed the online chemical module yesterday. Here is my certification number: N-A-N-O 9-9-4-2.
Manager: Perfect. The next gowning workshop is on Tuesday at 2:00 PM in Lab 104. Once certified, your annual access key fob requires a £20 refundable deposit.`,
        questions: [
          {
            id: 'lq-09-1',
            number: 1,
            type: 'form_completion',
            prompt: 'Student Certification Code: NANO-__________',
            instructions: 'Write the digits only.',
            correctAnswers: ['9942'],
            explanation: {
              whyCorrect: 'Gregory states: "...N-A-N-O 9-9-4-2."',
              timestamp: '0:48',
              importantClue: '9942',
              vocabularyNote: 'Alphanumeric code listening.',
              mistakeCategory: 'Number confusion',
            },
          },
          {
            id: 'lq-09-2',
            number: 2,
            type: 'short_answer',
            prompt: 'In which lab room will the gowning workshop take place?',
            instructions: 'Write the room number.',
            correctAnswers: ['104', 'lab 104', 'room 104'],
            explanation: {
              whyCorrect: 'Manager notes: "...Tuesday at 2:00 PM in Lab 104."',
              timestamp: '1:12',
              importantClue: 'Lab 104',
              vocabularyNote: 'Room number extraction.',
              mistakeCategory: 'Number confusion',
            },
          },
        ],
      },
      {
        id: 'list-10-p2',
        partNumber: 2,
        audioUrl: '/audio/test-10-p2.mp3',
        title: 'Part 2: Semiconductor Cleanroom Protocols & Particulate Control',
        situation: 'Facility safety officer explaining ISO Class 5 cleanroom airflow and particulate filtration.',
        durationMinutes: 2.3,
        durationSeconds: 145,
        audioScript: `Welcome to the ISO Class 5 semiconductor cleanroom. In this environment, ambient air cannot exceed 3,520 particles per cubic meter of size 0.5 microns or larger.
To sustain this air purity, laminar airflow pushes air continuously downwards through High-Efficiency Particulate Air (HEPA) filters in the ceiling.
Standard paper notebooks and wooden pencils are strictly forbidden because they shed thousands of cellulose fibers. You must write using non-lint synthetic cleanroom paper and specialized polymer pens.`,
        questions: [
          {
            id: 'lq-10-3',
            number: 3,
            type: 'sentence_completion',
            prompt: 'Air is continuously purified by ceiling-mounted __________ filters.',
            instructions: 'Write ONE ACRONYM or WORD.',
            correctAnswers: ['hepa', 'HEPA'],
            explanation: {
              whyCorrect: 'Safety officer states: "...through High-Efficiency Particulate Air (HEPA) filters in the ceiling."',
              timestamp: '0:45',
              importantClue: 'HEPA filters',
              vocabularyNote: 'Technical acronym listening.',
              mistakeCategory: 'Spelling mistake',
            },
          },
        ],
      },
      {
        id: 'list-10-p3',
        partNumber: 3,
        audioUrl: '/audio/test-10-p3.mp3',
        title: 'Part 3: Quantum Superposition and Qubit Decoherence',
        situation: 'Physics professor discussing dilution refrigerators with two graduate researchers.',
        durationMinutes: 2.6,
        durationSeconds: 160,
        audioScript: `Professor: Good afternoon, Elena and Vikram. Let us review the cryogenic performance of our superconducting quantum processor.
Elena: Our transmon qubits demonstrated coherence times of 120 microseconds before thermal noise induced state decoherence.
Vikram: The dilution refrigerator maintained the base plate at fifteen millikelvin—just fractions of a degree above absolute zero.
Professor: That is a solid baseline. To scale to a hundred logical qubits, we must implement surface code quantum error correction to mitigate stray electromagnetic crosstalk.`,
        questions: [
          {
            id: 'lq-10-4',
            number: 4,
            type: 'multiple_choice',
            prompt: 'What was the base plate operating temperature achieved inside the dilution refrigerator?',
            options: ['15 millikelvin', '25 millikelvin', '120 millikelvin', '300 kelvin'],
            correctAnswers: ['15 millikelvin'],
            explanation: {
              whyCorrect: 'Vikram states: "...maintained the base plate at fifteen millikelvin..." (120 microseconds was coherence time).',
              timestamp: '0:42',
              importantClue: 'fifteen millikelvin',
              vocabularyNote: 'Cryogenic temperature units.',
              mistakeCategory: 'Distractor confusion',
            },
          },
        ],
      },
      {
        id: 'list-10-p4',
        partNumber: 4,
        audioUrl: '/audio/test-10-p4.mp3',
        title: 'Part 4: Cryogenic Optics and Sunshield Engineering of Space Telescopes',
        situation: 'Astrophysics lecture analyzing the James Webb Space Telescope deployment at the L2 Lagrange point.',
        durationMinutes: 2.6,
        durationSeconds: 160,
        audioScript: `Lecturer: Today we evaluate deep-space astronomical instrumentation, focusing on the cryogenic engineering of the James Webb Space Telescope positioned at the second Lagrange point, 1.5 million kilometers from Earth.
Because infrared instruments detect thermal radiation emitted by ancient primordial galaxies from thirteen billion years ago, the telescope's beryllium mirrors must remain chilled below minus two hundred and thirty-three degrees Celsius.
To shield the mirrors from solar and terrestrial irradiance, engineers deployed a five-layer sunshield fabricated from a specialized polyimide film known as Kapton. Each tennis-court-sized layer is separated by vacuum gaps, attenuating over three hundred kilowatts of solar heat down to a mere fraction of a watt on the cold observatory side.`,
        questions: [
          {
            id: 'lq-10-5',
            number: 5,
            type: 'sentence_completion',
            prompt: 'The sunshield consists of five layers made from a specialized polyimide film called __________.',
            instructions: 'Write ONE WORD ONLY.',
            correctAnswers: ['kapton', 'Kapton'],
            explanation: {
              whyCorrect: 'Lecturer specifies: "...polyimide film known as Kapton."',
              timestamp: '1:15',
              importantClue: 'known as Kapton',
              vocabularyNote: 'Advanced material proper noun.',
              mistakeCategory: 'Spelling mistake',
            },
          },
        ],
      },
    ],
  },
];
