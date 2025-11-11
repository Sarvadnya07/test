import { db } from "./firebase.js";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { getAllUserProgress } from "./progress.js";

// Get personalized role recommendations based on user progress
export async function getRecommendedRoles() {
  const userProgress = await getAllUserProgress();
  
  if (userProgress.length === 0) {
    // New user: recommend popular/easy roles
    return getPopularRoles();
  }
  
  // Analyze user interests
  const roleInterests = {};
  userProgress.forEach(p => {
    if (p.completed && p.roleSlug) {
      roleInterests[p.roleSlug] = (roleInterests[p.roleSlug] || 0) + 1;
    }
  });
  
  // Get domains user is interested in
  const completedRoles = await Promise.all(
    Object.keys(roleInterests).map(async (slug) => {
      const { doc, getDoc } = await import('firebase/firestore');
      const roleDoc = await getDoc(doc(db, 'roles', slug));
      return roleDoc.exists() ? roleDoc.data() : null;
    })
  );
  
  const domains = [...new Set(completedRoles.filter(r => r).map(r => r.domain))];
  
  // Find similar roles in same domains
  const allRoles = await getAllRoles();
  const recommendations = allRoles
    .filter(role => {
      // Don't recommend roles user is already doing
      if (roleInterests[role.slug]) return false;
      
      // Prioritize same domain
      if (domains.length > 0 && domains.includes(role.domain)) return true;
      
      // Include beginner-friendly roles for new users
      if (userProgress.length < 5 && role.difficulty === 'Beginner') return true;
      
      return false;
    })
    .sort((a, b) => {
      // Sort by domain match, then difficulty
      const aDomainMatch = domains.includes(a.domain) ? 1 : 0;
      const bDomainMatch = domains.includes(b.domain) ? 1 : 0;
      if (aDomainMatch !== bDomainMatch) return bDomainMatch - aDomainMatch;
      
      const difficultyOrder = { 'Beginner': 0, 'Intermediate': 1, 'Advanced': 2 };
      return (difficultyOrder[a.difficulty] || 1) - (difficultyOrder[b.difficulty] || 1);
    })
    .slice(0, 6);
  
  return recommendations;
}

// Get popular roles (for new users)
async function getPopularRoles() {
  try {
    const rolesRef = collection(db, "roles");
    const q = query(
      rolesRef,
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(6)
    );
    const snapshot = await getDocs(q);
    
    const roles = [];
    snapshot.forEach((doc) => {
      roles.push({ id: doc.id, slug: doc.id, ...doc.data() });
    });
    
    // If no createdAt ordering, get all and sort by difficulty
    if (roles.length === 0) {
      const allRoles = await getAllRoles();
      return allRoles
        .filter(r => r.difficulty === 'Beginner' || r.difficulty === 'Intermediate')
        .slice(0, 6);
    }
    
    return roles;
  } catch (error) {
    console.error("Error fetching popular roles:", error);
    return [];
  }
}

// Get all published roles
async function getAllRoles() {
  try {
    const rolesRef = collection(db, "roles");
    const q = query(rolesRef, where("published", "==", true));
    const snapshot = await getDocs(q);
    
    const roles = [];
    snapshot.forEach((doc) => {
      roles.push({ id: doc.id, slug: doc.id, ...doc.data() });
    });
    
    return roles;
  } catch (error) {
    console.error("Error fetching roles:", error);
    return [];
  }
}

