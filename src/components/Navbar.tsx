import { motion } from "framer-motion";
import { Home, LayoutDashboard, Leaf, MessageCircle, TrendingUp } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/chat", icon: MessageCircle, label: "Chat" },
  { to: "/detect", icon: Leaf, label: "Detect" },
  { to: "/prices", icon: TrendingUp, label: "Prices" },
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-xl md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-1.5 md:py-2.5">
        <Link to="/" className="hidden md:flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-hero">
            <span className="text-lg">🌾</span>
          </div>
          <span className="font-heading text-lg font-extrabold text-gradient-hero">FarmAI</span>
        </Link>
        <div className="flex w-full md:w-auto items-center justify-around md:justify-end md:gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative flex flex-col items-center gap-0.5 rounded-2xl px-3 md:px-4 py-2 text-[11px] md:text-xs font-medium transition-all duration-200 ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-2xl bg-accent"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <item.icon className={`relative z-10 h-5 w-5 transition-transform duration-200 ${isActive ? "scale-110" : ""}`} />
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
