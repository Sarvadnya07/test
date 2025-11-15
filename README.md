# EduRise - Education Awareness & Career Pathways Platform

A modern, mobile-first web application for education awareness and structured career learning paths.

## Features

- 🎓 **Education Awareness Portal** - Study habits, motivation, resources, and goals
- 🗺️ **Career Pathways** - Structured roadmaps for multiple careers (Doctor, Engineer, Lawyer, Police, Teacher, Designer)
- 🤖 **AI Mentor** - Powered by Google Gemini for personalized learning plans and career advice
- 🎮 **Gamification** - Streaks, badges, XP, levels, and Pomodoro timer
- 💬 **Community Forum** - Q&A discussions and community support
- 📊 **Progress Tracking** - Track your learning journey with detailed analytics
- 📄 **PDF Export** - Export roadmaps and learning plans

## Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage, Functions)
- **AI**: Google Gemini API
- **Storage**: localStorage (offline) + Firebase (online)

## Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd pathways_test
```

### 2. Setup Configuration

1. Copy the example config file:
   ```bash
   cp js/config.example.js js/config.js
   ```

2. Edit `js/config.js` and add your API keys:
   - **Gemini API Key**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - **Firebase Config**: Get from [Firebase Console](https://console.firebase.google.com/)

### 3. Setup Firebase

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password, Google)
3. Create Firestore Database (start in test mode)
4. Enable Storage
5. Copy your Firebase config to `js/config.js`

See [SETUP.md](./SETUP.md) for detailed instructions.

### 4. Run Locally

You can run this project using any static file server:

**Option 1: Python**
```bash
python -m http.server 8000
```

**Option 2: Node.js (http-server)**
```bash
npx http-server -p 8000
```

**Option 3: VS Code Live Server**
- Install "Live Server" extension
- Right-click `index.html` > "Open with Live Server"

Then open `http://localhost:8000` in your browser.

## Project Structure

```
pathways_test/
├── index.html              # Home page
├── roles.html              # Role explorer
├── role.html               # Role details with roadmap
├── ai.html                 # AI mentor chat
├── forum.html              # Q&A forum
├── gamification.html       # Gamification hub
├── auth.html               # Login/Signup
├── profile.html            # User profile
├── dashboard.html          # User dashboard
├── six-week-plan.html      # 6-week plan generator
├── skill-explainer.html    # Skill explanations
├── career-recommendation.html # Career recommendations
├── components/
│   ├── header.html         # Navigation bar
│   └── footer.html         # Footer
├── js/
│   ├── config.js          # API keys (gitignored)
│   ├── config.example.js  # Example config
│   ├── firebase-vanilla.js # Firebase wrapper
│   ├── gemini.js          # Gemini API integration
│   ├── roles-data-vanilla.js # Roles data
│   ├── export-pdf.js     # PDF export utility
│   └── ...
├── css/
│   └── styles.css         # Custom styles
└── SETUP.md               # Detailed setup guide
```

## Configuration

### Gemini API Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add it to `js/config.js`:

```javascript
GEMINI_API_KEY: "your-api-key-here"
```

### Firebase Setup

1. Create Firebase project
2. Enable services:
   - Authentication (Email/Password, Google)
   - Firestore Database
   - Storage
3. Copy config to `js/config.js`:

```javascript
FIREBASE: {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  // ... rest of config
}
```

## Features in Detail

### Career Roles

- **Doctor** - Medical career path
- **Software Engineer** - Tech career path
- **Lawyer** - Legal career path
- **Police Officer** - Public service path
- **Teacher** - Education path
- **UI/UX Designer** - Design path

Each role includes:
- Multiple learning stages
- Skills breakdown
- Task checklists
- Resources and links
- Progress tracking

### AI Features

- **General Q&A** - Ask any career/learning question
- **6-Week Plans** - Generate personalized learning plans
- **Skill Explainer** - Get detailed skill explanations
- **Career Recommender** - Get career recommendations based on interests

### Gamification

- **XP & Levels** - Earn XP, level up
- **Streaks** - Daily activity tracking
- **Badges** - Unlock achievements
- **Daily Challenges** - Complete 3 tasks/day
- **Pomodoro Timer** - Focus sessions
- **Progress Calendar** - Visual progress tracking

## Development

### Adding New Roles

Edit `js/roles-data-vanilla.js` and add your role data:

```javascript
{
  slug: 'your-role',
  title: 'Your Role Title',
  summary: 'Description',
  domain: 'Category',
  difficulty: 'Beginner|Intermediate|Advanced',
  estMonths: 6,
  stages: [ /* ... */ ],
  resources: [ /* ... */ ]
}
```

### Customizing Styles

Edit `css/styles.css` or modify Tailwind classes in HTML files.

## Deployment

### Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login:
   ```bash
   firebase login
   ```

3. Initialize:
   ```bash
   firebase init hosting
   ```

4. Deploy:
   ```bash
   firebase deploy
   ```

### Other Hosting

You can deploy to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

**Important**: Make sure `js/config.js` is not committed to git (it's in `.gitignore`). Use environment variables in production.

## Security Notes

- `js/config.js` is gitignored - never commit API keys
- Use Firebase Security Rules for production
- Set up proper CORS if needed
- Use environment variables for production deployment

## Troubleshooting

### Gemini API not working
- Check API key in `js/config.js`
- Verify key has proper permissions
- Check browser console for errors

### Firebase not working
- Verify Firebase config in `js/config.js`
- Check Firebase services are enabled
- Review Firestore/Storage security rules

### Gamification not updating
- Check localStorage in DevTools
- Verify task completion events are firing
- Check console for errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues and questions:
- Check [SETUP.md](./SETUP.md) for setup help
- Review Firebase/Gemini documentation
- Open an issue on GitHub

---

Built with ❤️ for learners everywhere

