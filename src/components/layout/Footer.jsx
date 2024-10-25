import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Instagram,
  TrendingUp,
  HelpCircle,
  Shield,
  FileText,
  Download,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

const FooterLink = ({ href, children, external }) => (
  <motion.li
    whileHover={{ x: 5 }}
    whileTap={{ scale: 0.95 }}
    className="group flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
  >
    {external ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2"
      >
        {children}
        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
      </a>
    ) : (
      <Link to={href} className="flex items-center gap-2">
        {children}
        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>
    )}
  </motion.li>
);

const SocialIcon = ({ icon: Icon, href, label, gradient }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
  >
    <div className={`p-2 rounded-lg ${gradient}`}>
      <Icon className="h-5 w-5 text-white" />
    </div>
    <span>{label}</span>
  </motion.a>
);

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Information Section */}
          <div className="lg:col-span-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-orange-500" />
              Information
            </h3>
            <ul className="space-y-3">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/how-it-works">
                <TrendingUp className="h-4 w-4" />
                How It Works
              </FooterLink>
              <FooterLink href="/help">
                <HelpCircle className="h-4 w-4" />
                Help Center
              </FooterLink>
              <FooterLink href="/privacy">
                <FileText className="h-4 w-4" />
                Privacy Policy
              </FooterLink>
              <FooterLink href="/faq">
                <HelpCircle className="h-4 w-4" />
                Help & FAQs
              </FooterLink>
            </ul>
          </div>

          {/* Social Media Section */}
          <div className="lg:col-span-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Connect With Us
            </h3>
            <div className="space-y-4">
              <SocialIcon
                icon={Facebook}
                href="https://facebook.com"
                label="Facebook"
                gradient="bg-gradient-to-r from-blue-600 to-blue-500"
              />
              <SocialIcon
                icon={Twitter}
                href="https://twitter.com"
                label="Twitter"
                gradient="bg-gradient-to-r from-blue-400 to-blue-300"
              />
              <SocialIcon
                icon={Instagram}
                href="https://instagram.com"
                label="Instagram"
                gradient="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
              />
              <SocialIcon
                icon={TrendingUp}
                href="https://tiktok.com"
                label="TikTok"
                gradient="bg-gradient-to-r from-black to-gray-800"
              />
            </div>
          </div>

          {/* Download Section */}
          <div className="lg:col-span-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Download className="h-5 w-5 text-orange-500" />
              Get Our App
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Download our mobile app for the best experience
            </p>
            <div className="space-y-4">
              <motion.a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="block"
              >
                <img
                  src="https://ticketswap-image-cdn.b-cdn.net/static/images/appStore/app-store-en.svg"
                  alt="Download on App Store"
                  className="h-12 w-auto hover:opacity-90 transition-opacity"
                />
              </motion.a>
              <motion.a
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="block"
              >
                <img
                  src="https://ticketswap-image-cdn.b-cdn.net/static/images/appStore/google-play-en.png"
                  alt="Get it on Google Play"
                  className="h-12 w-auto hover:opacity-90 transition-opacity"
                />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} TicketHub. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <Link
                to="/terms"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              >
                Terms
              </Link>
              <Link
                to="/privacy"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              >
                Privacy
              </Link>
              <Link
                to="/cookies"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
