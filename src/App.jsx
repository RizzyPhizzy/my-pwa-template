import { useState, useEffect } from 'react'

function App() {
  const [count, setCount] = useState(0)
  const [pwaInstallPrompt, setPwaInstallPrompt] = useState(null)

  useEffect(() => {
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setPwaInstallPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('PWA is installed and running as standalone')
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallPWA = async () => {
    if (!pwaInstallPrompt) {
      alert('PWA is already installed or not available on this platform')
      return
    }

    pwaInstallPrompt.prompt()
    const { outcome } = await pwaInstallPrompt.userChoice
    console.log(`User response to the install prompt: ${outcome}`)
    setPwaInstallPrompt(null)
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>My PWA App</h1>
        <p>Replace this with your Claude-generated component!</p>
      </header>

      <main className="app-main">
        <section className="card">
          <h2>Welcome to Your PWA</h2>
          <p>This is a starter template for building Progressive Web Apps with Vite and React.</p>

          <div className="features">
            <h3>Features:</h3>
            <ul>
              <li>⚡ Fast development with Vite</li>
              <li>⚛️ React 18 with hooks</li>
              <li>📱 Progressive Web App ready</li>
              <li>🔄 Automatic service worker updates</li>
              <li>📦 Offline support with Workbox</li>
              <li>🚀 Ready to deploy to Vercel</li>
            </ul>
          </div>

          <div className="counter-section">
            <h3>Counter Demo</h3>
            <button
              className="counter-button"
              onClick={() => setCount(count + 1)}
            >
              Count: {count}
            </button>
          </div>

          {pwaInstallPrompt && (
            <div className="install-prompt">
              <button
                className="install-button"
                onClick={handleInstallPWA}
              >
                📥 Install App
              </button>
            </div>
          )}
        </section>

        <section className="card next-steps">
          <h2>Next Steps</h2>
          <ol>
            <li>Replace this App.jsx with your own component</li>
            <li>Update the manifest in vite.config.js with your app details</li>
            <li>Replace the icons in public/ with your own images</li>
            <li>Run <code>npm run build</code> to create a production build</li>
            <li>Deploy to Vercel using <code>vercel deploy</code></li>
          </ol>
        </section>

        <section className="card resources">
          <h2>Resources</h2>
          <ul>
            <li><a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">Vite Documentation</a></li>
            <li><a href="https://react.dev" target="_blank" rel="noopener noreferrer">React Documentation</a></li>
            <li><a href="https://vite-pwa-org.netlify.app" target="_blank" rel="noopener noreferrer">vite-plugin-pwa</a></li>
            <li><a href="https://vercel.com/docs" target="_blank" rel="noopener noreferrer">Vercel Documentation</a></li>
            <li><a href="https://web.dev/progressive-web-apps/" target="_blank" rel="noopener noreferrer">PWA Guide</a></li>
          </ul>
        </section>
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 My PWA App. Built with Vite + React</p>
      </footer>
    </div>
  )
}

export default App
