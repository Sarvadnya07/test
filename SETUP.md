# Pathways Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
cd functions && npm install && cd ..
```

### 2. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable these services:
   - **Authentication**: Enable Email/Password and Google
   - **Firestore Database**: Start in production mode
   - **Storage**: Enable
   - **Functions**: Enable (Node.js 20)
   - **Hosting**: Enable

### 3. Get Firebase Config

1. In Firebase Console, go to Project Settings
2. Scroll to "Your apps" section
3. Click the web icon (`</>`) to add a web app
4. Copy the config object
5. Paste it into `js/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  // ... rest
};
```

### 4. Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### 5. Set Gemini API Key

Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

```bash
# Option 1: Using config
firebase functions:config:set gemini.api_key="YOUR_KEY"

# Option 2: Using secrets (recommended)
firebase functions:secrets:set GEMINI_API_KEY
```

Then update `functions/index.js` to use the secret:
```javascript
const geminiApiKey = process.env.GEMINI_API_KEY || functions.config().gemini?.api_key;
```

### 6. Deploy Functions

```bash
cd functions
firebase deploy --only functions
cd ..
```

### 7. Seed Data (Optional)

1. Download service account key:
   - Firebase Console → Project Settings → Service Accounts
   - Click "Generate new private key"
   - Save as `serviceAccountKey.json` in project root

2. Run seed script:
```bash
node scripts/seed-data.js
```

### 8. Development

```bash
npm run dev
```

Visit `http://localhost:3000`

### 9. Build & Deploy

```bash
npm run build
firebase deploy --only hosting
```

## Setting Up Admin User

After creating your account, manually set role in Firestore:

1. Go to Firestore Console
2. Find `users/{your-uid}`
3. Add field: `role: "ADMIN"`

Or use Firebase CLI:
```bash
firebase firestore:set users/YOUR_UID '{role: "ADMIN"}'
```

## Troubleshooting

### Functions not deploying
- Make sure you're in the `functions` directory
- Check Node.js version: `node --version` (should be 20+)
- Run `npm install` in functions directory

### Authentication not working
- Check Firebase config in `js/firebase.js`
- Verify Auth providers are enabled in Firebase Console
- Check browser console for errors

### AI not responding
- Verify Gemini API key is set
- Check Functions logs: `firebase functions:log`
- Ensure function is deployed: `firebase functions:list`

### Firestore permission errors
- Verify security rules are deployed
- Check user role in Firestore
- Review rules in `firestore.rules`

## Next Steps

- Customize roles and content
- Add more badges
- Configure email notifications
- Set up analytics
- Customize styling

