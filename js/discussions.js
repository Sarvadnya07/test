// Discussion board per role

import { auth, db } from "./firebase.js";
import { collection, addDoc, query, where, getDocs, orderBy, limit, onSnapshot, serverTimestamp, doc, getDoc, updateDoc, deleteDoc, increment, setDoc } from "firebase/firestore";

// Create a discussion post
export async function createPost(roleSlug, title, content) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in");
  
  const post = {
    roleSlug,
    title,
    content,
    authorId: user.uid,
    authorName: user.displayName || "Anonymous",
    authorPhoto: user.photoURL || null,
    createdAt: serverTimestamp(),
    replyCount: 0,
    upvotes: 0
  };
  
  const docRef = await addDoc(collection(db, "discussions"), post);
  return { id: docRef.id, ...post };
}

// Get posts for a role
export async function getRolePosts(roleSlug, limitCount = 20) {
  const q = query(
    collection(db, "discussions"),
    where("roleSlug", "==", roleSlug),
    orderBy("createdAt", "desc"),
    limit(limitCount)
  );
  
  const snapshot = await getDocs(q);
  const posts = [];
  snapshot.forEach((doc) => {
    posts.push({ id: doc.id, ...doc.data() });
  });
  
  return posts;
}

// Watch posts for a role (real-time)
export function watchRolePosts(roleSlug, callback) {
  const q = query(
    collection(db, "discussions"),
    where("roleSlug", "==", roleSlug),
    orderBy("createdAt", "desc"),
    limit(20)
  );
  
  return onSnapshot(q, (snapshot) => {
    const posts = [];
    snapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    callback(posts);
  });
}

// Create a reply to a post
export async function createReply(postId, content) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in");
  
  const reply = {
    postId,
    content,
    authorId: user.uid,
    authorName: user.displayName || "Anonymous",
    authorPhoto: user.photoURL || null,
    createdAt: serverTimestamp()
  };
  
  await addDoc(collection(db, "replies"), reply);
  
  // Update post reply count
  const postRef = doc(db, "discussions", postId);
  const postDoc = await getDoc(postRef);
  if (postDoc.exists()) {
    await updateDoc(postRef, {
      replyCount: (postDoc.data().replyCount || 0) + 1
    });
  }
  
  return { success: true };
}

// Get replies for a post
export async function getPostReplies(postId) {
  const q = query(
    collection(db, "replies"),
    where("postId", "==", postId),
    orderBy("createdAt", "asc")
  );
  
  const snapshot = await getDocs(q);
  const replies = [];
  snapshot.forEach((doc) => {
    replies.push({ id: doc.id, ...doc.data() });
  });
  
  return replies;
}

// Upvote a post
export async function upvotePost(postId) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in");
  
  const upvoteRef = doc(db, "postUpvotes", `${user.uid}_${postId}`);
  const upvoteDoc = await getDoc(upvoteRef);
  
  if (upvoteDoc.exists()) {
    // Remove upvote
    await deleteDoc(upvoteRef);
    await updateDoc(doc(db, "discussions", postId), {
      upvotes: increment(-1)
    });
    return { upvoted: false };
  } else {
    // Add upvote
    await setDoc(upvoteRef, {
      uid: user.uid,
      postId,
      createdAt: serverTimestamp()
    });
    await updateDoc(doc(db, "discussions", postId), {
      upvotes: increment(1)
    });
    return { upvoted: true };
  }
}

