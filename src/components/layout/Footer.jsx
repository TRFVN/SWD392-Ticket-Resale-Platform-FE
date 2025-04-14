import React, { memo } from "react";
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
  Mail,
  Clock,
  Phone,
  MapPin,
  Globe,
  Info,
  Lock,
  CreditCard,
  User,
  Award,
} from "lucide-react";

// Footer Link Component with animation effects
const FooterLink = memo(({ href, children, icon: Icon, external }) => (
  <div className="group">
    <a
      href={href}
      target={external ? "_blank" : "_self"}
      rel={external ? "noopener noreferrer" : ""}
      className="flex items-center gap-2 py-2.5 text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 
        transition-all duration-300 relative overflow-hidden rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/40"
      aria-label={typeof children === "string" ? children : undefined}
    >
      {/* Background animation on hover */}
      <span
        className="absolute inset-0 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/10 dark:to-orange-900/10 
        opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md -z-10"
      />

      {/* Icon if provided */}
      {Icon && <Icon className="h-4 w-4 text-orange-500 flex-shrink-0" />}

      {/* Link text */}
      <span className="text-sm">{children}</span>

      {/* Arrow indicator */}
      {external ? (
        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
      ) : (
        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
      )}
    </a>
  </div>
));

FooterLink.displayName = "FooterLink";

// Social Icon Component with enhanced animations
const SocialIcon = memo(({ icon: Icon, href, label, gradient }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex items-center gap-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white 
      transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500/40 rounded-md p-1"
    aria-label={`Follow us on ${label}`}
  >
    <div
      className={`p-3 rounded-xl ${gradient} shadow-md transform transition-all duration-300 
        group-hover:scale-110 group-hover:shadow-lg group-hover:rotate-3`}
    >
      <Icon className="h-5 w-5 text-white" />
    </div>
    <span className="font-medium text-sm">{label}</span>
  </a>
));

SocialIcon.displayName = "SocialIcon";

// App Store Button with improved design
const AppStoreButton = memo(({ type }) => {
  const storeData = {
    android: {
      href: "https://play.google.com/store/apps/details?id=com.tickethub.app",
      className:
        "bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 h-12 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500/40",
      icon: (
        <svg
          className="h-6 w-6 text-white"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M17.9 5c0-.2-.2-.4-.4-.5l-9.9-5.7c-.3-.1-.5-.1-.8 0-.2.1-.3.2-.4.5L2.5 11.7c-.1.2-.1.4 0 .7 0 .2.2.4.4.5l9.9 5.7c.2.1.3.1.4.1.1 0 .2 0 .3-.1.2-.1.4-.3.4-.5V5zm-.3 11.9l-9.3-5.3L11.7 7l9.3 5.4-3.4 4.5z" />
        </svg>
      ),
      textMain: "TẢI VỀ TỪ",
      textSub: "Google Play",
    },
    ios: {
      href: "https://apps.apple.com/app/tickethub/id123456789",
      className:
        "bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 h-12 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500/40",
      icon: (
        <svg
          className="h-6 w-6 text-white"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M14.5 3.5c1.6-.7 3.4.2 4.8 1.4-1.8.9-3.1 2.7-2.8 4.8 1.8.2 3.3 1.8 3.9 3.5-1.1 1.6-2.4 3.4-4.5 3.4-1 0-1.7-.4-2.4-.4-.8 0-1.5.4-2.5.4-2.1 0-4.8-3.5-4.8-7.8 0-3.5 2.3-5.3 4.4-5.3 1.4 0 2.5.8 3.1.8.6 0 1.5-.6 2.8-.8z M14.9 0c.1 2.1-1.3 4-3 4.7-1.5-1.8-1.1-4.3.7-5.3.8-.4 1.6-.4 2.3.6z" />
        </svg>
      ),
      textMain: "TẢI VỀ TRÊN",
      textSub: "App Store",
    },
  };

  const store = storeData[type];

  return (
    <a
      href={store.href}
      target="_blank"
      rel="noopener noreferrer"
      className={store.className}
      aria-label={`Tải về từ ${type === "ios" ? "App Store" : "Google Play"}`}
    >
      {store.icon}
      <div className="flex flex-col items-start">
        <span className="text-white text-xs opacity-90">{store.textMain}</span>
        <span className="text-white text-sm font-medium">{store.textSub}</span>
      </div>
    </a>
  );
});

