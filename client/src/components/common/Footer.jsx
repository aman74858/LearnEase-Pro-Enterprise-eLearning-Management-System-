import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Heart, ArrowUpRight } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-[#151B24] text-gray-300 pt-16 pb-12 border-t border-gray-800 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-800">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2">
            <div className="mb-5">
              <Logo size="lg" variant="light" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-6">
              Unlock your potential with powerful online learning. We empower ambitious professionals and students with world-class tech education, live interactive sessions, and accredited certifications.
            </p>
            <div className="flex items-center space-x-3 text-sm text-gray-400">
              <span className="flex items-center gap-1.5 bg-gray-800/80 px-3 py-1.5 rounded-full border border-gray-700/60">
                <span className="w-2 h-2 rounded-full bg-[#16A36A] animate-pulse"></span>
                System Operational
              </span>
              <span className="text-xs text-gray-500">MERN Stack • MongoDB Atlas</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-heading font-semibold text-base mb-4 tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/courses" className="hover:text-[#128F80] transition-colors flex items-center gap-1">
                  All Courses
                  <ArrowUpRight className="w-3.5 h-3.5 text-gray-500" />
                </Link>
              </li>
              <li>
                <Link to="/live-classes" className="hover:text-[#128F80] transition-colors">
                  Live Masterclasses
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#128F80] transition-colors">
                  About LearnEase
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#128F80] transition-colors">
                  Student Support
                </Link>
              </li>
              <li>
                <Link to="/verify-certificate" className="hover:text-[#128F80] transition-colors">
                  Verify Certificate
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Top Categories */}
          <div>
            <h4 className="text-white font-heading font-semibold text-base mb-4 tracking-wide">
              Top Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/courses?category=web-development" className="hover:text-[#128F80] transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link to="/courses?category=artificial-intelligence" className="hover:text-[#128F80] transition-colors">
                  Generative AI & LLMs
                </Link>
              </li>
              <li>
                <Link to="/courses?category=data-science" className="hover:text-[#128F80] transition-colors">
                  Data Science & Python
                </Link>
              </li>
              <li>
                <Link to="/courses?category=ui-ux-design" className="hover:text-[#128F80] transition-colors">
                  UI/UX & Figma
                </Link>
              </li>
              <li>
                <Link to="/courses?category=cloud-computing" className="hover:text-[#128F80] transition-colors">
                  Cloud & DevOps
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Office */}
          <div>
            <h4 className="text-white font-heading font-semibold text-base mb-4 tracking-wide">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#128F80] shrink-0 mt-0.5" />
                <span>123 main road, Ranchi, 834001</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#128F80] shrink-0" />
                <span>support@learneasepro.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#128F80] shrink-0" />
                <span>+91 (748) 587-0839</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} LearnEase Pro Inc. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-gray-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-gray-400 cursor-pointer">Cookie Preferences</span>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;

