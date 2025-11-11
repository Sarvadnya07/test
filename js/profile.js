import { auth, db, storage } from "./firebase.js";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection, addDoc, getDocs, query, where, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { updateProfile } from "firebase/auth";

// Get user profile data
export async function getUserProfile(uid) {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (!userDoc.exists()) return null;
  return { id: userDoc.id, ...userDoc.data() };
}

// Update profile fields
export async function updateUserProfile({ name, bio, preferredField }) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in");
  
  const updates = {};
  if (name !== undefined) {
    updates.name = name;
    // Also update Firebase Auth displayName
    await updateProfile(user, { displayName: name });
  }
  if (bio !== undefined) updates.bio = bio;
  if (preferredField !== undefined) updates.preferredField = preferredField;
  updates.updatedAt = serverTimestamp();
  
  await updateDoc(doc(db, "users", user.uid), updates);
  return { success: true };
}

// Upload profile photo
export async function uploadProfilePhoto(file) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in");
  
  // Validate file
  if (!file.type.startsWith('image/')) {
    throw new Error("File must be an image");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image must be less than 5MB");
  }
  
  // Delete old photo if exists
  const oldPhotoRef = ref(storage, `users/${user.uid}/profile.jpg`);
  try {
    await deleteObject(oldPhotoRef);
  } catch (e) {
    // Ignore if doesn't exist
  }
  
  // Upload new photo
  const photoRef = ref(storage, `users/${user.uid}/profile.jpg`);
  await uploadBytes(photoRef, file);
  const photoURL = await getDownloadURL(photoRef);
  
  // Update user document and auth profile
  await updateProfile(user, { photoURL });
  await updateDoc(doc(db, "users", user.uid), {
    photoURL,
    updatedAt: serverTimestamp()
  });
  
  return { photoURL };
}

// Update notification preferences
export async function updateNotificationPreferences(preferences) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in");
  
  await updateDoc(doc(db, "users", user.uid), {
    notifications: preferences,
    updatedAt: serverTimestamp()
  });
  
  return { success: true };
}

// Add goal
export async function addGoal({ title, description, type, targetDate }) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in");
  
  const goal = {
    uid: user.uid,
    title,
    description: description || "",
    type: type || "short", // "short" or "long"
    targetDate: targetDate || null,
    completed: false,
    createdAt: serverTimestamp()
  };
  
  const docRef = await addDoc(collection(db, "goals"), goal);
  return { id: docRef.id, ...goal };
}

// Get user goals
export async function getUserGoals() {
  const user = auth.currentUser;
  if (!user) return [];
  
  const q = query(collection(db, "goals"), where("uid", "==", user.uid));
  const snapshot = await getDocs(q);
  const goals = [];
  snapshot.forEach((doc) => {
    goals.push({ id: doc.id, ...doc.data() });
  });
  
  return goals.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0);
  });
}

// Update goal
export async function updateGoal(goalId, updates) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in");
  
  const goalDoc = await getDoc(doc(db, "goals", goalId));
  if (!goalDoc.exists() || goalDoc.data().uid !== user.uid) {
    throw new Error("Goal not found or unauthorized");
  }
  
  await updateDoc(doc(db, "goals", goalId), {
    ...updates,
    updatedAt: serverTimestamp()
  });
  
  return { success: true };
}

// Delete goal
export async function deleteGoal(goalId) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in");
  
  const goalDoc = await getDoc(doc(db, "goals", goalId));
  if (!goalDoc.exists() || goalDoc.data().uid !== user.uid) {
    throw new Error("Goal not found or unauthorized");
  }
  
  await deleteDoc(doc(db, "goals", goalId));
  return { success: true };
}

// Export progress as CSV
export async function exportProgressCSV() {
  const { getAllUserProgress } = await import("./progress.js");
  const progress = await getAllUserProgress();
  
  // Get role names
  const { doc, getDoc } = await import("firebase/firestore");
  const roleMap = {};
  const uniqueRoles = [...new Set(progress.map(p => p.roleSlug))];
  for (const roleSlug of uniqueRoles) {
    const roleDoc = await getDoc(doc(db, "roles", roleSlug));
    roleMap[roleSlug] = roleDoc.exists() ? roleDoc.data().title : roleSlug;
  }
  
  // Build CSV
  const headers = ["Role", "Stage", "Task", "Completed", "Date"];
  const rows = progress.map(p => [
    roleMap[p.roleSlug] || p.roleSlug,
    p.stageId || "",
    p.taskId || "Stage",
    p.completed ? "Yes" : "No",
    p.updatedAt?.toDate ? p.updatedAt.toDate().toLocaleDateString() : ""
  ]);
  
  const csv = [
    headers.join(","),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
  ].join("\n");
  
  // Download
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `pathways-progress-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// Export progress as PDF (using jsPDF library)
export async function exportProgressPDF() {
  // Dynamically import jsPDF
  const { jsPDF } = await import("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
  const { getAllUserProgress } = await import("./progress.js");
  const progress = await getAllUserProgress();
  
  const doc = new jsPDF.jsPDF();
  const user = auth.currentUser;
  
  // Title
  doc.setFontSize(20);
  doc.text("Pathways Progress Report", 20, 20);
  doc.setFontSize(12);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30);
  if (user) {
    doc.text(`User: ${user.email}`, 20, 35);
  }
  
  // Get role names
  const { doc: firestoreDoc, getDoc } = await import("firebase/firestore");
  const roleMap = {};
  const uniqueRoles = [...new Set(progress.map(p => p.roleSlug))];
  for (const roleSlug of uniqueRoles) {
    const roleDoc = await getDoc(firestoreDoc(db, "roles", roleSlug));
    roleMap[roleSlug] = roleDoc.exists() ? roleDoc.data().title : roleSlug;
  }
  
  // Group by role
  const byRole = {};
  progress.forEach(p => {
    if (!byRole[p.roleSlug]) byRole[p.roleSlug] = [];
    byRole[p.roleSlug].push(p);
  });
  
  let yPos = 50;
  Object.entries(byRole).forEach(([roleSlug, roleProgress]) => {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(14);
    doc.text(roleMap[roleSlug] || roleSlug, 20, yPos);
    yPos += 10;
    
    const completed = roleProgress.filter(p => p.completed).length;
    const total = roleProgress.length;
    doc.setFontSize(10);
    doc.text(`Progress: ${completed}/${total} tasks completed`, 20, yPos);
    yPos += 15;
  });
  
  // Download
  doc.save(`pathways-progress-${new Date().toISOString().split('T')[0]}.pdf`);
}

