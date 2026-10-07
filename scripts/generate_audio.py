import os
import subprocess
import re

os.makedirs('public/audio', exist_ok=True)

tests_data = [
    {
        "id": "test-01",
        "title": "Test 01: Booking a Hotel Room",
        "parts": [
            {
                "p": 1,
                "text": "This is the IELTS Listening Practice Test. Part 1: Room Reservation and Special Requirements. Look at Questions 1 to 10. Good afternoon and welcome to the Grand Regency Hotel reservations desk. My name is Julian. How may I assist you today? Hello Julian, I would like to book accommodation for next month for a conference and family holiday. Could I have your full name please? Yes, it is Robert Henderson. That is spelled H-E-N-D-E-R-S-O-N. And what dates are you planning to check in and check out? We will be arriving on Friday the 14th of November and departing on Tuesday the 18th of November, so that will be four nights in total. How many guests in your party? There will be three of us: my wife, our ten-year-old daughter, and myself. We would ideally like an executive family suite with two queen-sized beds and a balcony facing the botanical gardens. We have an Executive Garden Suite on the fourth floor. The standard rate is normally two hundred and forty pounds per night, but our seasonal discount brings it down to two hundred and ten pounds per night, which includes full English breakfast. Complimentary high-speed Wi-Fi is included throughout the property. Airport transfers can be arranged with our private shuttle for an additional twenty-five pounds each way. My mobile contact number is 07820 449 120. Thank you Mr. Henderson, your booking is confirmed."
            },
            {
                "p": 2,
                "text": "Part 2: Hotel Guest Facilities and Local Excursions. Look at Questions 11 to 20. Welcome to the Grand Regency Hotel guest orientation. Our leisure club features a heated twenty-five-meter swimming pool open from 6 a.m. to 10 p.m. daily. The fitness center requires an induction session with our fitness trainer. For breakfast, the Garden Terrace serves from 7 a.m. to 10:30 a.m. We offer daily walking tours of the historic cathedral district departing the lobby at 10:15 a.m. Advance booking at concierge is essential."
            },
            {
                "p": 3,
                "text": "Part 3: Conference Facilities and Audio Visual Setup. Look at Questions 21 to 30. Hi Mark, let us finalize our conference room arrangement for the international medical symposium. We need the Millennium Suite setup in theater style for one hundred and twenty delegates. Projector resolution must support 4K medical imaging. Dual wireless lapel microphones and roving audience microphones are required. Catering coffee breaks will take place in the atrium lobby at 11 a.m. and 3:30 p.m."
            },
            {
                "p": 4,
                "text": "Part 4: Architectural Evolution of Modern Urban Hotels. Look at Questions 31 to 40. In today's architectural lecture, we examine the evolution of luxury hospitality design from nineteenth century railway hotels to contemporary sustainable urban structures. Nineteenth century hotels emphasized grand stone facades and monumental lobbies designed to project civic pride. In the late twentieth century, modular concrete design allowed rapid international standardization. Today, acoustic isolation and biophilic ventilation systems define premier high-density urban hotels. That is the end of the listening test. You now have time to review your answers."
            }
        ]
    },
    {
        "id": "test-02",
        "title": "Test 02: University Student Orientation",
        "parts": [
            {
                "p": 1,
                "text": "This is IELTS Listening Test 02. Part 1: Campus Registration and Student Services. Hello, I need to complete my international student registration. Name is Sarah Chen. Department of Computer Science. Student ID number is CS 84920. Welcome to Northfield University Sarah. You need to collect your student smart card from the central library desk."
            },
            {
                "p": 2,
                "text": "Part 2: Campus Facilities Tour and Health Center. Welcome new undergraduates. The student health center is located in building 4 next to the sports pavilion. Register with a general practitioner during week one. The campus shuttle runs every 12 minutes between north campus and student village."
            },
            {
                "p": 3,
                "text": "Part 3: Academic Writing Seminar and Referencing Guidelines. In today's seminar, Dr. Reynolds and two postgraduate mentors discuss academic integrity, source evaluation, and Harvard referencing requirements for first year research dissertations."
            },
            {
                "p": 4,
                "text": "Part 4: History and Future of Renewable Energy Research. Good morning. Today we examine third generation photovoltaic materials and perovskite solar cells developed at the university engineering research laboratories."
            }
        ]
    },
    {
        "id": "test-03",
        "title": "Test 03: Joining a Sports Club",
        "parts": [
            {
                "p": 1,
                "text": "This is IELTS Listening Test 03. Part 1: Sports Club Membership Enquiry. Good morning, Riverside Athletic Center. I would like to join the gym and tennis club. Name: David Miller. Annual membership package: Gold All Access. Monthly fee: 45 pounds. Lockers and sauna included."
            },
            {
                "p": 2,
                "text": "Part 2: Fitness Classes and Pool Schedule. Welcome to Riverside Center. Spin classes take place Monday, Wednesday, and Friday at 7 a.m. The Olympic swimming pool is reserved for lane swimming between 6 a.m. and 9 a.m."
            },
            {
                "p": 3,
                "text": "Part 3: Sports Nutrition and Injury Prevention. Professor Davis and two athletic trainers discuss macronutrient timing, hydration strategies, and eccentric loading for hamstring strain rehabilitation."
            },
            {
                "p": 4,
                "text": "Part 4: Biomechanics of High-Performance Sprinting. Today's sports science lecture focuses on ground reaction forces, stride frequency, and neuromuscular efficiency in elite sprinters."
            }
        ]
    },
    {
        "id": "test-04",
        "title": "Test 04: Library Membership",
        "parts": [
            {
                "p": 1,
                "text": "This is IELTS Listening Test 04. Part 1: Public Library Card Application. Hello, I would like to register for a city library card. Name: Emma Watson. Address: 42 Elmwood Grove. Borrowing limit: up to 12 books and 4 audiobooks for 3 weeks."
            },
            {
                "p": 2,
                "text": "Part 2: Digital Archives and Community Workshops. The central library houses over 50,000 digitized historical records. Free community computer coding workshops are held every Thursday evening."
            },
            {
                "p": 3,
                "text": "Part 3: Literature Dissertation Research Group. Academic discussion on Victorian narrative techniques and social commentary in early nineteenth century British periodicals."
            },
            {
                "p": 4,
                "text": "Part 4: The History of Papermaking and Printing Technology. A scholarly lecture tracing the evolution of cellulose extraction from Han Dynasty China to Guttenberg's movable type and modern digital preservation."
            }
        ]
    },
    {
        "id": "test-05",
        "title": "Test 05: Environmental Research Project",
        "parts": [
            {
                "p": 1,
                "text": "This is IELTS Listening Test 05. Part 1: Wetland Conservation Fieldwork Volunteer Registration. Good morning, Coastal Ecology Trust. Registration for Saturday mangrove habitat planting. Name: Liam O'Connor. Meeting location: Harbor Pier Gate 3 at 8:30 a.m."
            },
            {
                "p": 2,
                "text": "Part 2: Local Wildlife Sanctuary Visitor Regulations. Welcome to Greendale Wildlife Sanctuary. Please stay on marked timber boardwalks. Flash photography and drone operation are strictly prohibited to protect nesting osprey."
            },
            {
                "p": 3,
                "text": "Part 3: Marine Microplastics Survey Methodology. University marine biology research team reviews sampling protocols, trawl mesh sizes, and infrared spectrometry analysis of coastal water samples."
            },
            {
                "p": 4,
                "text": "Part 4: Oceanic Carbon Sequestration Mechanisms. Academic lecture on the biological pump, phytoplankton blooms, and deep-sea benthic carbon storage in polar and temperate ocean basins."
            }
        ]
    },
    {
        "id": "test-06",
        "title": "Test 06: Travel and Transportation",
        "parts": [
            {
                "p": 1,
                "text": "This is IELTS Listening Test 06. Part 1: Intercity Rail Pass Booking. Railway customer service. Customer booking regional rail flexi-pass for travel across Scotland. Standard adult fare with off-peak discount."
            },
            {
                "p": 2,
                "text": "Part 2: Metropolitan Transit Network Upgrades. City transport commissioner announcement on automated light rail expansion, contactless payment gates, and zero-emission electric bus routes."
            },
            {
                "p": 3,
                "text": "Part 3: Sustainable Urban Transport Planning Seminar. Postgraduate urban design students debate congestion pricing, dedicated cycling corridors, and pedestrianized city center zones."
            },
            {
                "p": 4,
                "text": "Part 4: High-Speed Maglev Train Aerodynamics. Engineering lecture on magnetic levitation principles, linear synchronous motors, and aerodynamic drag reduction at speeds exceeding 500 kilometers per hour."
            }
        ]
    },
    {
        "id": "test-07",
        "title": "Test 07: Museum Tour",
        "parts": [
            {
                "p": 1,
                "text": "This is IELTS Listening Test 07. Part 1: Museum Group Booking and Guided Tour Inquiry. Heritage Museum reception. Group booking for 24 high school history students. Special exhibition on ancient Egyptian metallurgy."
            },
            {
                "p": 2,
                "text": "Part 2: Gallery Layout and Interactive Audio Guide Instructions. Information for gallery visitors. Audio guides are available in nine languages. Cloakroom and lockers on lower ground floor."
            },
            {
                "p": 3,
                "text": "Part 3: Artifact Curation and Provenance Verification. Discussion between museum chief curator and archaeology fellow regarding radiocarbon dating and ethical provenance of Bronze Age artifacts."
            },
            {
                "p": 4,
                "text": "Part 4: Chemical Preservation of Ancient Organic Textiles. Conservation science lecture on humidity control, enzymatic cleaning, and anaerobic storage for historic silk and wool tapestries."
            }
        ]
    },
    {
        "id": "test-08",
        "title": "Test 08: Job Interview and Workplace",
        "parts": [
            {
                "p": 1,
                "text": "This is IELTS Listening Test 08. Part 1: Graduate Recruitment Assessment Centre Schedule. Telephone conversation confirming interview time, location at Tower Bridge Financial Centre, and required academic documentation."
            },
            {
                "p": 2,
                "text": "Part 2: Employee Wellness Program and Workplace Benefits. Company HR director orientation on flexible working hours, health insurance coverage, and professional development subsidies."
            },
            {
                "p": 3,
                "text": "Part 3: Agile Project Management and Cross-Functional Collaboration. Team retrospective discussing sprint velocity, Kanban board optimization, and stakeholder communication channels."
            },
            {
                "p": 4,
                "text": "Part 4: Organizational Psychology of Workplace Motivation. Academic lecture analyzing intrinsic versus extrinsic motivators, psychological safety, and leadership styles in remote tech teams."
            }
        ]
    },
    {
        "id": "test-09",
        "title": "Test 09: Community Event",
        "parts": [
            {
                "p": 1,
                "text": "This is IELTS Listening Test 09. Part 1: Annual Summer Street Festival Stall Application. Municipal festival committee phone call regarding organic food stall registration, electrical safety inspection, and stall dimensions."
            },
            {
                "p": 2,
                "text": "Part 2: Community Volunteering Guidelines and Safety Protocol. Volunteer coordinator briefing on crowd flow management, lost children point, and first aid tent locations in Victoria Park."
            },
            {
                "p": 3,
                "text": "Part 3: Public Health Initiative Campaign Planning. Community health liaison meeting regarding diabetes awareness screening, mobile vaccination clinics, and multicultural outreach flyers."
            },
            {
                "p": 4,
                "text": "Part 4: Sociology of Urban Community Cohesion and Social Capital. Sociological lecture examining third places, neighborhood social networks, and community resilience in post-industrial cities."
            }
        ]
    },
    {
        "id": "test-10",
        "title": "Test 10: Science and Technology",
        "parts": [
            {
                "p": 1,
                "text": "This is IELTS Listening Test 10. Part 1: University Science Exhibition Delegate Registration. Science center booking for international delegates attending the quantum computing symposium. Badge collection and workshop passes."
            },
            {
                "p": 2,
                "text": "Part 2: Planetarium Sky Show and Space Observatory Tour. Planetarium director orientation on digital dome projection, lunar eclipse tracking, and public telescope viewing night on Friday."
            },
            {
                "p": 3,
                "text": "Part 3: Artificial Intelligence Ethics and Algorithmic Bias. University research debate analyzing training dataset fairness, explainable neural networks, and automated credit decisioning models."
            },
            {
                "p": 4,
                "text": "Part 4: Nanotechnology Applications in Targeted Cancer Therapeutics. Nanomedicine lecture examining functionalized lipid nanoparticles, drug delivery mechanisms, and immune system evasion."
            }
        ]
    }
]

