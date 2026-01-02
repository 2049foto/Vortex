/**
 * Footer Component
 */

import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-white py-12 mt-20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <span className="text-xl font-bold">Vortex</span>
            </div>
            <p className="text-neutral-400 text-sm">
              Advanced token security scanner powered by AI
            </p>
          </div>
          
          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link to="/dashboard" className="hover:text-white transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-white transition">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/watchlist" className="hover:text-white transition">
                  Watchlist
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <a href="https://docs.vortex.protocol" className="hover:text-white transition" target="_blank" rel="noopener noreferrer">
                  Documentation
                </a>
              </li>
              <li>
                <a href="https://github.com/2049foto/Vortex" className="hover:text-white transition" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
              <li>
                <Link to="/settings" className="hover:text-white transition">
                  Settings
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <a href="/security" className="hover:text-white transition">
                  Security
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-white transition">
                  Privacy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-white transition">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-neutral-800 text-center text-sm text-neutral-400">
          <p>© 2026 Vortex Protocol. Built on Base.</p>
        </div>
      </div>
    </footer>
  );
}

