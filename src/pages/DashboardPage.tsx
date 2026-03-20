import { motion } from "framer-motion";
import { Bookmark, Clock, Lightbulb, TrendingUp, Droplets, Sprout, IndianRupee } from "lucide-react";
import WeatherCard from "@/components/WeatherCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

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
  { icon: Sprout, label: "Active Crops", value: "4", color: "bg-accent text-primary" },
  { icon: IndianRupee, label: "This Month", value: "₹14,000", color: "bg-sun-light text-secondary" },
  { icon: Droplets, label: "Water Usage", value: "85%", color: "bg-sky-light text-sky" },
  { icon: TrendingUp, label: "Yield Growth", value: "+12%", color: "bg-leaf-light text-leaf" },
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

const DashboardPage = () => {
  return (
    <div className="min-h-screen px-4 pb-24 pt-6 md:pt-20">
      <div className="mx-auto max-w-4xl space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-2xl font-black text-foreground"
        >
          Dashboard
        </motion.h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {statsCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-elevated p-4 flex flex-col items-center text-center"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <p className="mt-2 font-heading text-xl font-black text-foreground">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <WeatherCard />

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-elevated p-5"
          >
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-elevated p-5"
          >
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
          </motion.div>
        </div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-elevated p-5"
        >
          <h3 className="flex items-center gap-2 font-heading text-sm font-bold text-foreground mb-3">
            <Lightbulb className="h-4 w-4 text-sun" />
            Farming Tips
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {tips.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.05 }}
                className="flex items-start gap-2.5 rounded-xl bg-muted p-3"
              >
                <span className="text-lg">{tip.emoji}</span>
                <p className="text-xs text-foreground leading-relaxed">{tip.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Queries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-elevated p-5"
        >
          <h3 className="flex items-center gap-2 font-heading text-sm font-bold text-foreground mb-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Recent Queries
          </h3>
          <div className="space-y-2">
            {recentQueries.map((q, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl bg-muted p-3">
                <p className="text-xs text-foreground">{q.q}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">{q.time}</span>
                  <Bookmark className="h-3.5 w-3.5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
