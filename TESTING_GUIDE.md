# Quick Start Guide — Local Development & Testing

## Prerequisites
- Node.js v16+ installed
- npm or yarn package manager

## Installation & Running Locally

### 1. Install Dependencies
```bash
cd c:\Users\ASUS\Desktop\pathways_test\pathways_test
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

This will start Vite dev server (usually on `http://localhost:5173`).

### 3. View Pages
- **Homepage:** http://localhost:5173/
- **Roles:** http://localhost:5173/roles.html
- **Learn Library:** http://localhost:5173/learn.html
- **Help & FAQ:** http://localhost:5173/help.html
- **Dashboard:** http://localhost:5173/dashboard.html (requires login)
- **Profile:** http://localhost:5173/profile.html (requires login)
- **AI Assistant:** http://localhost:5173/ai.html
- **Forum:** http://localhost:5173/forum.html
- **Sign In / Sign Up:** http://localhost:5173/auth.html

---

## Testing Checklist

### Visual & Layout
- [ ] Hero sections render with proper spacing
- [ ] Cards and grids stack correctly on mobile
- [ ] Dark mode toggle works (look for 🌙 button)
- [ ] Colors match the design palette (blues, greens, purples)
- [ ] Responsive breakpoints work (test at 375px, 768px, 1200px widths)

### Accessibility
- [ ] Press Tab to reach "Skip to main content" link
- [ ] Keyboard navigation works through forms and buttons
- [ ] Screen reader can read all content (test with NVDA/JAWS if available)
- [ ] Color contrast is sufficient (use Chrome DevTools Lighthouse)

### Content
- [ ] All hero sections appear with proper titles
- [ ] Help page shows all FAQ sections expanded/collapsible
- [ ] Learn library displays all 6 resource cards
- [ ] Roles page shows stats bar and filter controls
- [ ] Auth page shows split layout on desktop, stacked on mobile

### SEO & Meta
- [ ] Right-click → View Page Source to verify:
  - Meta description tag is present
  - Open Graph tags (og:title, og:description)
  - JSON-LD script tag with structured data
  - Favicon link tag

### Performance (Chrome DevTools → Lighthouse)
- [ ] Performance score > 80
- [ ] Accessibility score > 90
- [ ] Best Practices score > 80
- [ ] SEO score > 90

---

## Browser Compatibility

Test on:
- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile Chrome & Safari

---

## Common Issues & Fixes

### Issue: Styles not loading
**Fix:** Clear browser cache (Ctrl+Shift+Delete) or hard refresh (Ctrl+Shift+R)

### Issue: Images showing as placeholders
**Fix:** This is expected. Replace placeholder div with actual images in `/public`

### Issue: Firebase/Auth not working
**Fix:** Check Firebase config in `js/firebase.js`. Ensure `.env` variables are set if using environment files.

### Issue: Dark mode not toggling
**Fix:** Click the 🌙 button in header. Check `js/ui.js` for theme toggle logic.

---

## Making Changes

### To edit a page:
1. Open the `.html` file in VS Code
2. Make changes
3. Save (Ctrl+S)
4. Browser should auto-refresh (hot reload)

### To add new meta tags:
Edit the `<head>` section of any HTML file:
```html
<meta name="description" content="...">
<meta property="og:title" content="...">
<script type="application/ld+json">{ ... }</script>
```

### To modify styling:
- Global styles: `css/styles.css`
- Tailwind utilities: Already loaded via CDN in `<head>`
- Component-specific: Inline classes on elements

---

## Build for Production

```bash
npm run build
```

Output will be in `dist/` directory. Deploy these files to your hosting service.

---

## Support Files

- **IMPROVEMENTS.md** — Detailed report of all enhancements
- **SETUP.md** — Original project setup guide
- **FEATURES.md** — Feature list
- **README.md** — Project overview

---

## Questions?

Refer to original docs or check JavaScript console (F12 → Console tab) for error messages.

Good luck! 🚀
