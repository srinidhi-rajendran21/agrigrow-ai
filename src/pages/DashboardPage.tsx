import { motion } from "framer-motion";
import { Bookmark, Clock, Lightbulb, TrendingUp, Droplets, Sprout, IndianRupee, Thermometer, Beaker, Waves, Wifi } from "lucide-react";
import WeatherCard from "@/components/WeatherCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, AreaChart, Area } from "recharts";
import { useState, useEffect } from "react";

const yieldData = [
  { month: "Jan", yield: 12 },
  { month: "Feb", yield: 19 },
  { month: "Mar", yield: 15 },
  { month: "Apr", yield: 22 },
  { month: "May", yield: 28 },
  { month: "Jun", yield: 24 },
];

const earningsData = [
  { month: "Jan", earnings: 8000 },
  { month: "Feb", earnings: 12000 },
  { month: "Mar", earnings: 9500 },
  { month: "Apr", earnings: 15000 },
  { month: "May", earnings: 18000 },
  { month: "Jun", earnings: 14000 },
];

const statsCards = [
  { icon: Sprout, label: "Active Crops", value: "4", color: "gradient-hero" },
  { icon: IndianRupee, label: "This Month", value: "₹14,000", color: "gradient-sun" },
  { icon: Droplets, label: "Water Usage", value: "85%", color: "gradient-water" },
  { icon: TrendingUp, label: "Yield Growth", value: "+12%", color: "gradient-sky" },
];

const tips = [
  { emoji: "💧", text: "Water paddy fields early morning for best absorption" },
  { emoji: "🌿", text: "Neem oil spray every 15 days prevents most pests" },
  { emoji: "🧪", text: "Test soil pH before planting — ideal range is 6.0-7.0" },
  { emoji: "🌾", text: "Rotate crops each season to maintain soil health" },
];

const recentQueries = [
  { q: "Best crop for red soil in Tamil Nadu?", time: "2h ago" },
  { q: "How to treat yellow leaf curl?", time: "5h ago" },
  { q: "PM-KISAN eligibility check", time: "1d ago" },
];

// Live sensor simulation
const useSensorData = () => {
  const [sensors, setSensors] = useState({
    soilMoisture: 62,
    soilPH: 6.5,
    temperature: 28.3,
    humidity: 74,
  });
  const [history, setHistory] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      time: `${i * 2}h`,
      moisture: 55 + Math.random() * 20,
      temp: 24 + Math.random() * 8,
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(prev => ({
        soilMoisture: Math.max(30, Math.min(90, prev.soilMoisture + (Math.random() - 0.5) * 4)),
        soilPH: Math.max(5, Math.min(8, prev.soilPH + (Math.random() - 0.5) * 0.2)),
        temperature: Math.max(20, Math.min(40, prev.temperature + (Math.random() - 0.5) * 1)),
        humidity: Math.max(40, Math.min(95, prev.humidity + (Math.random() - 0.5) * 3)),
      }));
      setHistory(prev => [
        ...prev.slice(1),
        { time: "now", moisture: 55 + Math.random() * 20, temp: 24 + Math.random() * 8 },
      ]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return { sensors, history };
};

const BentoCard = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, type: "spring", stiffness: 150 }}
    className={`glass-elevated p-5 ${className}`}
  >
    {children}
  </motion.div>
);

const SensorGauge = ({ value, max, label, icon: Icon, unit, color }: {
  value: number; max: number; label: string; icon: any; unit: string; color: string;
}) => {
  const pct = (value / max) * 100;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-16 w-16">
        <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="3"
          />
          <motion.path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeDasharray={`${pct}, 100`}
            initial={{ strokeDasharray: "0, 100" }}
            animate={{ strokeDasharray: `${pct}, 100` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="h-4 w-4" style={{ color }} />
        </div>
      </div>
      <div className="text-center">
        <p className="font-heading text-lg font-black text-foreground">{value.toFixed(1)}{unit}</p>
        <p className="text-[10px] text-muted-foreground font-medium">{label}</p>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { sensors, history } = useSensorData();

  return (
    <div className="min-h-screen px-4 pb-24 pt-6 md:pt-20">
      <div className="mx-auto max-w-5xl space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-2xl font-black text-foreground"
        >
          Dashboard
        </motion.h1>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {statsCards.map((stat, i) => (
            <BentoCard key={stat.label} delay={i * 0.08}>
              <div className="flex flex-col items-center text-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color} text-primary-foreground`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <p className="mt-2 font-heading text-xl font-black text-foreground">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground font-medium">{stat.label}</p>
              </div>
            </BentoCard>
          ))}
        </div>

        {/* Bento Row: Weather + Sensor Widget */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="md:col-span-2">
            <WeatherCard />
          </div>

          {/* IoT Sensor Widget */}
          <BentoCard className="md:col-span-3" delay={0.2}>
            <h3 className="font-heading text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Wifi className="h-4 w-4 text-primary" />
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
              </div>
              Live Field Sensors
              <span className="ml-auto text-[10px] font-normal text-muted-foreground bg-muted rounded-full px-2 py-0.5">IoT Preview</span>
            </h3>
            <div className="grid grid-cols-4 gap-3 mb-4">
              <SensorGauge value={sensors.soilMoisture} max={100} label="Soil Moisture" icon={Droplets} unit="%" color="hsl(195, 70%, 45%)" />
              <SensorGauge value={sensors.soilPH} max={14} label="Soil pH" icon={Beaker} unit="" color="hsl(145, 58%, 32%)" />
              <SensorGauge value={sensors.temperature} max={50} label="Temperature" icon={Thermometer} unit="°C" color="hsl(38, 90%, 52%)" />
              <SensorGauge value={sensors.humidity} max={100} label="Humidity" icon={Waves} unit="%" color="hsl(205, 65%, 48%)" />
            </div>
            <div className="h-20">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="moistureGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(195, 70%, 45%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(195, 70%, 45%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="moisture" stroke="hsl(195, 70%, 45%)" fill="url(#moistureGrad)" strokeWidth={1.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </BentoCard>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <BentoCard delay={0.25}>
            <h3 className="font-heading text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Yield Trend (quintals)
            </h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={yieldData}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="yield" fill="hsl(145, 58%, 32%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </BentoCard>

          <BentoCard delay={0.3}>
            <h3 className="font-heading text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-secondary" />
              Earnings (₹)
            </h3>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(120, 12%, 87%)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="earnings" stroke="hsl(38, 90%, 52%)" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </BentoCard>
        </div>

        {/* Tips + Recent Queries Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <BentoCard delay={0.35}>
            <h3 className="flex items-center gap-2 font-heading text-sm font-bold text-foreground mb-3">
              <Lightbulb className="h-4 w-4 text-sun" />
              Farming Tips
            </h3>
            <div className="space-y-2">
              {tips.map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="flex items-start gap-2.5 rounded-xl bg-muted/50 p-3"
                >
                  <span className="text-lg">{tip.emoji}</span>
                  <p className="text-xs text-foreground leading-relaxed">{tip.text}</p>
                </motion.div>
              ))}
            </div>
          </BentoCard>

          <BentoCard delay={0.4}>
            <h3 className="flex items-center gap-2 font-heading text-sm font-bold text-foreground mb-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Recent Queries
            </h3>
            <div className="space-y-2">
              {recentQueries.map((q, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-muted/50 p-3">
                  <p className="text-xs text-foreground">{q.q}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">{q.time}</span>
                    <Bookmark className="h-3.5 w-3.5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
