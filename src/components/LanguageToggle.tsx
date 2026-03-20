import { motion } from "framer-motion";

interface LanguageToggleProps {
  language: string;
  onToggle: (lang: string) => void;
}

const LanguageToggle = ({ language, onToggle }: LanguageToggleProps) => {
  return (
    <div className="flex items-center rounded-full bg-muted p-0.5 text-xs font-medium">
      <button
        onClick={() => onToggle("en")}
        className={`relative rounded-full px-3 py-1 transition-colors ${
          language === "en" ? "text-primary-foreground" : "text-muted-foreground"
        }`}
      >
        {language === "en" && (
          <motion.div
            layoutId="lang-toggle"
            className="absolute inset-0 rounded-full gradient-hero"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <span className="relative z-10">EN</span>
      </button>
      <button
        onClick={() => onToggle("ta")}
        className={`relative rounded-full px-3 py-1 transition-colors ${
          language === "ta" ? "text-primary-foreground" : "text-muted-foreground"
        }`}
      >
        {language === "ta" && (
          <motion.div
            layoutId="lang-toggle"
            className="absolute inset-0 rounded-full gradient-hero"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <span className="relative z-10">தமிழ்</span>
      </button>
    </div>
  );
};

export default LanguageToggle;