print("Generating IELTS audio files with textfile parameter...")
for t in tests_data:
    test_id = t["id"]
    part_files = []
    for part in t["parts"]:
        p_num = part["p"]
        p_file = f"public/audio/{test_id}-p{p_num}.mp3"
        tmp_txt = f"/tmp/{test_id}_p{p_num}.txt"
        with open(tmp_txt, "w") as f:
            f.write(part["text"])

        cmd = [
            "ffmpeg", "-f", "lavfi",
            "-i", f"flite=textfile={tmp_txt}:voice=kal16",
            "-af", "volume=1.8",
            "-c:a", "libmp3lame", "-q:a", "4",
            "-y", p_file
        ]
        res = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if res.returncode == 0:
            part_files.append(p_file)
            print(f"Generated {p_file}")
        else:
            print(f"Error generating {p_file}")

    # Generate concatenated full continuous test audio
    full_file = f"public/audio/{test_id}.mp3"
    if len(part_files) == 4:
        list_txt = f"/tmp/{test_id}_concat.txt"
        with open(list_txt, "w") as f:
            for pf in part_files:
                f.write(f"file '{os.path.abspath(pf)}'\n")
        concat_cmd = [
            "ffmpeg", "-f", "concat", "-safe", "0",
            "-i", list_txt,
            "-c:a", "libmp3lame", "-q:a", "4",
            "-y", full_file
        ]
        subprocess.run(concat_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print(f"Generated full continuous audio: {full_file}")

print("Audio generation completed successfully.")
