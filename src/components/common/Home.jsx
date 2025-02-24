// Button.jsx
export const Button = ({ children, variant = "primary", ...props }) => {
  const baseStyle =
    "px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2";
  const variants = {
    primary: "bg-orange-500 text-white hover:bg-orange-600",
    secondary: "bg-white/10 text-white hover:bg-white/20",
    outlined: "border border-orange-500 text-orange-500 hover:bg-orange-50",
  };
  return (
    <button className={`${baseStyle} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
};

// SectionTitle.jsx
export const SectionTitle = ({ title, subtitle, className = "" }) => (
  <div className={`text-center mb-16 ${className}`}>
    <h2 className="text-4xl font-bold mb-4">{title}</h2>
    {subtitle && (
      <p className="text-xl text-gray-600 dark:text-gray-300">{subtitle}</p>
    )}
  </div>
);

// Card.jsx
export const Card = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-gray-700 rounded-xl p-6 ${className}`}>
    {children}
  </div>
);

// Container.jsx
export const Container = ({ children, className = "" }) => (
  <div className={`container mx-auto px-6 ${className}`}>{children}</div>
);

// NewsletterForm.jsx
export const NewsletterForm = ({
  className = "",
  buttonText = "Subscribe",
  buttonVariant = "primary",
  placeholder = "Enter your email",
  dark = false,
  onSubmit,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    onSubmit?.(email);
  };

  return (
    <div className={`flex gap-4 max-w-md mx-auto ${className}`}>
      <input
        type="email"
        name="email"
        placeholder={placeholder}
        className={`flex-1 px-6 py-3 rounded-lg focus:outline-none focus:ring-2 
        ${
          dark
            ? "bg-white/10 text-white placeholder-white/60 focus:ring-white/20"
            : "bg-white text-gray-900 placeholder-gray-500 focus:ring-orange-500/20 border border-gray-200"
        }`}
      />
      <Button type="submit" variant={buttonVariant} onClick={handleSubmit}>
        {buttonText}
      </Button>
    </div>
  );
};
