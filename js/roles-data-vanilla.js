/**
 * Roles Data - Vanilla JS (no ES modules)
 * Comprehensive career roles with stages, skills, and tasks
 */

const ROLES_DATA = [
  {
    slug: 'doctor',
    title: 'Doctor',
    summary: 'Become a medical professional through structured education, training, and certification. Learn the path from pre-med to practicing physician.',
    domain: 'Healthcare',
    difficulty: 'Advanced',
    estMonths: 120,
    coverImage: '',
    published: true,
    stages: [
      {
        id: '1',
        order: 1,
        title: 'Pre-Medical Foundation',
        description: 'Build strong foundation in sciences and prepare for medical school entrance exams.',
        skills: [
          { name: 'Biology', summary: 'Understanding of human biology and physiology' },
          { name: 'Chemistry', summary: 'Organic and inorganic chemistry fundamentals' },
          { name: 'Physics', summary: 'Basic physics principles' },
          { name: 'Mathematics', summary: 'Statistics and calculus' }
        ],
        tasks: [
          { id: 't1', title: 'Complete Bachelor\'s degree in pre-med or related field', type: 'READ', minutes: null },
          { id: 't2', title: 'Study for MCAT (Medical College Admission Test)', type: 'READ', minutes: 300 },
          { id: 't3', title: 'Gain clinical experience through volunteering', type: 'REFLECT', minutes: 200 },
          { id: 't4', title: 'Shadow practicing physicians', type: 'WATCH', minutes: 100 }
        ]
      },
      {
        id: '2',
        order: 2,
        title: 'Medical School (MBBS/MD)',
        description: 'Complete 4-6 years of medical school covering all major medical disciplines.',
        skills: [
          { name: 'Anatomy', summary: 'Human body structure and systems' },
          { name: 'Pathology', summary: 'Disease mechanisms and diagnosis' },
          { name: 'Pharmacology', summary: 'Drugs and their effects' },
          { name: 'Clinical Skills', summary: 'Patient examination and diagnosis' }
        ],
        tasks: [
          { id: 't5', title: 'Complete preclinical years (2 years)', type: 'READ', minutes: 2000 },
          { id: 't6', title: 'Complete clinical rotations', type: 'BUILD', minutes: 3000 },
          { id: 't7', title: 'Pass medical licensing exams', type: 'QUIZ', minutes: 500 }
        ]
      },
      {
        id: '3',
        order: 3,
        title: 'Residency & Specialization',
        description: 'Complete residency program and choose a medical specialty.',
        skills: [
          { name: 'Specialty Knowledge', summary: 'Deep expertise in chosen field' },
          { name: 'Surgical Skills', summary: 'If pursuing surgery' },
          { name: 'Patient Management', summary: 'Long-term patient care' }
        ],
        tasks: [
          { id: 't8', title: 'Match into residency program', type: 'BUILD', minutes: null },
          { id: 't9', title: 'Complete 3-7 years of residency', type: 'BUILD', minutes: 10000 },
          { id: 't10', title: 'Pass specialty board exams', type: 'QUIZ', minutes: 600 }
        ]
      }
    ],
    resources: [
      { id: 'r1', title: 'MCAT Prep Guide', kind: 'guide', url: 'https://www.aamc.org' },
      { id: 'r2', title: 'Medical School Admissions', kind: 'guide', url: 'https://www.aamc.org' }
    ]
  },
  {
    slug: 'engineer',
    title: 'Software Engineer',
    summary: 'Build software applications, systems, and platforms. Master programming, system design, and software engineering principles.',
    domain: 'Technology',
    difficulty: 'Intermediate',
    estMonths: 12,
    coverImage: '',
    published: true,
    stages: [
      {
        id: '1',
        order: 1,
        title: 'Programming Foundations',
        description: 'Learn core programming concepts, data structures, and algorithms.',
        skills: [
          { name: 'Programming Languages', summary: 'Python, JavaScript, or Java' },
          { name: 'Data Structures', summary: 'Arrays, lists, trees, graphs' },
          { name: 'Algorithms', summary: 'Sorting, searching, optimization' },
          { name: 'Problem Solving', summary: 'Break down complex problems' }
        ],
        tasks: [
          { id: 't1', title: 'Learn a programming language (Python recommended)', type: 'READ', minutes: 200 },
          { id: 't2', title: 'Master data structures and algorithms', type: 'READ', minutes: 300 },
          { id: 't3', title: 'Build 5 beginner projects', type: 'BUILD', minutes: 500 },
          { id: 't4', title: 'Solve 50 coding challenges', type: 'QUIZ', minutes: 400 }
        ]
      },
      {
        id: '2',
        order: 2,
        title: 'Frontend or Backend Track',
        description: 'Choose specialization: Frontend (UI/UX) or Backend (APIs, databases).',
        skills: [
          { name: 'Frontend: React/Vue', summary: 'Modern UI frameworks' },
          { name: 'Backend: Node.js/Python', summary: 'Server-side development' },
          { name: 'Databases', summary: 'SQL and NoSQL' },
          { name: 'APIs', summary: 'REST and GraphQL' }
        ],
        tasks: [
          { id: 't5', title: 'Build a full-stack web application', type: 'BUILD', minutes: 800 },
          { id: 't6', title: 'Learn database design and queries', type: 'READ', minutes: 200 },
          { id: 't7', title: 'Deploy application to cloud', type: 'BUILD', minutes: 300 }
        ]
      },
      {
        id: '3',
        order: 3,
        title: 'System Design & Scaling',
        description: 'Learn to design scalable systems and handle production workloads.',
        skills: [
          { name: 'System Architecture', summary: 'Microservices, monoliths' },
          { name: 'Cloud Platforms', summary: 'AWS, Azure, GCP' },
          { name: 'DevOps', summary: 'CI/CD, containers, monitoring' }
        ],
        tasks: [
          { id: 't8', title: 'Design a scalable system architecture', type: 'REFLECT', minutes: 200 },
          { id: 't9', title: 'Learn cloud platform basics', type: 'READ', minutes: 300 },
          { id: 't10', title: 'Set up CI/CD pipeline', type: 'BUILD', minutes: 400 }
        ]
      },
      {
        id: '4',
        order: 4,
        title: 'Interview Preparation',
        description: 'Prepare for technical interviews with coding practice and system design.',
        skills: [
          { name: 'Coding Interviews', summary: 'LeetCode, HackerRank practice' },
          { name: 'System Design', summary: 'Design large-scale systems' },
          { name: 'Behavioral Interviews', summary: 'Communication and teamwork' }
        ],
        tasks: [
          { id: 't11', title: 'Solve 100+ coding problems', type: 'QUIZ', minutes: 1000 },
          { id: 't12', title: 'Practice system design questions', type: 'REFLECT', minutes: 300 },
          { id: 't13', title: 'Mock interviews', type: 'BUILD', minutes: 200 }
        ]
      }
    ],
    resources: [
      { id: 'r1', title: 'freeCodeCamp', kind: 'course', url: 'https://www.freecodecamp.org' },
      { id: 'r2', title: 'LeetCode', kind: 'guide', url: 'https://leetcode.com' }
    ]
  },
  {
    slug: 'lawyer',
    title: 'Lawyer',
    summary: 'Pursue a career in law through undergraduate preparation, law school, and bar examination.',
    domain: 'Legal',
    difficulty: 'Advanced',
    estMonths: 84,
    coverImage: '',
    published: true,
    stages: [
      {
        id: '1',
        order: 1,
        title: 'Pre-Law Preparation',
        description: 'Complete undergraduate degree and prepare for law school admission (LSAT).',
        skills: [
          { name: 'Critical Thinking', summary: 'Analyze complex arguments' },
          { name: 'Writing', summary: 'Persuasive and analytical writing' },
          { name: 'Research', summary: 'Legal research methods' }
        ],
        tasks: [
          { id: 't1', title: 'Complete Bachelor\'s degree', type: 'READ', minutes: null },
          { id: 't2', title: 'Study for LSAT (Law School Admission Test)', type: 'READ', minutes: 300 },
          { id: 't3', title: 'Gain legal experience (internships, paralegal)', type: 'BUILD', minutes: 400 }
        ]
      },
      {
        id: '2',
        order: 2,
        title: 'Law School (LLB/JD)',
        description: 'Complete 3-4 years of law school covering core legal subjects.',
        skills: [
          { name: 'Constitutional Law', summary: 'Fundamental legal principles' },
          { name: 'Contract Law', summary: 'Agreements and obligations' },
          { name: 'Criminal Law', summary: 'Crimes and punishments' },
          { name: 'Legal Writing', summary: 'Briefs, memos, arguments' }
        ],
        tasks: [
          { id: 't4', title: 'Complete first year (1L) core courses', type: 'READ', minutes: 2000 },
          { id: 't5', title: 'Choose specialization area', type: 'REFLECT', minutes: 100 },
          { id: 't6', title: 'Complete law school degree', type: 'READ', minutes: 4000 }
        ]
      },
      {
        id: '3',
        order: 3,
        title: 'Bar Exam Preparation',
        description: 'Prepare for and pass the bar examination in your jurisdiction.',
        skills: [
          { name: 'Bar Exam Subjects', summary: 'All major legal areas' },
          { name: 'Essay Writing', summary: 'Bar exam essay format' },
          { name: 'Multiple Choice', summary: 'MBE (Multistate Bar Exam)' }
        ],
        tasks: [
          { id: 't7', title: 'Enroll in bar prep course', type: 'READ', minutes: 500 },
          { id: 't8', title: 'Study 8-10 hours daily for 2-3 months', type: 'READ', minutes: 2000 },
          { id: 't9', title: 'Pass bar examination', type: 'QUIZ', minutes: 600 }
        ]
      },
      {
        id: '4',
        order: 4,
        title: 'Legal Practice',
        description: 'Begin legal practice, gain experience, and potentially specialize.',
        skills: [
          { name: 'Client Relations', summary: 'Working with clients' },
          { name: 'Court Procedures', summary: 'Litigation and court appearances' },
          { name: 'Legal Research', summary: 'Case law and precedents' }
        ],
        tasks: [
          { id: 't10', title: 'Join law firm or start practice', type: 'BUILD', minutes: null },
          { id: 't11', title: 'Complete required continuing education', type: 'READ', minutes: 200 }
        ]
      }
    ],
    resources: [
      { id: 'r1', title: 'LSAT Prep', kind: 'course', url: 'https://www.lsac.org' },
      { id: 'r2', title: 'Bar Exam Resources', kind: 'guide', url: 'https://www.americanbar.org' }
    ]
  },
  {
    slug: 'police',
    title: 'Police Officer',
    summary: 'Serve your community as a law enforcement officer through fitness, training, and certification.',
    domain: 'Public Service',
    difficulty: 'Intermediate',
    estMonths: 12,
    coverImage: '',
    published: true,
    stages: [
      {
        id: '1',
        order: 1,
        title: 'Physical Fitness Preparation',
        description: 'Build physical strength, endurance, and meet fitness requirements.',
        skills: [
          { name: 'Cardiovascular Fitness', summary: 'Running, endurance' },
          { name: 'Strength Training', summary: 'Push-ups, sit-ups, pull-ups' },
          { name: 'Agility', summary: 'Speed and coordination' }
        ],
        tasks: [
          { id: 't1', title: 'Establish daily workout routine', type: 'BUILD', minutes: 60 },
          { id: 't2', title: 'Practice police fitness test requirements', type: 'BUILD', minutes: 300 },
          { id: 't3', title: 'Maintain fitness for 3+ months', type: 'BUILD', minutes: 2000 }
        ]
      },
      {
        id: '2',
        order: 2,
        title: 'General Knowledge & Aptitude',
        description: 'Study for written exams covering general knowledge, reasoning, and law.',
        skills: [
          { name: 'General Knowledge', summary: 'Current events, history' },
          { name: 'Logical Reasoning', summary: 'Problem-solving and analysis' },
          { name: 'Basic Law', summary: 'Criminal law, procedures' }
        ],
        tasks: [
          { id: 't4', title: 'Study police exam prep materials', type: 'READ', minutes: 400 },
          { id: 't5', title: 'Take practice exams', type: 'QUIZ', minutes: 200 },
          { id: 't6', title: 'Pass written entrance exam', type: 'QUIZ', minutes: 180 }
        ]
      },
      {
        id: '3',
        order: 3,
        title: 'Police Academy Training',
        description: 'Complete police academy training covering law, procedures, and skills.',
        skills: [
          { name: 'Criminal Law', summary: 'Laws and procedures' },
          { name: 'Defensive Tactics', summary: 'Self-defense and arrest techniques' },
          { name: 'Firearms Training', summary: 'Weapon safety and accuracy' },
          { name: 'First Aid', summary: 'Emergency medical response' }
        ],
        tasks: [
          { id: 't7', title: 'Complete police academy (6-12 months)', type: 'BUILD', minutes: 3000 },
          { id: 't8', title: 'Pass all academy exams and practical tests', type: 'QUIZ', minutes: 500 }
        ]
      },
      {
        id: '4',
        order: 4,
        title: 'Field Training & Certification',
        description: 'Complete field training program and become certified officer.',
        skills: [
          { name: 'Patrol Procedures', summary: 'Routine patrol and response' },
          { name: 'Report Writing', summary: 'Documentation and paperwork' },
          { name: 'Community Relations', summary: 'Public interaction' }
        ],
        tasks: [
          { id: 't9', title: 'Complete field training program', type: 'BUILD', minutes: 2000 },
          { id: 't10', title: 'Pass certification exam', type: 'QUIZ', minutes: 180 }
        ]
      }
    ],
    resources: [
      { id: 'r1', title: 'Police Exam Prep', kind: 'course', url: 'https://www.policeone.com' },
      { id: 'r2', title: 'Fitness Training Guide', kind: 'guide', url: 'https://www.policeone.com' }
    ]
  },
  {
    slug: 'teacher',
    title: 'Teacher',
    summary: 'Educate the next generation through subject expertise, pedagogy training, and teaching certification.',
    domain: 'Education',
    difficulty: 'Intermediate',
    estMonths: 48,
    coverImage: '',
    published: true,
    stages: [
      {
        id: '1',
        order: 1,
        title: 'Subject Matter Expertise',
        description: 'Develop deep knowledge in your chosen teaching subject(s).',
        skills: [
          { name: 'Subject Knowledge', summary: 'Master your teaching subject' },
          { name: 'Curriculum Understanding', summary: 'Know what students need to learn' },
          { name: 'Learning Standards', summary: 'State and national standards' }
        ],
        tasks: [
          { id: 't1', title: 'Complete Bachelor\'s in subject area or education', type: 'READ', minutes: null },
          { id: 't2', title: 'Study curriculum frameworks', type: 'READ', minutes: 200 },
          { id: 't3', title: 'Create sample lesson plans', type: 'BUILD', minutes: 300 }
        ]
      },
      {
        id: '2',
        order: 2,
        title: 'Pedagogy & Teaching Methods',
        description: 'Learn how to teach effectively: lesson planning, classroom management, assessment.',
        skills: [
          { name: 'Lesson Planning', summary: 'Design effective lessons' },
          { name: 'Classroom Management', summary: 'Maintain order and engagement' },
          { name: 'Assessment', summary: 'Evaluate student learning' },
          { name: 'Differentiation', summary: 'Adapt for diverse learners' }
        ],
        tasks: [
          { id: 't4', title: 'Complete education coursework', type: 'READ', minutes: 1000 },
          { id: 't5', title: 'Learn classroom management strategies', type: 'READ', minutes: 200 },
          { id: 't6', title: 'Practice lesson plan creation', type: 'BUILD', minutes: 400 }
        ]
      },
      {
        id: '3',
        order: 3,
        title: 'Student Teaching & Practice',
        description: 'Gain hands-on experience through student teaching and observation.',
        skills: [
          { name: 'Teaching Practice', summary: 'Real classroom experience' },
          { name: 'Student Interaction', summary: 'Working with students' },
          { name: 'Reflection', summary: 'Improve through feedback' }
        ],
        tasks: [
          { id: 't7', title: 'Complete student teaching (semester/year)', type: 'BUILD', minutes: 2000 },
          { id: 't8', title: 'Observe experienced teachers', type: 'WATCH', minutes: 200 },
          { id: 't9', title: 'Receive and incorporate feedback', type: 'REFLECT', minutes: 100 }
        ]
      },
      {
        id: '4',
        order: 4,
        title: 'Certification & Licensing',
        description: 'Obtain teaching certification and license in your state.',
        skills: [
          { name: 'Certification Requirements', summary: 'Know state requirements' },
          { name: 'Testing', summary: 'Pass certification exams' }
        ],
        tasks: [
          { id: 't10', title: 'Pass teaching certification exams', type: 'QUIZ', minutes: 300 },
          { id: 't11', title: 'Complete background check', type: 'BUILD', minutes: null },
          { id: 't12', title: 'Apply for teaching license', type: 'BUILD', minutes: null }
        ]
      }
    ],
    resources: [
      { id: 'r1', title: 'Teaching Certification Guide', kind: 'guide', url: 'https://www.teach.org' },
      { id: 'r2', title: 'Lesson Plan Resources', kind: 'course', url: 'https://www.edutopia.org' }
    ]
  },
  {
    slug: 'designer',
    title: 'UI/UX Designer',
    summary: 'Design beautiful and intuitive user interfaces and experiences for digital products.',
    domain: 'Design',
    difficulty: 'Beginner',
    estMonths: 6,
    coverImage: '',
    published: true,
    stages: [
      {
        id: '1',
        order: 1,
        title: 'Design Fundamentals',
        description: 'Learn design principles, color theory, typography, and visual hierarchy.',
        skills: [
          { name: 'Design Principles', summary: 'Balance, contrast, alignment' },
          { name: 'Color Theory', summary: 'Color psychology and palettes' },
          { name: 'Typography', summary: 'Font selection and pairing' }
        ],
        tasks: [
          { id: 't1', title: 'Study design fundamentals', type: 'READ', minutes: 200 },
          { id: 't2', title: 'Learn design tools (Figma, Sketch)', type: 'READ', minutes: 150 },
          { id: 't3', title: 'Create 10 design exercises', type: 'BUILD', minutes: 500 }
        ]
      },
      {
        id: '2',
        order: 2,
        title: 'User Experience (UX)',
        description: 'Understand user research, personas, user journeys, and information architecture.',
        skills: [
          { name: 'User Research', summary: 'Interviews, surveys, usability testing' },
          { name: 'Personas', summary: 'User profiles and needs' },
          { name: 'User Journeys', summary: 'Mapping user flows' },
          { name: 'Wireframing', summary: 'Low-fidelity layouts' }
        ],
        tasks: [
          { id: 't4', title: 'Learn UX research methods', type: 'READ', minutes: 200 },
          { id: 't5', title: 'Create user personas for a project', type: 'BUILD', minutes: 200 },
          { id: 't6', title: 'Design wireframes for 3 apps', type: 'BUILD', minutes: 600 }
        ]
      },
      {
        id: '3',
        order: 3,
        title: 'UI Design & Prototyping',
        description: 'Create high-fidelity designs and interactive prototypes.',
        skills: [
          { name: 'Visual Design', summary: 'High-fidelity mockups' },
          { name: 'Prototyping', summary: 'Interactive prototypes' },
          { name: 'Design Systems', summary: 'Component libraries' }
        ],
        tasks: [
          { id: 't7', title: 'Design 5 app interfaces', type: 'BUILD', minutes: 1000 },
          { id: 't8', title: 'Create interactive prototypes', type: 'BUILD', minutes: 500 },
          { id: 't9', title: 'Build a design system', type: 'BUILD', minutes: 600 }
        ]
      },
      {
        id: '4',
        order: 4,
        title: 'Portfolio & Career',
        description: 'Build a strong portfolio and prepare for design roles.',
        skills: [
          { name: 'Portfolio Design', summary: 'Showcase your work' },
          { name: 'Case Studies', summary: 'Document design process' },
          { name: 'Client Communication', summary: 'Present and explain designs' }
        ],
        tasks: [
          { id: 't10', title: 'Create portfolio website', type: 'BUILD', minutes: 800 },
          { id: 't11', title: 'Write 3 detailed case studies', type: 'BUILD', minutes: 600 },
          { id: 't12', title: 'Apply for design positions', type: 'BUILD', minutes: null }
        ]
      }
    ],
    resources: [
      { id: 'r1', title: 'Figma Tutorials', kind: 'course', url: 'https://www.figma.com' },
      { id: 'r2', title: 'UX Design Principles', kind: 'guide', url: 'https://www.nngroup.com' }
    ]
  }
];

