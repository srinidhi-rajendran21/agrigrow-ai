import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Leaf, AlertTriangle, CheckCircle } from "lucide-react";
import diseaseIcon from "@/assets/disease-detect-icon.png";

interface DetectionResult {
  disease: string;
  confidence: number;
  treatment: string;
  severity: "low" | "medium" | "high";
}

const MOCK_RESULT: DetectionResult = {
  disease: "Leaf Blight (Bacterial)",
  confidence: 92,
  treatment:
    "1. Remove infected leaves immediately\n2. Apply copper-based fungicide\n3. Ensure proper drainage\n4. Space plants for better airflow\n5. Avoid overhead irrigation",
  severity: "medium",
};

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
      analyzeImage();
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult(MOCK_RESULT);
    }, 2500);
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setIsAnalyzing(false);
  };

  const severityColor = {
    low: "text-primary",
    medium: "text-sun",
    high: "text-destructive",
  };

  return (
    <div className="min-h-screen px-4 pb-24 pt-6 md:pt-20">
      <div className="mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
          <img src={diseaseIcon} alt="" className="mx-auto h-16 w-16 mb-3" />
          <h1 className="font-heading text-2xl font-extrabold text-foreground">Disease Detection</h1>
          <p className="mt-1 text-sm text-muted-foreground">Upload a leaf or plant photo to identify diseases</p>
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
              className="glass-elevated flex flex-col items-center justify-center gap-4 p-12 cursor-pointer border-2 border-dashed border-primary/30 hover:border-primary/60 transition-colors"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-heading font-bold text-foreground">Drag & drop or tap to upload</p>
                <p className="mt-1 text-sm text-muted-foreground">Supports JPG, PNG up to 10MB</p>
              </div>
              <input id="file-input" type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              {/* Image Preview */}
              <div className="glass-elevated relative overflow-hidden">
                <button
                  onClick={reset}
                  className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-foreground/60 text-background backdrop-blur-sm hover:bg-foreground/80 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                <img src={image} alt="Uploaded plant" className="w-full rounded-xl object-cover max-h-[300px]" />
                {isAnalyzing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm">
                    <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                    <p className="mt-3 font-heading font-bold text-foreground">Analyzing plant...</p>
                  </div>
                )}
              </div>

              {/* Result */}
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="glass-elevated p-6 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={`h-5 w-5 ${severityColor[result.severity]}`} />
                        <h3 className="font-heading text-lg font-bold text-foreground">{result.disease}</h3>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Confidence: <span className="font-bold text-primary">{result.confidence}%</span>
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                        result.severity === "low"
                          ? "bg-accent text-accent-foreground"
                          : result.severity === "medium"
                          ? "bg-sun-light text-sun"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {result.severity} severity
                    </span>
                  </div>

                  <div className="rounded-xl bg-leaf-light p-4">
                    <h4 className="flex items-center gap-2 font-heading font-bold text-accent-foreground mb-2">
                      <CheckCircle className="h-4 w-4" />
                      Treatment Steps
                    </h4>
                    <div className="space-y-2">
                      {result.treatment.split("\n").map((step, i) => (
                        <p key={i} className="text-sm text-accent-foreground">
                          {step}
                        </p>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={reset}
                    className="w-full rounded-xl gradient-hero py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
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
