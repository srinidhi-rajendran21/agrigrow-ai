import { motion } from "framer-motion";
import { Cloud, Droplets, Sun, Thermometer, Wind } from "lucide-react";

const WeatherCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-elevated p-6"
    >
      <h3 className="font-heading text-lg font-bold text-foreground mb-4 flex items-center gap-2">
        <Sun className="h-5 w-5 text-sun" />
        Today's Weather
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 rounded-xl bg-sun-light p-3">
          <Thermometer className="h-5 w-5 text-sun" />
          <div>
            <p className="text-xs text-muted-foreground">Temperature</p>
            <p className="font-heading font-bold text-foreground">32°C</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-sky-light p-3">
          <Droplets className="h-5 w-5 text-sky" />
          <div>
            <p className="text-xs text-muted-foreground">Humidity</p>
            <p className="font-heading font-bold text-foreground">68%</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
          <Wind className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Wind</p>
            <p className="font-heading font-bold text-foreground">12 km/h</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-accent p-3">
          <Cloud className="h-5 w-5 text-accent-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Condition</p>
            <p className="font-heading font-bold text-foreground">Partly Cloudy</p>
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-leaf-light p-3">
        <p className="text-sm text-accent-foreground font-medium">
          🌱 <span className="font-bold">Farming Tip:</span> Good day for irrigation. Low wind speed is ideal for pesticide spraying.
        </p>
      </div>
    </motion.div>
  );
};

export default WeatherCard;
