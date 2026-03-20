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
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          onClick={() => onSelect(q)}
          className="rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-accent hover:border-primary/30"
        >
          {q}
        </motion.button>
      ))}
    </div>
  );
};

export default SuggestedQuestions;
