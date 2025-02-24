import React from "react";
import {
  Shield,
  HelpCircle,
  FileText,
  Download,
  ExternalLink,
  ChevronRight,
  Facebook,
  Twitter,
  Instagram,
  Settings,
} from "lucide-react";

const FooterLink = ({ href, children, external }) => (
  <div className="group relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:to-orange-500/10 transition-all duration-300" />
    <a
      href={href}
      target={external ? "_blank" : "_self"}
      rel={external ? "noopener noreferrer" : ""}
      className="flex items-center gap-2 py-2 text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-all duration-300"
    >
      {children}
      {external ? (
        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
      ) : (
        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
      )}
    </a>
  </div>
);

const SocialIcon = ({ icon: Icon, href, label, gradient }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex items-center gap-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
  >
    <div
      className={`p-3 rounded-xl ${gradient} shadow-lg transform transition-all duration-300 group-hover:scale-110`}
    >
      <Icon className="h-5 w-5 text-white" />
    </div>
    <span className="font-medium">{label}</span>
  </a>
);

const AppStoreButton = ({ type }) => {
  const storeData = {
    android: {
      href: "https://play.google.com/store/apps/details?id=com.tickethub.app",
      className:
        "bg-black hover:bg-gray-900 h-12 px-8 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105",
      icon: <Download className="h-5 w-5 text-white" />,
      text: "Get it on Google Play",
    },
    ios: {
      href: "https://apps.apple.com/app/tickethub/id123456789",
      className:
        "bg-black hover:bg-gray-900 h-12 px-8 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105",
      icon: <Download className="h-5 w-5 text-white" />,
      text: "Download on App Store",
    },
  };

  const store = storeData[type];

  return (
    <a
      href={store.href}
      target="_blank"
      rel="noopener noreferrer"
      className={store.className}
    >
      {store.icon}
      <span className="text-white text-sm font-medium">{store.text}</span>
    </a>
  );
};

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Information Section */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Shield className="h-6 w-6 text-orange-500" />
              Information
            </h3>
            <div className="space-y-1">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/how-it-works">
                <HelpCircle className="h-4 w-4" />
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
            </div>
          </div>

          {/* Social Media Section */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Connect With Us
            </h3>
            <div className="space-y-6">
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
                icon={Settings}
                href="https://tiktok.com"
                label="TikTok"
                gradient="bg-gradient-to-r from-gray-900 to-gray-800"
              />
            </div>
          </div>

          {/* Download Section */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Download className="h-6 w-6 text-orange-500" />
              Get Our App
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Download our mobile app for the best experience
            </p>
            <div className="space-y-4">
              <AppStoreButton type="ios" />
              <AppStoreButton type="android" />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} TicketHub. All rights reserved.
            </div>
            <div className="flex items-center gap-8">
              {["Terms", "Privacy", "Cookies"].map((item) => (
                <a
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-all duration-300"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
