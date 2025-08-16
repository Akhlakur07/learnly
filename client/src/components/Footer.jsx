import React from "react";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-yellow-200">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="inline-block h-6 w-6 rounded-md bg-yellow-400" />
              <span className="text-xl font-extrabold text-black">Learnly</span>
            </Link>
            <p className="mt-3 text-sm text-black/70">
              Learn by building. Short lessons, practical projects, and
              progress you can see.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-sm font-bold text-black">Explore</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/courses" className="text-black/70 hover:text-black">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/addCourse" className="text-black/70 hover:text-black">
                  Create a Course
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-black/70 hover:text-black">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-black/70 hover:text-black">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-bold text-black">Resources</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-black/70 hover:text-black">
                  About
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-black/70 hover:text-black">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-black/70 hover:text-black">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-black/70 hover:text-black">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter + Social */}
          <div>
            <h4 className="text-sm font-bold text-black">Stay in the loop</h4>
            <form
              className="mt-3 flex items-center gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Your email"
                className="w-full rounded-lg border border-yellow-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Subscribe
              </button>
            </form>

            <div className="mt-4 flex items-center gap-3">
              {/* Socials use inline SVGs to avoid extra deps */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (Twitter)"
                className="rounded-lg border border-yellow-300 p-2 hover:bg-yellow-50"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M18.244 2H21l-6.53 7.46L22.5 22H15.9l-4.98-6.52L5.2 22H2l7.08-8.08L1.8 2h6.78l4.5 5.92L18.244 2z" />
                </svg>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="rounded-lg border border-yellow-300 p-2 hover:bg-yellow-50"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M12 .5A11.5 11.5 0 0 0 .5 12c0 5.08 3.29 9.38 7.86 10.9.58.1.79-.25.79-.56v-2.1c-3.2.7-3.87-1.36-3.87-1.36-.52-1.3-1.27-1.64-1.27-1.64-1.04-.7.08-.69.08-.69 1.16.08 1.77 1.2 1.77 1.2 1.02 1.76 2.66 1.25 3.31.95.1-.74.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.72 0-1.26.45-2.28 1.2-3.08-.12-.29-.52-1.47.11-3.06 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.82 0c2.22-1.49 3.2-1.18 3.2-1.18.63 1.59.23 2.77.11 3.06.75.8 1.2 1.82 1.2 3.08 0 4.45-2.69 5.42-5.25 5.71.41.35.77 1.05.77 2.12v3.14c0 .31.2.67.8.55A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="rounded-lg border border-yellow-300 p-2 hover:bg-yellow-50"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M23.5 6.2a3.7 3.7 0 0 0-2.6-2.6C18.9 3 12 3 12 3s-6.9 0-8.9.6A3.7 3.7 0 0 0 .5 6.2 38 38 0 0 0 0 12a38 38 0 0 0 .5 5.8 3.7 3.7 0 0 0 2.6 2.6C5.1 21 12 21 12 21s6.9 0 8.9-.6a3.7 3.7 0 0 0 2.6-2.6A38 38 0 0 0 24 12a38 38 0 0 0-.5-5.8zM9.75 15.5V8.5L15.5 12l-5.75 3.5z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-yellow-200 pt-6 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-black/60">
            © {new Date().getFullYear()} Learnly. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-black/60">
            <Link to="/privacy" className="hover:text-black">Privacy</Link>
            <span className="h-1 w-1 rounded-full bg-black/30" />
            <Link to="/terms" className="hover:text-black">Terms</Link>
            <span className="h-1 w-1 rounded-full bg-black/30" />
            <Link to="/contact" className="hover:text-black">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;