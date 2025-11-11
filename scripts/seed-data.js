// Seed data script for Firestore
// Run with: node scripts/seed-data.js
// Make sure to set up Firebase Admin SDK credentials

const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json"); // Download from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const roles = [
  {
    slug: "doctor",
    title: "Doctor",
    summary: "Become a medical professional and help save lives",
    domain: "Healthcare",
    difficulty: "Advanced",
    estMonths: 120,
    published: true
  },
  {
    slug: "engineer",
    title: "Software Engineer",
    summary: "Build software and applications that power the world",
    domain: "Technology",
    difficulty: "Intermediate",
    estMonths: 24,
    published: true
  },
  {
    slug: "lawyer",
    title: "Lawyer",
    summary: "Pursue justice and advocate for clients in legal matters",
    domain: "Law",
    difficulty: "Advanced",
    estMonths: 84,
    published: true
  },
  {
    slug: "police",
    title: "Police Officer",
    summary: "Serve and protect your community",
    domain: "Public Service",
    difficulty: "Intermediate",
    estMonths: 12,
    published: true
  },
  {
    slug: "teacher",
    title: "Teacher",
    summary: "Educate and inspire the next generation",
    domain: "Education",
    difficulty: "Intermediate",
    estMonths: 48,
    published: true
  }
];

const stages = {
  doctor: [
    { id: "stage-1", title: "Pre-Medical Education", order: 1, description: "Complete undergraduate prerequisites" },
    { id: "stage-2", title: "Medical School", order: 2, description: "4 years of medical education" },
    { id: "stage-3", title: "Residency", order: 3, description: "3-7 years of specialized training" },
    { id: "stage-4", title: "Licensing & Certification", order: 4, description: "Pass board exams and obtain license" }
  ],
  engineer: [
    { id: "stage-1", title: "Learn Fundamentals", order: 1, description: "Programming basics and computer science" },
    { id: "stage-2", title: "Build Projects", order: 2, description: "Create portfolio projects" },
    { id: "stage-3", title: "Specialize", order: 3, description: "Choose a specialization (web, mobile, etc.)" },
    { id: "stage-4", title: "Get Hired", order: 4, description: "Prepare for interviews and land your first job" }
  ],
  lawyer: [
    { id: "stage-1", title: "Undergraduate Degree", order: 1, description: "Complete bachelor's degree" },
    { id: "stage-2", title: "LSAT Preparation", order: 2, description: "Prepare for law school admission test" },
    { id: "stage-3", title: "Law School", order: 3, description: "3 years of legal education" },
    { id: "stage-4", title: "Bar Exam", order: 4, description: "Pass state bar examination" }
  ],
  police: [
    { id: "stage-1", title: "Meet Requirements", order: 1, description: "Age, education, and fitness requirements" },
    { id: "stage-2", title: "Police Academy", order: 2, description: "Complete training academy" },
    { id: "stage-3", title: "Field Training", order: 3, description: "On-the-job training with experienced officers" },
    { id: "stage-4", title: "Certification", order: 4, description: "Obtain peace officer certification" }
  ],
  teacher: [
    { id: "stage-1", title: "Bachelor's Degree", order: 1, description: "Complete education degree" },
    { id: "stage-2", title: "Student Teaching", order: 2, description: "Complete supervised teaching practicum" },
    { id: "stage-3", title: "Certification", order: 3, description: "Pass teaching certification exams" },
    { id: "stage-4", title: "Job Search", order: 4, description: "Apply for teaching positions" }
  ]
};

const tasks = {
  "doctor-stage-1": [
    { id: "task-1", title: "Complete Biology courses", type: "READ", minutes: 120 },
    { id: "task-2", title: "Complete Chemistry courses", type: "READ", minutes: 120 },
    { id: "task-3", title: "Maintain high GPA (3.5+)", type: "REFLECT", minutes: 0 }
  ],
  "engineer-stage-1": [
    { id: "task-1", title: "Learn Python basics", type: "BUILD", minutes: 300, url: "https://www.python.org/about/gettingstarted/" },
    { id: "task-2", title: "Complete JavaScript tutorial", type: "WATCH", minutes: 180, url: "https://javascript.info" },
    { id: "task-3", title: "Build a calculator app", type: "BUILD", minutes: 240 }
  ]
};

async function seedData() {
  console.log("Starting seed...");
  
  for (const role of roles) {
    // Create role
    await db.doc(`roles/${role.slug}`).set({
      ...role,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`Created role: ${role.slug}`);
    
    // Create stages
    const roleStages = stages[role.slug] || [];
    for (const stage of roleStages) {
      await db.doc(`roles/${role.slug}/stages/${stage.id}`).set(stage);
      console.log(`  Created stage: ${stage.id}`);
      
      // Create tasks if they exist
      const stageTasks = tasks[`${role.slug}-${stage.id}`] || [];
      for (const task of stageTasks) {
        await db.doc(`roles/${role.slug}/stages/${stage.id}/tasks/${task.id}`).set(task);
        console.log(`    Created task: ${task.id}`);
      }
    }
  }
  
  // Create some badges
  await db.doc("badges/first-task").set({
    slug: "first-task",
    title: "First Step",
    rule: "Complete your first task"
  });
  
  await db.doc("badges/consistency").set({
    slug: "consistency",
    title: "Consistent Learner",
    rule: "Complete tasks for 7 consecutive days"
  });
  
  console.log("Seed complete!");
  process.exit(0);
}

seedData().catch(console.error);

