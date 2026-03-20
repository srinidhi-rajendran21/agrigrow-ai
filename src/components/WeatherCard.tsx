import { motion } from "framer-motion";
import { Cloud, Droplets, Sun, Thermometer, Wind } from "lucide-react";

const WeatherCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-elevated p-5 overflow-hidden relative"
    >
      {/* Subtle background decoration */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-sun/5" />

      <h3 className="font-heading text-sm font-bold text-foreground mb-3 flex items-center gap-2 relative z-10">
        <Sun className="h-4 w-4 text-sun" />
        Today's Weather
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
        <div className="flex items-center gap-2.5 rounded-xl bg-sun-light p-3">
          <Thermometer className="h-4 w-4 text-sun shrink-0" />
          <div>
            <p className="text-[10px] text-muted-foreground">Temp</p>
            <p className="font-heading text-sm font-bold text-foreground">32°C</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-xl bg-sky-light p-3">
          <Droplets className="h-4 w-4 text-sky shrink-0" />
          <div>
            <p className="text-[10px] text-muted-foreground">Humidity</p>
            <p className="font-heading text-sm font-bold text-foreground">68%</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-xl bg-muted p-3">
          <Wind className="h-4 w-4 text-muted-foreground shrink-0" />
          <div>
            <p className="text-[10px] text-muted-foreground">Wind</p>
            <p className="font-heading text-sm font-bold text-foreground">12 km/h</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-xl bg-accent p-3">
          <Cloud className="h-4 w-4 text-accent-foreground shrink-0" />
          <div>
            <p className="text-[10px] text-muted-foreground">Condition</p>
            <p className="font-heading text-sm font-bold text-foreground">Partly Cloudy</p>
          </div>
        </div>
      </div>
      <div className="mt-3 rounded-xl bg-leaf-light p-3 relative z-10">
        <p className="text-xs text-accent-foreground font-medium leading-relaxed">
          🌱 <span className="font-bold">Farming Tip:</span> Good day for irrigation. Low wind speed is ideal for pesticide spraying.
        </p>
      </div>
    </motion.div>
  );
};

export default WeatherCard;
