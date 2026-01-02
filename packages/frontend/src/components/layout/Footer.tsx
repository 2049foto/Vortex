/**
 * Footer component for Vortex Protocol
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { Github, Twitter, MessageCircle } from 'lucide-react';

/**
 * Footer component
 */
export function Footer(): React.ReactElement {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'Token Scanner', href: '/dashboard' },
      { label: 'Watchlist', href: '/watchlist' },
    ],
    resources: [
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '/api' },
      { label: 'Help Center', href: '/help' },
      { label: 'Status', href: '/status' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
  };

  const socialLinks = [
    { icon: <Twitter className="w-5 h-5" />, href: 'https://twitter.com/vortexprotocol', label: 'Twitter' },
    { icon: <Github className="w-5 h-5" />, href: 'https://github.com/vortexprotocol', label: 'GitHub' },
    { icon: <MessageCircle className="w-5 h-5" />, href: 'https://discord.gg/vortex', label: 'Discord' },
  ];

  return (
    <footer className="border-t border-border bg-background-card">
      <div className="container mx-auto py-12 px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center">
                <span className="text-white text-sm font-black">V</span>
              </div>
              <span className="text-xl font-bold text-text-primary">Vortex</span>
            </Link>
            <p className="text-sm text-text-secondary max-w-xs mb-4">
              Advanced DeFi token security scanner and portfolio tracker. 
              Protect your investments with real-time risk analysis.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={clsx(
                    'p-2 rounded-lg transition-colors',
                    'text-text-muted hover:text-text-primary',
                    'hover:bg-background-hover'
                  )}
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-text-muted">
              © {currentYear} Vortex Protocol. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-xs text-text-muted">
                <span className="w-2 h-2 bg-success-light rounded-full animate-pulse" />
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

