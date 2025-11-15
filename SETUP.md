# Setup Guide - EduRise

## 1. Gemini API Setup

### Get Your API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### Configure in Project
1. Copy `js/config.example.js` to `js/config.js`
2. Replace `YOUR_GEMINI_API_KEY_HERE` with your actual API key:

```javascript
const CONFIG = {
  GEMINI_API_KEY: "your-actual-api-key-here",
  // ...
};
```

**Note:** `js/config.js` is in `.gitignore` to keep your keys secure.

## 2. Firebase Setup

### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name (e.g., "edurise")
4. Follow the setup wizard
5. Enable Google Analytics (optional)

### Get Firebase Configuration
1. In Firebase Console, click the gear icon ⚙️ > Project Settings
2. Scroll down to "Your apps"
3. Click the web icon `</>` to add a web app
4. Register your app (e.g., "EduRise Web")
5. Copy the `firebaseConfig` object

### Configure in Project
1. Open `js/config.js`
2. Replace the FIREBASE object with your config:

```javascript
FIREBASE: {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
  measurementId: "G-XXXXXXXXXX"
}
```

### Enable Firebase Services

#### Authentication
1. Go to Firebase Console > Authentication
2. Click "Get Started"
3. Enable "Email/Password" provider
4. Enable "Google" provider (optional)

#### Firestore Database
1. Go to Firebase Console > Firestore Database
2. Click "Create Database"
3. Start in **test mode** (for development)
4. Choose a location (closest to your users)

#### Storage
1. Go to Firebase Console > Storage
2. Click "Get Started"
3. Start in **test mode** (for development)
4. Use same location as Firestore

### Install Firebase CLI (Optional - for deployment)
```bash
npm install -g firebase-tools
firebase login
firebase init
```

## 3. Update HTML Files

Add the config script to your HTML files (before other scripts):

```html
<script src="/js/config.js"></script>
```

The following files should include it:
- `index.html`
- `ai.html`
- `role.html`
- `six-week-plan.html`
- `skill-explainer.html`
- `career-recommendation.html`
- Any page using Firebase or Gemini

## 4. Test Your Setup

### Test Gemini API
1. Open `ai.html`
2. Enter a question
3. Check browser console for errors
4. You should get AI responses

### Test Firebase
1. Go to `auth.html`
2. Try signing up with email/password
3. Check Firebase Console > Authentication for new user
4. Check Firestore for user document

## 5. Security Notes

### Development
- `js/config.js` is in `.gitignore` - never commit it
- Use test mode for Firestore/Storage during development

### Production
- Set up proper Firestore Security Rules
- Set up Storage Security Rules
- Use environment variables or Firebase Functions for sensitive operations
- Enable App Check for additional security

## 6. Firestore Security Rules (Development)

Replace with your actual rules in Firebase Console > Firestore > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Roles are public read, admin write
    match /roles/{roleId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Progress is user-specific
    match /progress/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Feedback can be created by anyone, read by admins
    match /feedback/{feedbackId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 7. Troubleshooting

### Gemini API not working
- Check API key is correct in `js/config.js`
- Check browser console for errors
- Verify API key has proper permissions
- Check API quota/limits

### Firebase not working
- Check config in `js/config.js`
- Verify Firebase services are enabled
- Check browser console for errors
- Verify Firestore/Storage rules allow your operations

### Gamification not updating
- Check localStorage in browser DevTools
- Verify events are being fired
- Check console for errors

## 8. Next Steps

1. Set up Firestore indexes for queries
2. Configure Firebase Hosting
3. Set up Cloud Functions (optional)
4. Add more roles and content
5. Customize styling

For more help, check the Firebase documentation or Gemini API docs.
