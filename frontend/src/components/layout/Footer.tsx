import React from 'react';
import { getCloudinaryImageUrl } from '../../lib/utils';

export const Footer: React.FC = () => {
  const logoUrl = getCloudinaryImageUrl('pawfectly_logo');

  return (
    <footer id="site-footer" className="bg-[#16241B] text-white py-4 sm:py-5 border-t border-[#23382A]">
      <div className="w-full px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Leftmost: Brand */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = '/';
          }}
          className="flex items-center gap-2.5 hover:opacity-90 transition-opacity cursor-pointer"
        >
          <img
            src={logoUrl}
            alt="Pawfectly Logo"
            className="w-7 h-7 rounded-full object-cover"
          />
          <span className="text-lg font-extrabold tracking-tight">
            Pawfectly<span className="text-[#EF7C3C]">.</span>
          </span>
        </a>

        {/* Center: Copyright */}
        <p className="text-xs text-[#A3B3A6] text-center">
          © 2024 Pawfectly Inc. Dedicated to happier, healthier pets everywhere.
        </p>

        {/* Rightmost: Legal links & Social icons */}
        <div className="flex items-center gap-5 text-xs font-medium text-[#A3B3A6]">
          <a href="mailto:privacy@pawfectly.com?subject=Privacy%20Policy%20Inquiry" className="hover:text-white transition-colors">
            Privacy
          </a>
          <a href="mailto:terms@pawfectly.com?subject=Terms%20of%20Service%20Inquiry" className="hover:text-white transition-colors">
            Terms
          </a>
          <a href="mailto:support@pawfectly.com?subject=Pawfectly%20Support%20Request" className="hover:text-white transition-colors">
            Contact
          </a>
          <div className="flex items-center gap-3 border-l border-[#2B3E30] pl-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="text-[#A3B3A6] hover:text-white transition-colors inline-flex items-center"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-[#A3B3A6] hover:text-white transition-colors inline-flex items-center"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

