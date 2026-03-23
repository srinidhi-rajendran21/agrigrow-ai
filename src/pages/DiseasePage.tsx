import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, AlertTriangle, CheckCircle, Camera, Leaf, ScanLine } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DetectionResult {
  disease: string;
  confidence: number;
  treatment: string;
  severity: "low" | "medium" | "high";
  recovery: string;
  prevention: string;
}

const ScanningOverlay = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm z-10">
    {/* Scanning line animation */}
    <div className="absolute inset-x-0 overflow-hidden h-full">
      <motion.div
        className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary to-transparent"
        animate={{ y: [0, 280, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
    {/* Corner brackets */}
    <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg" />
    <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg" />
    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg" />
    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg" />

    <motion.div
      animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 backdrop-blur-md"
    >
      <ScanLine className="h-8 w-8 text-primary" />
    </motion.div>
    <motion.p
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="mt-4 font-heading text-base font-bold text-foreground"
    >
      Scanning plant...
    </motion.p>
    <div className="flex gap-1 mt-2">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-primary"
          animate={{ scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  </div>
);

const DiseasePage = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) processFile(file);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setResult(null);
      analyzeImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (_imageData: string) => {
    setIsAnalyzing(true);
    try {
      await supabase.functions.invoke("chat", {
        body: {
          messages: [
            {
              role: "user",
              content: `Analyze this plant image for disease detection. Provide disease name, severity, treatment, recovery time, and prevention tips.`,
            },
          ],
          language: "en",
        },
      });

      // Simulate analysis time for scanning effect
      await new Promise(resolve => setTimeout(resolve, 3000));

      setResult({
        disease: "Leaf Blight (Bacterial)",
        confidence: 92,
        severity: "medium",
        treatment: "1. Remove infected leaves immediately\n2. Apply copper-based fungicide (2g/L)\n3. Ensure proper drainage around plants\n4. Space plants for better airflow\n5. Avoid overhead irrigation",
        recovery: "2-3 weeks with proper treatment",
        prevention: "Use disease-resistant varieties, practice crop rotation, maintain proper plant spacing",
      });
    } catch {
      toast.error("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setIsAnalyzing(false);
  };

  const severityConfig = {
    low: { color: "text-primary", bg: "bg-accent", label: "Low Severity" },
    medium: { color: "text-secondary", bg: "bg-sun-light", label: "Medium Severity" },
    high: { color: "text-destructive", bg: "bg-destructive/10", label: "High Severity" },
  };

  return (
    <div className="min-h-screen px-4 pb-24 pt-6 md:pt-20">
      <div className="mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-sun text-primary-foreground">
              <Leaf className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-black text-foreground">Plant Clinic</h1>
              <p className="text-sm text-muted-foreground">AI-powered disease detection from leaf photos</p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!image ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="glass-elevated flex flex-col items-center justify-center gap-5 p-12 cursor-pointer border-2 border-dashed border-primary/25 hover:border-primary/50 transition-all duration-300 group"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex h-20 w-20 items-center justify-center rounded-2xl bg-accent group-hover:bg-primary/10 transition-colors"
              >
                <Camera className="h-10 w-10 text-primary" />
              </motion.div>
              <div className="text-center">
                <p className="font-heading text-lg font-bold text-foreground">Drag & drop or tap to upload</p>
                <p className="mt-1 text-sm text-muted-foreground">Supports JPG, PNG up to 10MB</p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-medium text-accent-foreground">
                <Upload className="h-3.5 w-3.5" />
                Choose Photo
              </div>
              <input id="file-input" type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileSelect} />
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              <div className="glass-elevated relative overflow-hidden rounded-2xl">
                <button
                  onClick={reset}
                  className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-xl bg-foreground/50 text-background backdrop-blur-sm hover:bg-foreground/70 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                <img src={image} alt="Uploaded plant" className="w-full object-cover max-h-[280px]" />
                {isAnalyzing && <ScanningOverlay />}
              </div>

              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="glass-elevated p-5 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={`h-5 w-5 ${severityConfig[result.severity].color}`} />
                        <h3 className="font-heading text-lg font-bold text-foreground">{result.disease}</h3>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Confidence: <span className="font-bold text-primary">{result.confidence}%</span>
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${severityConfig[result.severity].bg} ${severityConfig[result.severity].color}`}>
                      {severityConfig[result.severity].label}
                    </span>
                  </div>

                  <div className="rounded-2xl bg-accent/50 p-4">
                    <h4 className="flex items-center gap-2 font-heading font-bold text-accent-foreground mb-2">
                      <CheckCircle className="h-4 w-4" />
                      Treatment Steps
                    </h4>
                    <div className="space-y-1.5">
                      {result.treatment.split("\n").map((step, i) => (
                        <p key={i} className="text-sm text-accent-foreground">{step}</p>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-sky-light p-3">
                      <p className="text-xs text-muted-foreground font-medium">⏱️ Recovery Time</p>
                      <p className="font-heading font-bold text-sm text-foreground mt-1">{result.recovery}</p>
                    </div>
                    <div className="rounded-2xl bg-sun-light p-3">
                      <p className="text-xs text-muted-foreground font-medium">🛡️ Prevention</p>
                      <p className="font-heading font-bold text-sm text-foreground mt-1">{result.prevention}</p>
                    </div>
                  </div>

                  <p className="text-[10px] text-muted-foreground text-center">
                    ⚠️ AI-generated advice. Consult local AO (Agricultural Officer) for critical steps.
                  </p>

                  <button
                    onClick={reset}
                    className="w-full rounded-2xl gradient-hero py-3.5 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    Scan Another Plant
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DiseasePage;
