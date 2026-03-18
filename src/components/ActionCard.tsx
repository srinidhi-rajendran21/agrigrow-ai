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
}

const ActionCard = ({ icon: Icon, title, description, to, gradient, delay = 0 }: ActionCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(to)}
      className={`${gradient} group relative flex flex-col items-center gap-3 rounded-2xl p-6 text-primary-foreground shadow-lg transition-shadow hover:shadow-xl min-h-[160px] w-full`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-foreground/20 backdrop-blur-sm">
        <Icon className="h-7 w-7" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-heading font-bold">{title}</h3>
        <p className="mt-1 text-sm opacity-90">{description}</p>
      </div>
    </motion.button>
  );
};

export default ActionCard;
