// Test data seeder — run in browser to populate localStorage with sample forum and AI QA data
(function(){
  function seedForum(force){
    const key = 'forum_qa';
    if (!force && localStorage.getItem(key)) return false;
    const now = new Date().toISOString();
    const questions = [
      {
        id: 'q_seed_1',
        title: 'How do I start learning web development?',
        content: 'I am new to programming. Which path should I follow to become a web developer?',
        category: 'roadmap',
        authorName: 'SeedUser',
        upvotes: 5,
        replies: [
          { id: 'r_seed_1', content: 'Start with HTML/CSS, then JS. Build small projects.', authorName: 'Helper', createdAt: now }
        ],
        createdAt: now
      },
      {
        id: 'q_seed_2',
        title: 'Best resources for Python for data science?',
        content: 'Looking for beginner-friendly courses and books for data science with Python.',
        category: 'resources',
        authorName: 'SeedUser2',
        upvotes: 3,
        replies: [],
        createdAt: now
      }
    ];
    localStorage.setItem(key, JSON.stringify(questions));
    return true;
  }

  function seedAI(force){
    const key = 'ai_mentor_qa';
    if (!force && localStorage.getItem(key)) return false;
    const now = new Date().toISOString();
    const qa = [
      { q: 'What skills for software engineer?', a: 'Learn programming fundamentals, data structures, algorithms, and web basics.', task: 'qna', time: now },
      { q: 'Generate a 6-week plan to learn web development', a: 'Week 1: HTML/CSS; Week 2: JavaScript basics; Week 3: DOM & APIs; Week 4: React; Week 5: Backend basics; Week 6: Projects & deploy.', task: 'plan', time: now }
    ];
    localStorage.setItem(key, JSON.stringify(qa));
    return true;
  }

  window.SeedTestData = { seedForum, seedAI };
})();
