'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">For Clients</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">How to Hire</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Talent Marketplace</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Project Catalog</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Talent Scout</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Hire an Agency</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Enterprise</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Payroll Services</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Direct Contracts</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">For Talent</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">How to Find Work</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Direct Contracts</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Find Freelance Jobs Worldwide</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Find Freelance Jobs in the USA</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Help & Support</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Success Stories</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">eventIQ Reviews</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Resources</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Community</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Affiliate Program</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Leadership</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Investor Relations</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Our Impact</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Press</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Trust, Safety & Security</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white transition-colors">Modern Slavery Statement</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">Facebook</span>
              <Facebook className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">Instagram</span>
              <Instagram className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">YouTube</span>
              <Youtube className="h-6 w-6" />
            </Link>
          </div>
          <p className="text-gray-400 text-sm text-center md:text-right">
            &copy; 2026 eventIQ Global Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
