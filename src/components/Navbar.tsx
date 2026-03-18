import { motion } from "framer-motion";
import { Home, LayoutDashboard, Leaf, MessageCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/chat", icon: MessageCircle, label: "Chat" },
  { to: "/detect", icon: Leaf, label: "Detect" },
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/90 backdrop-blur-lg md:top-0 md:bottom-auto">
      <div className="mx-auto flex max-w-5xl items-center justify-around px-4 py-2 md:py-3">
        <Link to="/" className="hidden md:block">
          <span className="font-heading text-xl font-extrabold text-gradient-hero">🌾 FarmAI</span>
        </Link>
        <div className="flex items-center gap-1 md:gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative flex flex-col items-center gap-0.5 rounded-xl px-4 py-2 text-xs font-medium transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-xl bg-accent"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className="relative z-10 h-5 w-5" />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