AppStoreButton.displayName = "AppStoreButton";

// Newsletter subscription form
const NewsletterForm = memo(() => (
  <div className="space-y-4">
    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
      <Mail className="h-6 w-6 text-orange-500" />
      Đăng Ký Nhận Thông Báo
    </h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">
      Nhận tin tức và cập nhật mới nhất vào hộp thư của bạn
    </p>
    <form className="flex flex-col sm:flex-row gap-2">
      <input
        type="email"
        placeholder="Nhập email của bạn"
        className="flex-1 px-4 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
          focus:outline-none focus:ring-2 focus:ring-orange-500/40 text-gray-900 dark:text-gray-100"
        required
        aria-label="Email cho bản tin"
      />
      <button
        type="submit"
        className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors 
          font-medium shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500/40"
      >
        Đăng Ký
      </button>
    </form>
    <p className="text-xs text-gray-500 dark:text-gray-500">
      Bằng việc đăng ký, bạn đồng ý với Chính sách Quyền riêng tư của chúng tôi
    </p>
  </div>
));

NewsletterForm.displayName = "NewsletterForm";

// Section header
const SectionHeader = memo(({ title, icon: Icon }) => (
  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-6">
    {Icon && <Icon className="h-6 w-6 text-orange-500" />}
    {title}
  </h3>
));

SectionHeader.displayName = "SectionHeader";

// Contact Info Item
const ContactItem = memo(({ icon: Icon, text }) => (
  <div className="flex items-start gap-3">
    <Icon className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
    <span className="text-sm text-gray-600 dark:text-gray-400">{text}</span>
  </div>
));

ContactItem.displayName = "ContactItem";

