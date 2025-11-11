// Simple fallback forum stored in localStorage
const KEY = 'local_forum_questions';
function load(){ try{ return JSON.parse(localStorage.getItem(KEY) || '[]'); }catch(e){ return []; } }
function save(list){ localStorage.setItem(KEY, JSON.stringify(list)); }

export function getQuestions(){ return load().sort((a,b)=> b.createdAt - a.createdAt); }
export function postQuestion({ title, content, category, authorName }){
  const list = load();
  const q = { id: 'q_'+Date.now(), title, content, category, authorName: authorName||'Anonymous', upvotes:0, replyCount:0, createdAt: Date.now() };
  list.push(q); save(list); return q;
}
export function getQuestionById(id){ return load().find(q=>q.id===id) || null; }
export function postReply(questionId, { content, authorName }){
  const repliesKey = 'local_forum_replies';
  const replies = JSON.parse(localStorage.getItem(repliesKey) || '[]');
  const r = { id: 'r_'+Date.now(), questionId, content, authorName: authorName||'Anonymous', createdAt: Date.now() };
  replies.push(r); localStorage.setItem(repliesKey, JSON.stringify(replies));
  // increment reply count
  const qs = load(); const q = qs.find(x=>x.id===questionId); if(q){ q.replyCount = (q.replyCount||0)+1; save(qs); }
  return r;
}
export function getReplies(questionId){ const replies = JSON.parse(localStorage.getItem('local_forum_replies')||'[]'); return replies.filter(r=>r.questionId===questionId).sort((a,b)=> a.createdAt-b.createdAt); }

// seed sample data if empty
(function seed(){ if (load().length === 0){ save([
  { id:'q1', title:'How to start with Web Development?', content:'I am new and would like a clear step-by-step plan.', category:'career', authorName:'StudentA', upvotes:5, replyCount:2, createdAt: Date.now()-86400000 },
  { id:'q2', title:'Best resources for JavaScript', content:'Which books or courses helped you most?', category:'resources', authorName:'StudentB', upvotes:3, replyCount:1, createdAt: Date.now()-3600000 }
]); } })();
