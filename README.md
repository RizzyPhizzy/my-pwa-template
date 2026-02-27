# My PWA Template

A complete, production-ready Progressive Web App (PWA) template built with Vite and React. Perfect for beginners who want to build and deploy React apps as PWAs to Vercel.

## Features

- ⚡ **Vite**: Lightning-fast build tool and development server
- ⚛️ **React 18**: Latest React with hooks support
- 📱 **PWA Ready**: Service workers, offline support, and installable on mobile
- 🔄 **Auto-Updates**: Service worker auto-updates via Workbox
- 📦 **Offline Support**: Network-first caching strategy
- 🚀 **Vercel Deploy**: Pre-configured for seamless deployment
- 🎨 **Beautiful UI**: Modern, responsive design included
- ♿ **Accessible**: WCAG compliant with dark mode support

## Quick Start

### Prerequisites

- Node.js (v16 or higher) installed on your computer
- A code editor (VS Code recommended)

### Installation

1. Open a terminal/command prompt and navigate to this project:

```bash
cd my-pwa-template
```

2. Install dependencies:

```bash
npm install
```

3. Generate placeholder icons (optional):

```bash
npm run generate-icons
```

### Development

Start the development server:

```bash
npm run dev
```

Open your browser and go to `http://localhost:5173`. You'll see your PWA running with hot reload enabled.

## Project Structure

```
my-pwa-template/
├── src/
│   ├── main.jsx          # React app entry point
│   ├── App.jsx           # Main App component (replace with your code)
│   └── index.css         # Global styles (mobile-friendly reset)
├── public/
│   ├── pwa-192x192.png   # App icon (small)
│   ├── pwa-512x512.png   # App icon (large)
│   └── favicon.ico       # Browser tab icon
├── index.html            # HTML entry point with PWA meta tags
├── vite.config.js        # Vite config with PWA plugin
├── vercel.json           # Vercel deployment config
├── package.json          # Project dependencies
└── generate-icons.js     # Icon generator script
```

## Available Scripts

### `npm run dev`
Starts development server with hot reload.

### `npm run build`
Creates optimized production build in `dist/` folder.

### `npm run preview`
Previews the production build locally.

### `npm run generate-icons`
Generates placeholder PWA icons (192x192 and 512x512).

## Customization Guide

### 1. Update App Content

Edit `src/App.jsx` to create your own components:

```jsx
import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>My Custom App</h1>
      <button onClick={() => setCount(count + 1)}>
        Click me: {count}
      </button>
    </div>
  )
}

export default App
```

### 2. Update App Metadata

Edit `vite.config.js` to change PWA settings:

```javascript
manifest: {
  name: 'Your App Name',              // Full name
  short_name: 'Short Name',            // App drawer name
  description: 'Your app description',
  theme_color: '#667eea',              // Header color
  background_color: '#ffffff',         // Splash screen background
}
```

Also update `index.html`:
- `<title>` tag
- `meta` description
- `meta` theme-color

### 3. Replace Icons

The included icons are placeholders. To use your own:

1. Create or find 192x192 and 512x512 PNG images
2. Place them in the `public/` folder as:
   - `public/pwa-192x192.png`
   - `public/pwa-512x512.png`
3. Optionally create `public/favicon.ico` for the browser tab

**Pro tip**: Use these free tools:
- [Favicon Generator](https://www.favicon-generator.org/)
- [Image Converter](https://convertio.co/)
- [Canva](https://www.canva.com/) for design

### 4. Customize Styles

Edit `src/index.css` to match your brand:

```css
/* Change primary color */
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
}

/* Update gradient */
body {
  background: linear-gradient(135deg, #your-color1 0%, #your-color2 100%);
}
```

## Deployment to Vercel

### Easy Method (Recommended)

1. Download and install [Vercel CLI](https://vercel.com/docs/cli):

```bash
npm install -g vercel
```

2. Deploy from your project folder:

```bash
vercel deploy
```

3. Follow the prompts to create a Vercel account and deploy

### Using Git (Advanced)

1. Create a local git repository:

```bash
git init
git add .
git commit -m "Initial commit"
```

2. Push to GitHub (requires account setup)

3. Import project in [Vercel Dashboard](https://vercel.com/dashboard)

## How PWA Features Work

### Service Worker & Offline Support

The PWA automatically caches your app using Workbox. When the user is offline:
- Cached pages load instantly
- API calls are queued and sent when online
- Add-to-home-screen functionality works

Configuration in `vite.config.js`:

```javascript
workbox: {
  globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
  runtimeCaching: [{
    urlPattern: /^https:\/\/.*/i,
    handler: 'NetworkFirst', // Try network first, fallback to cache
    options: {
      cacheName: 'offlineCache',
      expiration: { maxEntries: 50, maxAgeSeconds: 604800 }
    }
  }]
}
```

### Auto-Updates

Users' PWAs automatically update when you deploy new versions:

```javascript
registerType: 'autoUpdate' // Defined in vite.config.js
```

### Installation Prompt

The App.jsx includes built-in PWA install button that appears on compatible browsers.

## Troubleshooting

### App not installing on mobile?

1. Check the console for errors: Press F12 → Console tab
2. Verify `manifest.json` exists (generated by vite-plugin-pwa)
3. Ensure HTTPS is enabled (required for PWA, Vercel provides this)
4. Wait 30+ seconds - browsers cache service workers

### Icons not showing?

1. Verify files exist: `public/pwa-192x192.png` and `public/pwa-512x512.png`
2. Run `npm run generate-icons` to create placeholders
3. Check browser console for 404 errors
4. Clear browser cache: Ctrl+Shift+Delete

### Service worker not updating?

1. Go to DevTools → Application → Service Workers
2. Click "Update on reload"
3. Clear cache and reload page

## Resources

- [Vite Docs](https://vitejs.dev)
- [React Docs](https://react.dev)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app)
- [PWA Guide](https://web.dev/progressive-web-apps/)
- [Vercel Docs](https://vercel.com/docs)
- [Web.dev - Getting Started with PWA](https://web.dev/progressive-web-apps/)

## Next Steps

1. ✏️ Replace App.jsx with your own code
2. 🎨 Update colors in vite.config.js and src/index.css
3. 📸 Replace icons in public/ folder
4. 🏗️ Run `npm run build` to test production build
5. 🚀 Deploy to Vercel with `vercel deploy`

## Need Help?

- Check the troubleshooting section above
- Read the comments in code files
- Visit [web.dev](https://web.dev) for PWA best practices
- Search "Vite React PWA" for tutorials

## License

Free to use and modify. Built for beginners!

---

**Happy coding!** 🎉

Remember: Start small, test locally with `npm run dev`, and build incrementally. Good luck with your PWA!
