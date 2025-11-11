# Pathways - Career Learning Platform

A Firebase-powered web application for exploring career roadmaps, tracking learning progress, and getting AI-powered guidance.

## Tech Stack

- **Frontend**: HTML, CSS (Tailwind via CDN), Vanilla JavaScript (ES Modules)
- **Backend**: Firebase (Auth, Firestore, Functions, Storage, Hosting)
- **AI**: Google Gemini API via Cloud Functions
- **Build**: Vite

## Features

- 🔐 Authentication (Email/Password & Google)
- 🗺️ Career roadmaps with stages, skills, and tasks
- ✅ Progress tracking with checkboxes
- 🤖 AI assistant powered by Gemini
- 🏆 Badges and streaks
- 👨‍💼 Admin CMS for content management
- 🌙 Dark mode support
- ♿ Accessibility (WCAG 2.1 AA)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication (Email/Password & Google)
3. Create Firestore database
4. Enable Cloud Functions
5. Copy your Firebase config to `js/firebase.js`

### 3. Configure Firebase

Update `js/firebase.js` with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  // ... rest of config
};
```

### 4. Set Gemini API Key

```bash
cd functions
firebase functions:config:set gemini.api_key="YOUR_GEMINI_API_KEY"
# Or use secrets:
firebase functions:secrets:set GEMINI_API_KEY
```

### 5. Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### 6. Deploy Functions

```bash
cd functions
npm install
firebase deploy --only functions
```

### 7. Seed Data (Optional)

1. Download service account key from Firebase Console
2. Save as `serviceAccountKey.json` in project root
3. Run: `node scripts/seed-data.js`

### 8. Development

```bash
npm run dev
```

### 9. Build & Deploy

```bash
npm run build
firebase deploy --only hosting
```

## Project Structure

```
pathways/
├── index.html          # Home page
├── roles.html          # All roles listing
├── role.html           # Role detail page
├── auth.html           # Sign in/up
├── dashboard.html      # User dashboard
├── ai.html             # AI assistant
├── admin.html          # Admin CMS
├── js/
│   ├── firebase.js     # Firebase initialization
│   ├── auth.js         # Authentication helpers
│   ├── roles.js        # Role data & rendering
│   ├── progress.js     # Progress tracking
│   └── ui.js           # UI utilities
├── css/
│   └── styles.css      # Custom styles
├── functions/
│   └── index.js        # Cloud Functions
├── scripts/
│   └── seed-data.js    # Data seeding script
└── firestore.rules     # Security rules
```

## Security Rules

- Public roles: Read-only if `published == true`
- Progress: User-owned (read/write own data only)
- Admin functions: Require ADMIN role
- Drafts: Mentors can create, admins approve

## API Functions

- `aiDispatch`: AI assistant (Q&A, plan generator, etc.)
- `adminCreateRole`: Create new role (ADMIN only)
- `adminUpsertStage`: Create/update stage (ADMIN only)
- `adminUpsertTask`: Create/update task (ADMIN only)
- `mentorProposeDraft`: Submit draft for review (MENTOR/ADMIN)

## Roles

- **STUDENT**: Default role, can track progress
- **MENTOR**: Can submit drafts for review
- **ADMIN**: Full access to CMS and content management

## License

MIT - See LICENSE file

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