// Additional roles added to broaden domain coverage
ROLES_DATA.push(
  {
    slug: 'data-analyst',
    title: 'Data Analyst',
    summary: 'Analyze data to extract insights, build dashboards, and support decisions.',
    domain: 'Technology',
    difficulty: 'Intermediate',
    estMonths: 6,
    published: true,
    stages: [
      {
        id: 'da1',
        order: 1,
        title: 'Data Foundations',
        description: 'Learn SQL, spreadsheets, and basic statistics.',
        skills: [{ name: 'SQL', summary: 'Query relational databases' }, { name: 'Excel', summary: 'Data manipulation' }],
        tasks: [{ id: 't-da-1', title: 'Complete SQL basics course', type: 'READ', minutes: 300 }]
      }
    ],
    resources: [{ id: 'r-da-1', title: 'Intro to SQL', kind: 'course', url: 'https://www.khanacademy.org' }]
  },
  {
    slug: 'machine-learning-engineer',
    title: 'Machine Learning Engineer',
    summary: 'Design, train, and deploy machine learning models into production.',
    domain: 'Technology',
    difficulty: 'Advanced',
    estMonths: 12,
    published: true,
    stages: [{ id: 'ml1', order: 1, title: 'ML Basics', description: 'Statistics, linear algebra, and ML fundamentals', skills: [{ name: 'ML', summary: 'Models & evaluation' }], tasks: [{ id: 't-ml-1', title: 'Learn supervised learning algorithms', type: 'READ', minutes: 400 }] }],
    resources: [{ id: 'r-ml-1', title: 'Coursera ML', kind: 'course', url: 'https://www.coursera.org' }]
  },
  {
    slug: 'frontend-developer',
    title: 'Frontend Developer',
    summary: 'Specialize in building responsive user interfaces using modern JS frameworks.',
    domain: 'Technology',
    difficulty: 'Intermediate',
    estMonths: 9,
    published: true,
    stages: [{ id: 'fe1', order: 1, title: 'Frontend Basics', description: 'HTML, CSS, JavaScript fundamentals', skills: [{ name: 'HTML/CSS', summary: 'Structure & styling' }], tasks: [{ id: 't-fe-1', title: 'Build responsive layouts', type: 'BUILD', minutes: 300 }] }],
    resources: [{ id: 'r-fe-1', title: 'MDN Web Docs', kind: 'guide', url: 'https://developer.mozilla.org' }, { id: 'r-fe-2', title: 'Frontend Development Tutorials', kind: 'video', url: 'https://www.youtube.com/results?search_query=frontend+development' }]
  },
  {
    slug: 'backend-developer',
    title: 'Backend Developer',
    summary: 'Develop server-side logic, APIs, and databases for scalable applications.',
    domain: 'Technology',
    difficulty: 'Intermediate',
    estMonths: 9,
    published: true,
    stages: [{ id: 'be1', order: 1, title: 'Backend Essentials', description: 'APIs, databases, authentication', skills: [{ name: 'APIs', summary: 'REST/GraphQL' }], tasks: [{ id: 't-be-1', title: 'Create RESTful API', type: 'BUILD', minutes: 400 }] }],
    resources: [{ id: 'r-be-1', title: 'Node.js Guide', kind: 'guide', url: 'https://nodejs.org' }, { id: 'r-be-2', title: 'Backend Development Tutorials', kind: 'video', url: 'https://www.youtube.com/results?search_query=backend+development' }]
  },
  {
    slug: 'devops-engineer',
    title: 'DevOps Engineer',
    summary: 'Automate infrastructure, CI/CD, and monitoring to deliver reliable systems.',
    domain: 'Technology',
    difficulty: 'Advanced',
    estMonths: 8,
    published: true,
    stages: [{ id: 'd1', order: 1, title: 'DevOps Basics', description: 'Containers, CI/CD, infra as code', skills: [{ name: 'Docker', summary: 'Containerization' }], tasks: [{ id: 't-d-1', title: 'Set up CI pipeline', type: 'BUILD', minutes: 300 }] }],
    resources: [{ id: 'r-d-1', title: 'Docker Getting Started', kind: 'course', url: 'https://www.docker.com' }]
  },
  {
    slug: 'product-manager',
    title: 'Product Manager',
    summary: 'Lead product strategy, roadmaps, and cross-functional teams to build user-focused products.',
    domain: 'Business',
    difficulty: 'Intermediate',
    estMonths: 6,
    published: true,
    stages: [{ id: 'pm1', order: 1, title: 'Product Fundamentals', description: 'User research, roadmapping, metrics', skills: [{ name: 'Roadmapping', summary: 'Prioritize features' }], tasks: [{ id: 't-pm-1', title: 'Conduct customer interviews', type: 'BUILD', minutes: 120 }] }],
    resources: [{ id: 'r-pm-1', title: 'Product Management 101', kind: 'guide', url: 'https://www.productschool.com' }, { id: 'r-pm-2', title: 'Product Management Basics', kind: 'video', url: 'https://www.youtube.com/results?search_query=product+management' }]
  },
  {
    slug: 'qa-engineer',
    title: 'QA Engineer',
    summary: 'Ensure software quality through testing strategies, automation, and monitoring.',
    domain: 'Technology',
    difficulty: 'Intermediate',
    estMonths: 6,
    published: true,
    stages: [{ id: 'qa1', order: 1, title: 'QA Basics', description: 'Manual and automated testing', skills: [{ name: 'Testing', summary: 'Test design and automation' }], tasks: [{ id: 't-qa-1', title: 'Write automated tests', type: 'BUILD', minutes: 200 }] }],
    resources: [{ id: 'r-qa-1', title: 'Selenium Docs', kind: 'guide', url: 'https://www.selenium.dev' }, { id: 'r-qa-2', title: 'QA Testing Tutorials', kind: 'video', url: 'https://www.youtube.com/results?search_query=qa+testing+automation' }]
  },
  {
    slug: 'nurse',
    title: 'Nurse',
    summary: 'Provide patient care, support clinical teams, and develop hands-on medical skills.',
    domain: 'Healthcare',
    difficulty: 'Intermediate',
    estMonths: 36,
    published: true,
    stages: [{ id: 'n1', order: 1, title: 'Nursing Foundations', description: 'Clinical skills and patient care', skills: [{ name: 'Patient Care', summary: 'Vital signs, basic procedures' }], tasks: [{ id: 't-n-1', title: 'Clinical rotations', type: 'BUILD', minutes: 2000 }] }],
    resources: [{ id: 'r-n-1', title: 'Nursing Basics', kind: 'course', url: 'https://www.nursingworld.org' }]
  },
  {
    slug: 'pharmacist',
    title: 'Pharmacist',
    summary: 'Specialize in medication therapy, patient counseling, and pharmaceutical care.',
    domain: 'Healthcare',
    difficulty: 'Advanced',
    estMonths: 72,
    published: true,
    stages: [{ id: 'ph1', order: 1, title: 'Pharmacy Education', description: 'Pharmacology and clinical practice', skills: [{ name: 'Pharmacology', summary: 'Drug mechanisms and interactions' }], tasks: [{ id: 't-ph-1', title: 'Complete pharmacy program', type: 'READ', minutes: 4000 }] }],
    resources: [{ id: 'r-ph-1', title: 'Pharmacy Resources', kind: 'guide', url: 'https://www.pharmacist.com' }, { id: 'r-ph-2', title: 'Pharmacy Tutorials', kind: 'video', url: 'https://www.youtube.com/results?search_query=pharmacology+pharmacy' }]
  },
  {
    slug: 'psychologist',
    title: 'Psychologist',
    summary: 'Study behavior and mental processes, provide therapy, assessment, and research.',
    domain: 'Healthcare',
    difficulty: 'Advanced',
    estMonths: 96,
    published: true,
    stages: [{ id: 'ps1', order: 1, title: 'Psychology Education', description: 'Academic study and supervised practice', skills: [{ name: 'Clinical Assessment', summary: 'Diagnosis and treatment planning' }], tasks: [{ id: 't-ps-1', title: 'Complete supervised practicum', type: 'BUILD', minutes: 2000 }] }],
    resources: [{ id: 'r-ps-1', title: 'APA Resources', kind: 'guide', url: 'https://www.apa.org' }, { id: 'r-ps-2', title: 'Psychology Courses', kind: 'course', url: 'https://www.coursera.org/search?query=psychology' }]
  },
  {
    slug: 'accountant',
    title: 'Accountant',
    summary: 'Manage financial records, reporting, and compliance for organizations.',
    domain: 'Finance',
    difficulty: 'Intermediate',
    estMonths: 36,
    published: true,
    stages: [{ id: 'ac1', order: 1, title: 'Accounting Basics', description: 'Bookkeeping, financial statements, taxes', skills: [{ name: 'Accounting', summary: 'Financial reporting' }], tasks: [{ id: 't-ac-1', title: 'Learn bookkeeping fundamentals', type: 'READ', minutes: 200 }] }],
    resources: [{ id: 'r-ac-1', title: 'Accounting Principles', kind: 'course', url: 'https://www.accountingcoach.com' }]
  },
  {
    slug: 'marketing-manager',
    title: 'Marketing Manager',
    summary: 'Plan and execute marketing strategies to grow products and brands.',
    domain: 'Marketing',
    difficulty: 'Intermediate',
    estMonths: 12,
    published: true,
    stages: [{ id: 'mm1', order: 1, title: 'Marketing Fundamentals', description: 'Marketing channels, analytics, and strategy', skills: [{ name: 'Analytics', summary: 'Measure campaign performance' }], tasks: [{ id: 't-mm-1', title: 'Run a small campaign', type: 'BUILD', minutes: 300 }] }],
    resources: [{ id: 'r-mm-1', title: 'Google Analytics Academy', kind: 'course', url: 'https://analytics.google.com' }]
  },
  // Additional Technology roles
  {
    slug: 'cloud-architect',
    title: 'Cloud Architect',
    summary: 'Design and manage cloud infrastructure for scalable, secure systems.',
    domain: 'Technology',
    difficulty: 'Advanced',
    estMonths: 10,
    published: true,
    stages: [{ id: 'ca1', order: 1, title: 'Cloud Fundamentals', description: 'AWS/Azure/GCP basics and architecture patterns', skills: [{ name: 'Cloud Design', summary: 'Scalability and security' }], tasks: [{ id: 't-ca-1', title: 'Complete cloud certification', type: 'READ', minutes: 300 }] }],
    resources: [
      { id: 'r-ca-1', title: 'AWS Architecture Guide', kind: 'guide', url: 'https://aws.amazon.com' },
      { id: 'r-ca-2', title: 'Cloud Architecture Basics', kind: 'video', url: 'https://www.youtube.com' }
    ]
  },
  {
    slug: 'security-engineer',
    title: 'Security Engineer',
    summary: 'Protect systems and networks from cyber threats and vulnerabilities.',
    domain: 'Technology',
    difficulty: 'Advanced',
    estMonths: 8,
    published: true,
    stages: [{ id: 'se1', order: 1, title: 'Security Basics', description: 'Cryptography, networking, vulnerability assessment', skills: [{ name: 'Security', summary: 'Threat models and defense' }], tasks: [{ id: 't-se-1', title: 'Learn penetration testing', type: 'BUILD', minutes: 400 }] }],
    resources: [{ id: 'r-se-1', title: 'OWASP Guides', kind: 'guide', url: 'https://owasp.org' }, { id: 'r-se-2', title: 'Cybersecurity Tutorials', kind: 'video', url: 'https://www.youtube.com/results?search_query=cybersecurity' }]
  },
  {
    slug: 'mobile-developer',
    title: 'Mobile Developer',
    summary: 'Develop native or cross-platform applications for iOS and Android.',
    domain: 'Technology',
    difficulty: 'Intermediate',
    estMonths: 9,
    published: true,
    stages: [{ id: 'md1', order: 1, title: 'Mobile Basics', description: 'Swift, Kotlin, React Native fundamentals', skills: [{ name: 'Mobile Dev', summary: 'UI and native APIs' }], tasks: [{ id: 't-md-1', title: 'Build 3 mobile apps', type: 'BUILD', minutes: 600 }] }],
    resources: [
      { id: 'r-md-1', title: 'Android Dev Guide', kind: 'guide', url: 'https://developer.android.com' },
      { id: 'r-md-2', title: 'Mobile App Development Tutorial', kind: 'video', url: 'https://www.youtube.com' }
    ]
  },
  {
    slug: 'game-developer',
    title: 'Game Developer',
    summary: 'Create engaging games using game engines and interactive design.',
    domain: 'Technology',
    difficulty: 'Advanced',
    estMonths: 12,
    published: true,
    stages: [{ id: 'gd1', order: 1, title: 'Game Engine Fundamentals', description: 'Unity or Unreal basics and game design', skills: [{ name: 'Game Design', summary: 'Gameplay mechanics' }], tasks: [{ id: 't-gd-1', title: 'Release a simple game', type: 'BUILD', minutes: 500 }] }],
    resources: [
      { id: 'r-gd-1', title: 'Unity Learn', kind: 'course', url: 'https://learn.unity.com' },
      { id: 'r-gd-2', title: 'Game Development Tutorials', kind: 'video', url: 'https://www.youtube.com' }
    ]
  },
  {
    slug: 'database-admin',
    title: 'Database Administrator',
    summary: 'Manage, secure, and optimize databases for performance and reliability.',
    domain: 'Technology',
    difficulty: 'Intermediate',
    estMonths: 7,
    published: true,
    stages: [{ id: 'dba1', order: 1, title: 'Database Fundamentals', description: 'SQL, indexing, backups, replication', skills: [{ name: 'DBA', summary: 'Performance tuning' }], tasks: [{ id: 't-dba-1', title: 'Set up replicated database', type: 'BUILD', minutes: 300 }] }],
    resources: [{ id: 'r-dba-1', title: 'PostgreSQL Docs', kind: 'guide', url: 'https://www.postgresql.org' }, { id: 'r-dba-2', title: 'Database Admin Tutorials', kind: 'video', url: 'https://www.youtube.com/results?search_query=database+administration' }]
  },
  {
    slug: 'systems-admin',
    title: 'Systems Administrator',
    summary: 'Manage servers, networks, and IT infrastructure for organizations.',
    domain: 'Technology',
    difficulty: 'Intermediate',
    estMonths: 8,
    published: true,
    stages: [{ id: 'sa1', order: 1, title: 'System Administration Basics', description: 'Linux, Windows, networking, security', skills: [{ name: 'Systems', summary: 'Administration and monitoring' }], tasks: [{ id: 't-sa-1', title: 'Set up Linux server', type: 'BUILD', minutes: 250 }] }],
    resources: [{ id: 'r-sa-1', title: 'Linux Academy', kind: 'course', url: 'https://www.linuxacademy.com' }]
  },
  {
    slug: 'network-engineer',
    title: 'Network Engineer',
    summary: 'Design and manage computer networks for secure communication.',
    domain: 'Technology',
    difficulty: 'Intermediate',
    estMonths: 9,
    published: true,
    stages: [{ id: 'ne1', order: 1, title: 'Networking Basics', description: 'TCP/IP, routing, switching, firewalls', skills: [{ name: 'Networking', summary: 'Design and optimization' }], tasks: [{ id: 't-ne-1', title: 'Design network topology', type: 'BUILD', minutes: 200 }] }],
    resources: [{ id: 'r-ne-1', title: 'Cisco Learning Network', kind: 'course', url: 'https://learningnetwork.cisco.com' }]
  },
  // Healthcare roles
  {
    slug: 'dentist',
    title: 'Dentist',
    summary: 'Diagnose and treat teeth and gum diseases, provide oral care.',
    domain: 'Healthcare',
    difficulty: 'Advanced',
    estMonths: 84,
    published: true,
    stages: [{ id: 'de1', order: 1, title: 'Dental Education', description: 'Dental school and clinical practice', skills: [{ name: 'Dentistry', summary: 'Oral care and procedures' }], tasks: [{ id: 't-de-1', title: 'Complete dental school (4 years)', type: 'READ', minutes: 3000 }] }],
    resources: [{ id: 'r-de-1', title: 'Dental School Guide', kind: 'guide', url: 'https://www.ada.org' }, { id: 'r-de-2', title: 'Dental Procedures Videos', kind: 'video', url: 'https://www.youtube.com/results?search_query=dental+procedures' }]
  },
  {
    slug: 'therapist',
    title: 'Therapist',
    summary: 'Provide counseling and mental health treatment through therapy.',
    domain: 'Healthcare',
    difficulty: 'Advanced',
    estMonths: 72,
    published: true,
    stages: [{ id: 'th1', order: 1, title: 'Therapy Education', description: 'Psychology degree and clinical training', skills: [{ name: 'Therapy', summary: 'Counseling techniques' }], tasks: [{ id: 't-th-1', title: 'Complete degree and licensing', type: 'READ', minutes: 2000 }] }],
    resources: [{ id: 'r-th-1', title: 'Therapy Resources', kind: 'guide', url: 'https://www.apa.org' }, { id: 'r-th-2', title: 'Therapeutic Techniques', kind: 'course', url: 'https://www.coursera.org/search?query=therapy' }]
  },
  {
    slug: 'vet',
    title: 'Veterinarian',
    summary: 'Diagnose and treat animals, provide veterinary medical care.',
    domain: 'Healthcare',
    difficulty: 'Advanced',
    estMonths: 84,
    published: true,
    stages: [{ id: 've1', order: 1, title: 'Veterinary Medicine', description: 'Vet school and clinical experience', skills: [{ name: 'Veterinary Medicine', summary: 'Animal care and diagnostics' }], tasks: [{ id: 't-ve-1', title: 'Complete vet school (4 years)', type: 'READ', minutes: 3000 }] }],
    resources: [{ id: 'r-ve-1', title: 'Vet School Guide', kind: 'guide', url: 'https://www.avma.org' }, { id: 'r-ve-2', title: 'Veterinary Medicine Videos', kind: 'video', url: 'https://www.youtube.com/results?search_query=veterinary+medicine' }]
  },
  {
    slug: 'radiologist',
    title: 'Radiologist',
    summary: 'Interpret medical imaging and specialize in diagnostic radiology.',
    domain: 'Healthcare',
    difficulty: 'Advanced',
    estMonths: 108,
    published: true,
    stages: [{ id: 'ra1', order: 1, title: 'Radiology Specialization', description: 'Medical school + radiology residency', skills: [{ name: 'Radiology', summary: 'Imaging interpretation' }], tasks: [{ id: 't-ra-1', title: 'Complete residency (5 years)', type: 'BUILD', minutes: 2000 }] }],
    resources: [{ id: 'r-ra-1', title: 'Radiology Society Resources', kind: 'guide', url: 'https://www.arrs.org' }, { id: 'r-ra-2', title: 'Radiology Imaging Tutorials', kind: 'video', url: 'https://www.youtube.com/results?search_query=medical+imaging+radiology' }]
  },
  {
    slug: 'surgeon',
    title: 'Surgeon',
    summary: 'Perform surgical procedures and specialize in surgical medicine.',
    domain: 'Healthcare',
    difficulty: 'Advanced',
    estMonths: 120,
    published: true,
    stages: [{ id: 'su1', order: 1, title: 'Surgery Specialization', description: 'Medical school + surgical residency', skills: [{ name: 'Surgery', summary: 'Surgical techniques' }], tasks: [{ id: 't-su-1', title: 'Complete residency (5-7 years)', type: 'BUILD', minutes: 2000 }] }],
    resources: [{ id: 'r-su-1', title: 'Surgical Training Guide', kind: 'guide', url: 'https://www.sages.org' }, { id: 'r-su-2', title: 'Surgical Procedure Videos', kind: 'video', url: 'https://www.youtube.com/results?search_query=surgical+procedures' }]
  },
  {
    slug: 'medical-tech',
    title: 'Medical Technician',
    summary: 'Operate medical equipment and assist in diagnostic and therapeutic procedures.',
    domain: 'Healthcare',
    difficulty: 'Intermediate',
    estMonths: 12,
    published: true,
    stages: [{ id: 'mt1', order: 1, title: 'Medical Tech Training', description: 'Certification program and hands-on training', skills: [{ name: 'Medical Equipment', summary: 'Operation and maintenance' }], tasks: [{ id: 't-mt-1', title: 'Get medical tech certification', type: 'READ', minutes: 300 }] }],
    resources: [{ id: 'r-mt-1', title: 'ASMT Certification', kind: 'course', url: 'https://www.asmt.org' }]
  },
  // Finance roles
  {
    slug: 'financial-analyst',
    title: 'Financial Analyst',
    summary: 'Analyze financial data and trends to guide investment decisions.',
    domain: 'Finance',
    difficulty: 'Intermediate',
    estMonths: 6,
    published: true,
    stages: [{ id: 'fa1', order: 1, title: 'Financial Analysis Fundamentals', description: 'Valuation, modeling, Excel, financial statements', skills: [{ name: 'Analysis', summary: 'Financial modeling' }], tasks: [{ id: 't-fa-1', title: 'Build financial models', type: 'BUILD', minutes: 300 }] }],
    resources: [{ id: 'r-fa-1', title: 'Financial Modeling Guide', kind: 'course', url: 'https://www.investopedia.com' }]
  },
  {
    slug: 'investment-banker',
    title: 'Investment Banker',
    summary: 'Advise on mergers, acquisitions, and corporate finance strategies.',
    domain: 'Finance',
    difficulty: 'Advanced',
    estMonths: 8,
    published: true,
    stages: [{ id: 'ib1', order: 1, title: 'Investment Banking Basics', description: 'M&A, valuations, pitch books', skills: [{ name: 'Banking', summary: 'Corporate finance deals' }], tasks: [{ id: 't-ib-1', title: 'Prepare pitch book', type: 'BUILD', minutes: 400 }] }],
    resources: [{ id: 'r-ib-1', title: 'Investment Banking Guide', kind: 'guide', url: 'https://www.smbcnimd.com' }, { id: 'r-ib-2', title: 'Investment Banking Courses', kind: 'course', url: 'https://www.coursera.org/search?query=investment+banking' }]
  },
  {
    slug: 'trader',
    title: 'Trader',
    summary: 'Trade stocks, bonds, forex, and derivatives to generate returns.',
    domain: 'Finance',
    difficulty: 'Advanced',
    estMonths: 12,
    published: true,
    stages: [{ id: 'tr1', order: 1, title: 'Trading Fundamentals', description: 'Market structure, technical analysis, risk management', skills: [{ name: 'Trading', summary: 'Market analysis and risk' }], tasks: [{ id: 't-tr-1', title: 'Execute 50+ live trades', type: 'BUILD', minutes: 500 }] }],
    resources: [{ id: 'r-tr-1', title: 'Trading Academy', kind: 'course', url: 'https://www.investopedia.com' }]
  },
  {
    slug: 'auditor',
    title: 'Auditor',
    summary: 'Review financial records and operations to ensure compliance and accuracy.',
    domain: 'Finance',
    difficulty: 'Intermediate',
    estMonths: 24,
    published: true,
    stages: [{ id: 'au1', order: 1, title: 'Audit Fundamentals', description: 'Audit procedures, standards, compliance', skills: [{ name: 'Auditing', summary: 'Financial review' }], tasks: [{ id: 't-au-1', title: 'Complete audit certification', type: 'READ', minutes: 400 }] }],
    resources: [{ id: 'r-au-1', title: 'AICPA Resources', kind: 'guide', url: 'https://www.aicpa.org' }, { id: 'r-au-2', title: 'Auditing Courses', kind: 'course', url: 'https://www.coursera.org/search?query=auditing' }]
  },
  // Legal roles
  {
    slug: 'paralegal',
    title: 'Paralegal',
    summary: 'Assist lawyers with legal documentation, research, and client support.',
    domain: 'Legal',
    difficulty: 'Intermediate',
    estMonths: 6,
    published: true,
    stages: [{ id: 'pl1', order: 1, title: 'Paralegal Training', description: 'Legal research, document drafting, court procedures', skills: [{ name: 'Legal Support', summary: 'Paralegal duties' }], tasks: [{ id: 't-pl-1', title: 'Get paralegal certification', type: 'READ', minutes: 200 }] }],
    resources: [{ id: 'r-pl-1', title: 'Paralegal Certification', kind: 'course', url: 'https://www.nala.org' }]
  },
  {
    slug: 'judge',
    title: 'Judge',
    summary: 'Preside over legal cases and render judicial decisions.',
    domain: 'Legal',
    difficulty: 'Advanced',
    estMonths: 180,
    published: true,
    stages: [{ id: 'jg1', order: 1, title: 'Judicial Career Path', description: 'Law degree, bar, practice, appointment', skills: [{ name: 'Judicial', summary: 'Legal decision-making' }], tasks: [{ id: 't-jg-1', title: 'Establish legal practice (10+ years)', type: 'BUILD', minutes: null }] }],
    resources: [{ id: 'r-jg-1', title: 'Judicial Career Guide', kind: 'guide', url: 'https://www.ajs.org' }]
  },
  {
    slug: 'legal-counsel',
    title: 'Legal Counsel',
    summary: 'Provide legal advice and counsel to organizations and corporations.',
    domain: 'Legal',
    difficulty: 'Advanced',
    estMonths: 84,
    published: true,
    stages: [{ id: 'lc1', order: 1, title: 'Corporate Law', description: 'Law degree, bar exam, practice', skills: [{ name: 'Corporate Law', summary: 'Legal advisory' }], tasks: [{ id: 't-lc-1', title: 'Pass bar exam', type: 'QUIZ', minutes: 600 }] }],
    resources: [{ id: 'r-lc-1', title: 'Corporate Law Guide', kind: 'guide', url: 'https://www.americanbar.org' }]
  },
  // Marketing roles
  {
    slug: 'brand-strategist',
    title: 'Brand Strategist',
    summary: 'Develop brand identity and marketing strategies for market positioning.',
    domain: 'Marketing',
    difficulty: 'Intermediate',
    estMonths: 8,
    published: true,
    stages: [{ id: 'bs1', order: 1, title: 'Brand Strategy', description: 'Brand positioning, identity, messaging', skills: [{ name: 'Branding', summary: 'Strategic brand building' }], tasks: [{ id: 't-bs-1', title: 'Develop brand guidelines', type: 'BUILD', minutes: 250 }] }],
    resources: [{ id: 'r-bs-1', title: 'Brand Strategy Course', kind: 'course', url: 'https://www.amanet.org' }]
  },
  {
    slug: 'seo-specialist',
    title: 'SEO Specialist',
    summary: 'Optimize websites and content for search engine visibility and ranking.',
    domain: 'Marketing',
    difficulty: 'Intermediate',
    estMonths: 4,
    published: true,
    stages: [{ id: 'seo1', order: 1, title: 'SEO Fundamentals', description: 'On-page, off-page, technical SEO', skills: [{ name: 'SEO', summary: 'Search optimization' }], tasks: [{ id: 't-seo-1', title: 'Optimize 5 websites', type: 'BUILD', minutes: 200 }] }],
    resources: [
      { id: 'r-seo-1', title: 'Moz SEO Guide', kind: 'guide', url: 'https://moz.com' },
      { id: 'r-seo-2', title: 'SEO Fundamentals Video', kind: 'video', url: 'https://www.youtube.com' }
    ]
  },
  {
    slug: 'content-creator',
    title: 'Content Creator',
    summary: 'Produce engaging content across multiple platforms for audience growth.',
    domain: 'Marketing',
    difficulty: 'Beginner',
    estMonths: 3,
    published: true,
    stages: [{ id: 'cc1', order: 1, title: 'Content Creation Basics', description: 'Writing, video, social media', skills: [{ name: 'Content', summary: 'Multimedia creation' }], tasks: [{ id: 't-cc-1', title: 'Publish 30 pieces of content', type: 'BUILD', minutes: 300 }] }],
    resources: [{ id: 'r-cc-1', title: 'Content Creator Toolkit', kind: 'guide', url: 'https://www.hootsuite.com' }, { id: 'r-cc-2', title: 'Content Creation Tutorials', kind: 'video', url: 'https://www.youtube.com/results?search_query=content+creation' }]
  },
  {
    slug: 'email-marketer',
    title: 'Email Marketer',
    summary: 'Design and execute email marketing campaigns for customer engagement.',
    domain: 'Marketing',
    difficulty: 'Beginner',
    estMonths: 3,
    published: true,
    stages: [{ id: 'em1', order: 1, title: 'Email Marketing', description: 'Campaign design, automation, analytics', skills: [{ name: 'Email', summary: 'Marketing automation' }], tasks: [{ id: 't-em-1', title: 'Create 10 campaigns', type: 'BUILD', minutes: 150 }] }],
    resources: [{ id: 'r-em-1', title: 'Email Marketing Guide', kind: 'course', url: 'https://www.mailchimp.com' }, { id: 'r-em-2', title: 'Email Marketing Videos', kind: 'video', url: 'https://www.youtube.com/results?search_query=email+marketing' }]
  },
  // Design roles
  {
    slug: 'graphic-designer',
    title: 'Graphic Designer',
    summary: 'Create visual content and designs for print, web, and marketing.',
    domain: 'Design',
    difficulty: 'Intermediate',
    estMonths: 6,
    published: true,
    stages: [{ id: 'gd1', order: 1, title: 'Design Tools & Principles', description: 'Adobe Suite, design theory, color theory', skills: [{ name: 'Graphic Design', summary: 'Visual communication' }], tasks: [{ id: 't-gd-1', title: 'Create 20 design pieces', type: 'BUILD', minutes: 400 }] }],
    resources: [
      { id: 'r-gd-1', title: 'Adobe Creative Cloud', kind: 'course', url: 'https://www.adobe.com' },
      { id: 'r-gd-2', title: 'Design Theory Fundamentals', kind: 'video', url: 'https://www.youtube.com' }
    ]
  },
  {
    slug: 'motion-graphics',
    title: 'Motion Graphics Designer',
    summary: 'Create animated graphics and visual effects for video and web.',
    domain: 'Design',
    difficulty: 'Advanced',
    estMonths: 9,
    published: true,
    stages: [{ id: 'mg1', order: 1, title: 'Motion Design Fundamentals', description: 'After Effects, 3D, animation principles', skills: [{ name: 'Motion Graphics', summary: 'Animation and effects' }], tasks: [{ id: 't-mg-1', title: 'Create 10 animations', type: 'BUILD', minutes: 500 }] }],
    resources: [
      { id: 'r-mg-1', title: 'After Effects Tutorials', kind: 'video', url: 'https://www.adobe.com' },
      { id: 'r-mg-2', title: 'Motion Design Guide', kind: 'guide', url: 'https://www.adobe.com' }
    ]
  },
  {
    slug: 'industrial-designer',
    title: 'Industrial Designer',
    summary: 'Design products and consumer goods for functionality and aesthetics.',
    domain: 'Design',
    difficulty: 'Advanced',
    estMonths: 48,
    published: true,
    stages: [{ id: 'id1', order: 1, title: 'Industrial Design', description: 'CAD, prototyping, design thinking', skills: [{ name: 'Product Design', summary: 'Mechanical design' }], tasks: [{ id: 't-id-1', title: 'Complete design degree (4 years)', type: 'READ', minutes: 2000 }] }],
    resources: [{ id: 'r-id-1', title: 'IDSA Resources', kind: 'guide', url: 'https://www.idsa.org' }, { id: 'r-id-2', title: 'Industrial Design CAD', kind: 'course', url: 'https://www.autodesk.com' }]
  },
  // Business/Management roles
  {
    slug: 'consultant',
    title: 'Business Consultant',
    summary: 'Advise organizations on strategy, operations, and business improvements.',
    domain: 'Business',
    difficulty: 'Intermediate',
    estMonths: 8,
    published: true,
    stages: [{ id: 'bc1', order: 1, title: 'Consulting Fundamentals', description: 'Case analysis, frameworks, presentations', skills: [{ name: 'Consulting', summary: 'Business analysis' }], tasks: [{ id: 't-bc-1', title: 'Solve 20 consulting cases', type: 'BUILD', minutes: 400 }] }],
    resources: [{ id: 'r-bc-1', title: 'Case Interview Guide', kind: 'course', url: 'https://www.mckinsey.com' }]
  },
  {
    slug: 'project-manager',
    title: 'Project Manager',
    summary: 'Lead projects, manage timelines, budgets, and cross-functional teams.',
    domain: 'Business',
    difficulty: 'Intermediate',
    estMonths: 6,
    published: true,
    stages: [{ id: 'pm1', order: 1, title: 'Project Management Basics', description: 'Agile, Waterfall, leadership, tools', skills: [{ name: 'Project Management', summary: 'Leadership and planning' }], tasks: [{ id: 't-pm-1', title: 'Get PMP certification', type: 'READ', minutes: 300 }] }],
    resources: [{ id: 'r-pm-1', title: 'PMI Resources', kind: 'course', url: 'https://www.pmi.org' }, { id: 'r-pm-2', title: 'Project Management Videos', kind: 'video', url: 'https://www.youtube.com/results?search_query=project+management' }]
  },
  {
    slug: 'operations-manager',
    title: 'Operations Manager',
    summary: 'Oversee daily operations and optimize processes for efficiency.',
    domain: 'Business',
    difficulty: 'Intermediate',
    estMonths: 6,
    published: true,
    stages: [{ id: 'om1', order: 1, title: 'Operations Management', description: 'Process optimization, lean, Six Sigma', skills: [{ name: 'Operations', summary: 'Process efficiency' }], tasks: [{ id: 't-om-1', title: 'Implement process improvement', type: 'BUILD', minutes: 250 }] }],
    resources: [{ id: 'r-om-1', title: 'Lean Six Sigma', kind: 'course', url: 'https://www.isoiec.org' }, { id: 'r-om-2', title: 'Operations Optimization', kind: 'video', url: 'https://www.youtube.com/results?search_query=process+optimization' }]
  },
  {
    slug: 'hr-manager',
    title: 'HR Manager',
    summary: 'Manage human resources, recruitment, training, and employee relations.',
    domain: 'Business',
    difficulty: 'Intermediate',
    estMonths: 6,
    published: true,
    stages: [{ id: 'hr1', order: 1, title: 'HR Management', description: 'Recruitment, compliance, employee development', skills: [{ name: 'HR', summary: 'People management' }], tasks: [{ id: 't-hr-1', title: 'Get SHRM certification', type: 'READ', minutes: 350 }] }],
    resources: [{ id: 'r-hr-1', title: 'SHRM Learning', kind: 'course', url: 'https://www.shrm.org' }, { id: 'r-hr-2', title: 'HR Management Videos', kind: 'video', url: 'https://www.youtube.com/results?search_query=hr+management' }]
  },
  // Education roles
  {
    slug: 'professor',
    title: 'Professor',
    summary: 'Teach and conduct research at university and higher education institutions.',
    domain: 'Education',
    difficulty: 'Advanced',
    estMonths: 96,
    published: true,
    stages: [{ id: 'prof1', order: 1, title: 'Academic Path', description: 'PhD, postdoc, tenure track', skills: [{ name: 'Academia', summary: 'Research and teaching' }], tasks: [{ id: 't-prof-1', title: 'Complete PhD program', type: 'READ', minutes: 3000 }] }],
    resources: [{ id: 'r-prof-1', title: 'Academic Career Guide', kind: 'guide', url: 'https://www.chronicle.com' }, { id: 'r-prof-2', title: 'Academic Teaching Videos', kind: 'video', url: 'https://www.youtube.com/results?search_query=academic+teaching' }]
  },
  {
    slug: 'curriculum-developer',
    title: 'Curriculum Developer',
    summary: 'Design educational programs and learning materials for institutions.',
    domain: 'Education',
    difficulty: 'Intermediate',
    estMonths: 6,
    published: true,
    stages: [{ id: 'cd1', order: 1, title: 'Curriculum Design', description: 'Learning theory, instructional design, assessment', skills: [{ name: 'Curriculum', summary: 'Program design' }], tasks: [{ id: 't-cd-1', title: 'Design 3 courses', type: 'BUILD', minutes: 300 }] }],
    resources: [{ id: 'r-cd-1', title: 'ADDIE Model', kind: 'guide', url: 'https://www.instructionaldesign.org' }, { id: 'r-cd-2', title: 'Curriculum Design Courses', kind: 'course', url: 'https://www.coursera.org/search?query=curriculum+development' }]
  },
  {
    slug: 'instructional-designer',
    title: 'Instructional Designer',
    summary: 'Create effective learning experiences and online training programs.',
    domain: 'Education',
    difficulty: 'Intermediate',
    estMonths: 6,
    published: true,
    stages: [{ id: 'id1', order: 1, title: 'Instructional Design Basics', description: 'Course design, e-learning, assessments', skills: [{ name: 'Instructional Design', summary: 'Learning experience' }], tasks: [{ id: 't-id-1', title: 'Create e-learning module', type: 'BUILD', minutes: 250 }] }],
    resources: [{ id: 'r-id-1', title: 'Instructional Design Handbook', kind: 'guide', url: 'https://www.id2.umd.edu' }, { id: 'r-id-2', title: 'ID Videos', kind: 'video', url: 'https://www.youtube.com/results?search_query=instructional+design' }]
  },
  // Public Service roles
  {
    slug: 'firefighter',
    title: 'Firefighter',
    summary: 'Respond to emergencies and protect lives and property from fire.',
    domain: 'Public Service',
    difficulty: 'Intermediate',
    estMonths: 6,
    published: true,
    stages: [{ id: 'ff1', order: 1, title: 'Firefighter Training', description: 'Academy training, certifications, fitness', skills: [{ name: 'Emergency Response', summary: 'Fire safety' }], tasks: [{ id: 't-ff-1', title: 'Complete fire academy', type: 'BUILD', minutes: 300 }] }],
    resources: [{ id: 'r-ff-1', title: 'NFPA Training', kind: 'course', url: 'https://www.nfpa.org' }, { id: 'r-ff-2', title: 'Firefighter Training Videos', kind: 'video', url: 'https://www.youtube.com/results?search_query=firefighter+training' }]
  },
  {
    slug: 'paramedic',
    title: 'Paramedic',
    summary: 'Provide emergency medical care and transport to hospital.',
    domain: 'Public Service',
    difficulty: 'Intermediate',
    estMonths: 12,
    published: true,
    stages: [{ id: 'pm1', order: 1, title: 'Paramedic Certification', description: 'EMT training, paramedic coursework', skills: [{ name: 'Emergency Medicine', summary: 'Trauma and critical care' }], tasks: [{ id: 't-pm-1', title: 'Get paramedic certification', type: 'READ', minutes: 400 }] }],
    resources: [{ id: 'r-pm-1', title: 'NAEMT Resources', kind: 'course', url: 'https://www.naemt.org' }, { id: 'r-pm-2', title: 'Paramedic Training Videos', kind: 'video', url: 'https://www.youtube.com/results?search_query=paramedic+training' }]
  },
  {
    slug: 'military-officer',
    title: 'Military Officer',
    summary: 'Lead military personnel and operations in defense of nation.',
    domain: 'Public Service',
    difficulty: 'Advanced',
    estMonths: 48,
    published: true,
    stages: [{ id: 'mo1', order: 1, title: 'Military Officer Training', description: 'Academy, OCS, or ROTC and service', skills: [{ name: 'Leadership', summary: 'Military command' }], tasks: [{ id: 't-mo-1', title: 'Complete officer program', type: 'BUILD', minutes: 2000 }] }],
    resources: [{ id: 'r-mo-1', title: 'Military Service Guide', kind: 'guide', url: 'https://www.militaryonesource.mil' }, { id: 'r-mo-2', title: 'Military Leadership Videos', kind: 'video', url: 'https://www.youtube.com/results?search_query=military+leadership' }]
  },
  // Manufacturing/Skilled Trades
  {
    slug: 'machinist',
    title: 'Machinist',
    summary: 'Operate machinery to produce precision metal parts and components.',
    domain: 'Manufacturing',
    difficulty: 'Intermediate',
    estMonths: 24,
    published: true,
    stages: [{ id: 'ma1', order: 1, title: 'Machining Apprenticeship', description: 'CNC machines, precision tools, blueprints', skills: [{ name: 'Machining', summary: 'CNC operation' }], tasks: [{ id: 't-ma-1', title: 'Complete apprenticeship', type: 'BUILD', minutes: 1500 }] }],
    resources: [{ id: 'r-ma-1', title: 'Machining Basics', kind: 'course', url: 'https://www.sme.org' }, { id: 'r-ma-2', title: 'CNC Machining Tutorials', kind: 'video', url: 'https://www.youtube.com/results?search_query=cnc+machining' }]
  },
  {
    slug: 'electrician',
    title: 'Electrician',
    summary: 'Install, maintain, and repair electrical systems in buildings.',
    domain: 'Manufacturing',
    difficulty: 'Intermediate',
    estMonths: 36,
    published: true,
    stages: [{ id: 'el1', order: 1, title: 'Electrical Apprenticeship', description: 'Electrical theory, wiring, safety codes', skills: [{ name: 'Electrical Systems', summary: 'Installation and maintenance' }], tasks: [{ id: 't-el-1', title: 'Complete 4-year apprenticeship', type: 'BUILD', minutes: 2000 }] }],
    resources: [{ id: 'r-el-1', title: 'IBEW Training', kind: 'course', url: 'https://www.ibew.org' }, { id: 'r-el-2', title: 'Electrical Work Tutorials', kind: 'video', url: 'https://www.youtube.com/results?search_query=electrical+wiring' }]
  },
  {
    slug: 'plumber',
    title: 'Plumber',
    summary: 'Install and repair plumbing systems in residential and commercial buildings.',
    domain: 'Manufacturing',
    difficulty: 'Intermediate',
    estMonths: 36,
    published: true,
    stages: [{ id: 'pl1', order: 1, title: 'Plumbing Apprenticeship', description: 'Pipe fitting, water systems, codes', skills: [{ name: 'Plumbing Systems', summary: 'Installation and repair' }], tasks: [{ id: 't-pl-1', title: 'Complete apprenticeship', type: 'BUILD', minutes: 1500 }] }],
    resources: [{ id: 'r-pl-1', title: 'Plumbing Training', kind: 'course', url: 'https://www.phccweb.org' }, { id: 'r-pl-2', title: 'Plumbing Tutorials', kind: 'video', url: 'https://www.youtube.com/results?search_query=plumbing' }]
  },
  {
    slug: 'hvac-technician',
    title: 'HVAC Technician',
    summary: 'Install and maintain heating, cooling, and ventilation systems.',
    domain: 'Manufacturing',
    difficulty: 'Intermediate',
    estMonths: 24,
    published: true,
    stages: [{ id: 'hv1', order: 1, title: 'HVAC Training', description: 'Cooling/heating systems, refrigerants, EPA', skills: [{ name: 'HVAC', summary: 'System maintenance' }], tasks: [{ id: 't-hv-1', title: 'Get EPA certification', type: 'READ', minutes: 200 }] }],
    resources: [{ id: 'r-hv-1', title: 'HVAC Education', kind: 'course', url: 'https://www.trane.com' }, { id: 'r-hv-2', title: 'HVAC Maintenance Videos', kind: 'video', url: 'https://www.youtube.com/results?search_query=hvac' }]
  },
  {
    slug: 'welder',
    title: 'Welder',
    summary: 'Join metal parts using welding techniques for fabrication and repair.',
    domain: 'Manufacturing',
    difficulty: 'Beginner',
    estMonths: 12,
    published: true,
    stages: [{ id: 'we1', order: 1, title: 'Welding Certification', description: 'Arc, MIG, TIG welding techniques', skills: [{ name: 'Welding', summary: 'Metal fabrication' }], tasks: [{ id: 't-we-1', title: 'Get welding certification', type: 'BUILD', minutes: 300 }] }],
    resources: [{ id: 'r-we-1', title: 'AWS Welding', kind: 'course', url: 'https://www.aws.org' }, { id: 'r-we-2', title: 'Welding Techniques Videos', kind: 'video', url: 'https://www.youtube.com/results?search_query=welding' }]
  }
);

// Make available globally
if (typeof window !== 'undefined') {
  window.ROLES_DATA = ROLES_DATA;
}

