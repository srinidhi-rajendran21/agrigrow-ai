import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  to: string;
  gradient: string;
  delay?: number;
  emoji?: string;
}

const ActionCard = ({ icon: Icon, title, description, to, gradient, delay = 0, emoji }: ActionCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, type: "spring", stiffness: 120 }}
      whileHover={{ scale: 1.04, y: -6 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(to)}
      className={`${gradient} group relative flex items-start gap-4 rounded-2xl p-5 text-primary-foreground shadow-lg transition-shadow hover:shadow-xl w-full overflow-hidden`}
    >
      {/* Background decoration */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary-foreground/10" />
      <div className="absolute -right-2 -bottom-8 h-16 w-16 rounded-full bg-primary-foreground/5" />
      
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/20 backdrop-blur-sm">
        {emoji ? <span className="text-2xl">{emoji}</span> : <Icon className="h-6 w-6" />}
      </div>
      <div className="text-left relative z-10">
        <h3 className="text-base font-heading font-bold leading-tight">{title}</h3>
        <p className="mt-1 text-xs opacity-85 leading-relaxed">{description}</p>
      </div>
    </motion.button>
  );
};

export default ActionCard;
