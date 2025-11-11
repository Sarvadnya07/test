// Minimal dummy roles dataset used as a client-side fallback
export const ROLES = [
  {
    slug: 'web-development',
    title: 'Web Development',
    summary: 'Build modern websites and web applications using HTML, CSS, and JavaScript.',
    domain: 'Technology',
    difficulty: 'Intermediate',
    estMonths: 6,
    coverImage: '',
    published: true,
    stages: [
      { id: '1', order: 1, title: 'Foundations', description: 'HTML, CSS basics, accessibility', lessons: [{id:'l1', title:'HTML Basics', minutes:60}], projects:[{id:'p1', title:'Portfolio'}] },
      { id: '2', order: 2, title: 'JavaScript', description: 'Core JS, DOM, APIs', lessons: [{id:'l2', title:'JS Fundamentals', minutes:120}], projects:[{id:'p2', title:'Todo App'}] },
      { id: '3', order: 3, title: 'Frameworks', description: 'React/Vue basics, state, routing', lessons: [{id:'l3', title:'React Intro', minutes:180}], projects:[{id:'p3', title:'SPA Project'}] }
    ],
    resources: [
      { id: 'r1', title: 'MDN Web Docs', kind: 'Documentation', url: 'https://developer.mozilla.org' },
      { id: 'r2', title: 'freeCodeCamp', kind: 'Course', url: 'https://www.freecodecamp.org' }
    ]
  },
  {
    slug: 'data-science',
    title: 'Data Science',
    summary: 'Analyze data and build predictive models.',
    domain: 'Technology',
    difficulty: 'Advanced',
    estMonths: 9,
    published: true,
    stages: [
      { id: '1', order:1, title: 'Python & Math', description: 'Python, statistics, linear algebra', lessons:[], projects:[] },
      { id: '2', order:2, title: 'Data Analysis', description: 'Pandas, visualization', lessons:[], projects:[] }
    ],
    resources: [ { id:'r3', title:'Kaggle Learn', kind:'Course', url:'https://kaggle.com/learn' } ]
  }
];
