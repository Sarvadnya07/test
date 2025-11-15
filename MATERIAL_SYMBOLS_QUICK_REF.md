# 🎨 Material Symbols - Quick Reference

## ✨ What's New

Your app now uses **professional Google Material Symbols** instead of emoji icons!

```
Before: 🌙 👤 📊 ⚙️ 🚪 ☰
After:  light_mode  account_circle  dashboard  settings  logout  menu
```

---

## 🚀 How to Use

### Basic Icon
```html
<span class="material-symbols-outlined">icon_name</span>
```

### With Size
```html
<span class="material-symbols-outlined text-xl">settings</span>
<span class="material-symbols-outlined text-2xl">home</span>
```

### With Color
```html
<span class="material-symbols-outlined text-blue-600">settings</span>
<span class="material-symbols-outlined text-red-500">delete</span>
```

### Full Example
```html
<button class="flex items-center gap-2">
  <span class="material-symbols-outlined">save</span>
  Save
</button>
```

---

## 🎯 Common Icons

| Icon | Name | Use |
|------|------|-----|
| 👤 | `person` | User profile |
| 🔐 | `account_circle` | Profile circle |
| 🚪 | `logout` | Sign out |
| ⚙️ | `settings` | Settings |
| 📊 | `dashboard` | Dashboard |
| 🏠 | `home` | Home page |
| 📚 | `school` | Learning |
| 📈 | `trending_up` | Progress |
| 👥 | `groups` | Community |
| 🔍 | `search` | Search |
| 🔔 | `notifications` | Notifications |
| ✏️ | `edit` | Edit |
| 🗑️ | `delete` | Delete |
| 💾 | `save` | Save |
| ✓ | `check_circle` | Success |
| ☰ | `menu` | Menu |

---

## 🎨 Styling

### Sizes
```html
text-sm     <!-- 14px -->
text-base   <!-- 16px -->
text-lg     <!-- 18px -->
text-xl     <!-- 20px -->
text-2xl    <!-- 24px -->
text-3xl    <!-- 30px -->
```

### Colors
```html
text-blue-600       <!-- Blue -->
text-green-500      <!-- Green -->
text-red-500        <!-- Red -->
text-yellow-500     <!-- Yellow -->
text-gray-500       <!-- Gray -->
dark:text-gray-300  <!-- Dark mode -->
```

### States
```html
hover:text-blue-700        <!-- Hover -->
transition                 <!-- Smooth -->
dark:hover:text-blue-400   <!-- Dark hover -->
```

---

## 📍 In Your App

### Header Icons (All Pages)
```
🌙 → light_mode / dark_mode    (theme toggle)
👤 → account_circle             (profile icon)
📊 → dashboard                  (menu item)
⚙️ → settings                   (menu item)
🚪 → logout                     (menu item)
☰ → menu                        (mobile menu)
```

### Font Link
Already added to:
- ✅ `header.html`
- ✅ `index.html`
- ✅ `dashboard.html`

---

## 📖 Full Guide

See `MATERIAL_SYMBOLS_GUIDE.md` for:
- Complete icon list
- Detailed examples
- Advanced styling
- Dark mode tips
- Performance info
- Migration checklist

---

## ✅ Current Status

✅ Icons integrated in header  
✅ Theme toggle updated  
✅ Profile icons modern  
✅ All menu items styled  
✅ Mobile menu ready  
✅ Dark mode compatible  
✅ Production ready  

---

## 🎯 Quick Copy-Paste

### Profile Button
```html
<button class="flex items-center gap-2">
  <span class="material-symbols-outlined text-2xl">account_circle</span>
  <span>John Doe</span>
  <span class="material-symbols-outlined">expand_more</span>
</button>
```

### Settings Link
```html
<a href="/settings.html" class="flex items-center gap-2">
  <span class="material-symbols-outlined">settings</span>
  Settings
</a>
```

### Delete Button
```html
<button class="flex items-center gap-2 text-red-600 hover:text-red-700">
  <span class="material-symbols-outlined">delete</span>
  Delete
</button>
```

---

## 🌓 Dark Mode

```html
<!-- Light & Dark -->
<span class="material-symbols-outlined text-gray-700 dark:text-gray-200">
  settings
</span>

<!-- Interactive -->
<a class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
  <span class="material-symbols-outlined">home</span>
</a>
```

---

## 🚀 Performance

- Vector format (scales perfectly)
- 15KB font file
- Browser cached
- No JavaScript
- Fast loading

---

## 📚 Resources

- **Icons:** https://fonts.google.com/icons
- **Docs:** https://developers.google.com/fonts/docs/material_symbols
- **Full Guide:** `MATERIAL_SYMBOLS_GUIDE.md`
- **Examples:** Check `/components/header.html`

---

**That's it! Your app now has professional icons!** ✨
