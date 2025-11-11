// Notification broadcast system

import { auth, db } from "./firebase.js";
import { collection, addDoc, query, where, getDocs, orderBy, limit, onSnapshot, serverTimestamp, doc, getDoc, setDoc } from "firebase/firestore";
import { showToast } from "./ui.js";

// Create a notification broadcast (admin only)
export async function createNotification(title, message, type = 'info', targetRole = null) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in");
  
  // Check if user is admin (in production, use custom claims)
  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (userDoc.data()?.role !== "ADMIN") {
    throw new Error("Admin only");
  }
  
  await addDoc(collection(db, "notifications"), {
    title,
    message,
    type, // 'info', 'success', 'warning', 'announcement'
    targetRole, // null = all users, or specific role slug
    createdAt: serverTimestamp(),
    createdBy: user.uid
  });
  
  return { success: true };
}

// Get notifications for current user
export async function getUserNotifications(limitCount = 10) {
  const user = auth.currentUser;
  if (!user) return [];
  
  // Get user role
  const userDoc = await getDoc(doc(db, "users", user.uid));
  const userRole = userDoc.data()?.role || "STUDENT";
  
  // Get role-specific notifications or general ones
  const q = query(
    collection(db, "notifications"),
    where("targetRole", "in", [null, userRole]),
    orderBy("createdAt", "desc"),
    limit(limitCount)
  );
  
  const snapshot = await getDocs(q);
  const notifications = [];
  snapshot.forEach((doc) => {
    notifications.push({ id: doc.id, ...doc.data() });
  });
  
  return notifications;
}

// Watch for new notifications
export function watchNotifications(callback) {
  const user = auth.currentUser;
  if (!user) {
    callback([]);
    return () => {};
  }
  
  // Get user role
  getDoc(doc(db, "users", user.uid)).then(userDoc => {
    const userRole = userDoc.data()?.role || "STUDENT";
    
    const q = query(
      collection(db, "notifications"),
      where("targetRole", "in", [null, userRole]),
      orderBy("createdAt", "desc"),
      limit(5)
    );
    
    return onSnapshot(q, (snapshot) => {
      const notifications = [];
      snapshot.forEach((doc) => {
        notifications.push({ id: doc.id, ...doc.data() });
      });
      callback(notifications);
    });
  });
  
  return () => {}; // Return unsubscribe function
}

// Mark notification as read
export async function markNotificationRead(notificationId) {
  const user = auth.currentUser;
  if (!user) return;
  
  await setDoc(doc(db, "notificationReads", `${user.uid}_${notificationId}`), {
    uid: user.uid,
    notificationId,
    readAt: serverTimestamp()
  });
}