// Main Footer Component
const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Footer links grouped by category
  const footerLinks = {
    company: [
      { label: "Về Chúng Tôi", href: "/about", icon: Info },
      { label: "Liên Hệ", href: "/contact", icon: Mail },
      { label: "Tuyển Dụng", href: "/careers", icon: User },
      { label: "Tin Tức", href: "/blog", icon: FileText },
      { label: "Đối Tác", href: "/partners", icon: Award },
    ],
    support: [
      { label: "Trung Tâm Trợ Giúp", href: "/help", icon: HelpCircle },
      { label: "Câu Hỏi Thường Gặp", href: "/faq", icon: HelpCircle },
      { label: "Bảo Đảm Vé", href: "/guarantees", icon: Shield },
      { label: "Liên Hệ Hỗ Trợ", href: "/support", icon: Phone },
      { label: "Chính Sách Hoàn Tiền", href: "/refunds", icon: CreditCard },
    ],
    legal: [
      { label: "Điều Khoản Dịch Vụ", href: "/terms", icon: FileText },
      { label: "Chính Sách Quyền Riêng Tư", href: "/privacy", icon: Lock },
      { label: "Chính Sách Cookie", href: "/cookies", icon: Lock },
      { label: "Trợ Năng", href: "/accessibility", icon: User },
    ],
  };

  // Social media links
  const socialLinks = [
    {
      icon: Facebook,
      href: "https://facebook.com",
      label: "Facebook",
      gradient: "bg-gradient-to-r from-blue-600 to-blue-500",
    },
    {
      icon: Twitter,
      href: "https://twitter.com",
      label: "Twitter",
      gradient: "bg-gradient-to-r from-blue-400 to-blue-300",
    },
    {
      icon: Instagram,
      href: "https://instagram.com",
      label: "Instagram",
      gradient: "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500",
    },
    {
      icon: Settings,
      href: "https://tiktok.com",
      label: "TikTok",
      gradient: "bg-gradient-to-r from-gray-900 to-gray-800",
    },
  ];

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Company Information */}
          <div className="lg:col-span-3 space-y-6">
            {/* Logo and Tagline */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">TH</span>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  TicketHub
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Kết nối người hâm mộ với sự kiện
                </div>
              </div>
            </div>

            {/* Company Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Nền tảng đáng tin cậy của bạn để tìm và đặt vé cho các sự kiện tốt
              nhất trên toàn quốc.
            </p>

            {/* Contact Information */}
            <div className="space-y-3 pt-4">
              <ContactItem
                icon={MapPin}
                text="123 Đường Sự Kiện, Tầng 3, Quận 1, TP. Hồ Chí Minh"
              />
              <ContactItem icon={Phone} text="(+84) 123-456-789" />
              <ContactItem icon={Mail} text="hotro@tickethub.com" />
              <ContactItem icon={Clock} text="Thứ Hai-Thứ Sáu: 8:30-17:30" />
              <ContactItem icon={Globe} text="Có mặt tại hơn 30 tỉnh thành" />
            </div>
          </div>

          {/* Quick Links - Company */}
          <div className="lg:col-span-2 space-y-6">
            <SectionHeader title="Công Ty" />
            <div className="space-y-1">
              {footerLinks.company.map((link) => (
                <FooterLink key={link.label} href={link.href} icon={link.icon}>
                  {link.label}
                </FooterLink>
              ))}
            </div>
          </div>

          {/* Quick Links - Support */}
          <div className="lg:col-span-2 space-y-6">
            <SectionHeader title="Hỗ Trợ" />
            <div className="space-y-1">
              {footerLinks.support.map((link) => (
                <FooterLink key={link.label} href={link.href} icon={link.icon}>
                  {link.label}
                </FooterLink>
              ))}
            </div>
          </div>

          {/* Legal Links */}
          <div className="lg:col-span-2 space-y-6">
            <SectionHeader title="Pháp Lý" />
            <div className="space-y-1">
              {footerLinks.legal.map((link) => (
                <FooterLink key={link.label} href={link.href} icon={link.icon}>
                  {link.label}
                </FooterLink>
              ))}
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="lg:col-span-3 space-y-6">
            <NewsletterForm />
          </div>
        </div>

        {/* Secondary Footer */}
        <div className="pt-8 pb-12">
          {/* Social Media Links */}
          <div className="border-t border-gray-200 dark:border-gray-800 pt-8 pb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Kết Nối Với Chúng Tôi
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {socialLinks.map((social) => (
                <SocialIcon
                  key={social.label}
                  icon={social.icon}
                  href={social.href}
                  label={social.label}
                  gradient={social.gradient}
                />
              ))}
            </div>
          </div>

          {/* App Download Section */}
          <div className="border-t border-gray-200 dark:border-gray-800 pt-8 pb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Tải Ứng Dụng Di Động
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
                  Nhận ưu đãi độc quyền và quản lý vé của bạn mọi lúc mọi nơi
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <AppStoreButton type="ios" />
                <AppStoreButton type="android" />
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 flex flex-wrap items-center gap-2">
                <div>© {currentYear} TicketHub. Tất cả quyền được bảo lưu.</div>
                <div className="hidden md:block">•</div>
                <div>Thanh toán an toàn được cung cấp bởi Stripe</div>
              </div>

              <div className="flex items-center gap-6">
                {[
                  { name: "Điều Khoản", path: "terms" },
                  { name: "Quyền Riêng Tư", path: "privacy" },
                  { name: "Cookie", path: "cookies" },
                  { name: "Sơ Đồ", path: "sitemap" },
                ].map((item) => (
                  <a
                    key={item.name}
                    href={`/${item.path}`}
                    className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-orange-500 
                      dark:hover:text-orange-400 transition-all duration-300 focus:outline-none focus:text-orange-500"
                  >
                    {item.name}
                  </a>
                ))}

                {/* Language Selector */}
                <div className="relative group">
                  <button
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 
                    hover:text-orange-500 dark:hover:text-orange-400 transition-all duration-300
                    focus:outline-none focus:text-orange-500"
                  >
                    <Globe className="h-4 w-4" />
                    <span>Tiếng Việt</span>
                    <ChevronRight className="h-3 w-3 transform rotate-90 group-hover:rotate-[270deg] transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
