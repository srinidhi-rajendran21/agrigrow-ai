import { motion } from "framer-motion";

interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (q: string) => void;
}

const SuggestedQuestions = ({ questions, onSelect }: SuggestedQuestionsProps) => {
  if (!questions.length) return null;

  return (
    <div className="flex flex-wrap gap-2 px-1">
      {questions.map((q, i) => (
        <motion.button
          key={q}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, type: "spring", stiffness: 150 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(q)}
          className="rounded-2xl border border-border bg-card/90 px-3.5 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:border-primary/30 hover:text-primary"
        >
          {q}
        </motion.button>
      ))}
    </div>
  );
};

export default SuggestedQuestions;
