import { motion, AnimatePresence } from "framer-motion";
import { Landmark, Filter, MapPin, Users, ExternalLink, ChevronDown, Search } from "lucide-react";
import { useState, useMemo } from "react";

const SCHEMES = [
  {
    name: "PM-KISAN",
    fullName: "Pradhan Mantri Kisan Samman Nidhi",
    benefits: "₹6,000/year in 3 installments directly to bank account",
    eligibility: "All landholding farmers' families",
    farmerType: ["small", "marginal", "medium"],
    locations: ["All Tamil Nadu"],
    steps: ["Visit pmkisan.gov.in", "Register with Aadhaar & land records", "Verify through local AO", "Receive funds in 3 installments"],
    emoji: "💰",
    category: "Income Support",
  },
  {
    name: "PM Fasal Bima Yojana",
    fullName: "Pradhan Mantri Fasal Bima Yojana",
    benefits: "Crop insurance at 2% premium for Kharif, 1.5% for Rabi crops",
    eligibility: "All farmers growing notified crops",
    farmerType: ["small", "marginal", "medium"],
    locations: ["All Tamil Nadu"],
    steps: ["Apply through bank/CSC/online portal", "Pay minimal premium", "Report crop loss within 72 hours", "Receive claim in bank account"],
    emoji: "🛡️",
    category: "Insurance",
  },
  {
    name: "PMKSY",
    fullName: "Pradhan Mantri Krishi Sinchayee Yojana",
    benefits: "Micro-irrigation subsidy up to 55% for small farmers, 45% for others",
    eligibility: "Farmers with own/leased land",
    farmerType: ["small", "marginal"],
    locations: ["Coimbatore", "Erode", "Salem", "Madurai", "Trichy"],
    steps: ["Apply at agriculture department", "Submit land documents", "Get drip/sprinkler system installed", "Claim subsidy reimbursement"],
    emoji: "💧",
    category: "Irrigation",
  },
  {
    name: "TN Uzhavar Pathukaapu Thittam",
    fullName: "Tamil Nadu Farmers Protection Scheme",
    benefits: "Free life & accident insurance, ₹1 lakh coverage",
    eligibility: "Registered farmers in Tamil Nadu aged 18-65",
    farmerType: ["small", "marginal"],
    locations: ["All Tamil Nadu"],
    steps: ["Register at nearest agriculture office", "Submit identity proof & land patta", "Get enrolled automatically", "Nominee receives benefit"],
    emoji: "🏥",
    category: "Insurance",
  },
  {
    name: "Soil Health Card Scheme",
    fullName: "Soil Health Card Scheme",
    benefits: "Free soil testing, nutrient-based fertilizer recommendations",
    eligibility: "All farmers with cultivable land",
    farmerType: ["small", "marginal", "medium"],
    locations: ["All Tamil Nadu"],
    steps: ["Collect soil samples", "Submit to nearest testing center", "Receive Soil Health Card", "Follow fertilizer recommendations"],
    emoji: "🧪",
    category: "Soil & Input",
  },
  {
    name: "Kisan Credit Card",
    fullName: "Kisan Credit Card",
    benefits: "Low-interest credit (4% p.a.) up to ₹3 lakhs for crop production",
    eligibility: "Owner cultivators, tenant farmers, sharecroppers",
    farmerType: ["small", "marginal", "medium"],
    locations: ["All Tamil Nadu"],
    steps: ["Apply at any bank with land documents", "Get credit limit assessed", "Receive KCC within 14 days", "Use for crop inputs & needs"],
    emoji: "💳",
    category: "Credit",
  },
  {
    name: "NADP - TN",
    fullName: "National Agriculture Development Programme (Tamil Nadu)",
    benefits: "50-90% subsidy on farm mechanization equipment",
    eligibility: "Small and marginal farmers in Tamil Nadu",
    farmerType: ["small", "marginal"],
    locations: ["Thanjavur", "Tiruvarur", "Nagapattinam", "Cuddalore", "Villupuram"],
    steps: ["Apply through district agriculture office", "Submit required documents", "Get equipment approved", "Pay balance amount, receive equipment"],
    emoji: "🚜",
    category: "Mechanization",
  },
  {
    name: "eNAM Registration",
    fullName: "Electronic National Agriculture Market",
    benefits: "Direct market access, transparent pricing, no middlemen",
    eligibility: "All farmers with produce to sell",
    farmerType: ["small", "marginal", "medium"],
    locations: ["All Tamil Nadu"],
    steps: ["Register on enam.gov.in", "Link bank account & Aadhaar", "List produce with quality details", "Get bids from buyers across India"],
    emoji: "🏪",
    category: "Marketing",
  },
];

const FARMER_TYPES = [
  { value: "all", label: "All Farmers" },
  { value: "small", label: "Small Farmer" },
  { value: "marginal", label: "Marginal Farmer" },
  { value: "medium", label: "Medium Farmer" },
];

const LOCATIONS = [
  "All Locations", "Coimbatore", "Madurai", "Trichy", "Salem", "Erode",
  "Thanjavur", "Cuddalore", "Villupuram", "Tiruvarur", "Nagapattinam",
];

const SchemesPage = () => {
  const [farmerType, setFarmerType] = useState("all");
  const [location, setLocation] = useState("All Locations");
  const [search, setSearch] = useState("");
  const [expandedScheme, setExpandedScheme] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return SCHEMES.filter(s => {
      if (farmerType !== "all" && !s.farmerType.includes(farmerType)) return false;
      if (location !== "All Locations" && !s.locations.includes("All Tamil Nadu") && !s.locations.includes(location)) return false;
      if (search.trim() && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.fullName.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [farmerType, location, search]);

  return (
    <div className="min-h-screen px-4 pb-24 pt-6 md:pt-20">
      <div className="mx-auto max-w-4xl space-y-5">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-2xl font-black text-foreground flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl gradient-sky text-primary-foreground">
              <Landmark className="h-5 w-5" />
            </span>
            Govt Schemes
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{filtered.length} schemes available for you</p>
        </motion.div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search schemes..."
            className="w-full rounded-2xl border border-input bg-background/80 backdrop-blur-sm pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm font-bold text-primary"
        >
          <Filter className="h-4 w-4" />
          {showFilters ? "Hide Filters" : "Filter by Farmer Type & Location"}
          <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </button>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden space-y-3"
            >
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1 mb-2">
                  <Users className="h-3 w-3" /> Farmer Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {FARMER_TYPES.map(ft => (
                    <button
                      key={ft.value}
                      onClick={() => setFarmerType(ft.value)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                        farmerType === ft.value
                          ? "gradient-hero text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {ft.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1 mb-2">
                  <MapPin className="h-3 w-3" /> Location
                </label>
                <div className="flex flex-wrap gap-2">
                  {LOCATIONS.map(loc => (
                    <button
                      key={loc}
                      onClick={() => setLocation(loc)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                        location === loc
                          ? "gradient-sky text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scheme Cards */}
        <div className="space-y-3">
          {filtered.map((scheme, i) => {
            const isExpanded = expandedScheme === scheme.name;
            return (
              <motion.div
                key={scheme.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-elevated overflow-hidden"
              >
                <button
                  onClick={() => setExpandedScheme(isExpanded ? null : scheme.name)}
                  className="w-full p-4 flex items-start gap-3 text-left"
                >
                  <span className="text-2xl mt-0.5">{scheme.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-heading text-base font-bold text-foreground">{scheme.name}</h3>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">{scheme.category}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{scheme.fullName}</p>
                    <p className="text-sm text-foreground mt-1">{scheme.benefits}</p>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                        <div className="rounded-xl bg-accent/50 p-3">
                          <p className="text-xs font-bold text-accent-foreground mb-1">✅ Eligibility</p>
                          <p className="text-sm text-foreground">{scheme.eligibility}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-muted-foreground mb-2">📋 How to Apply</p>
                          <div className="space-y-1.5">
                            {scheme.steps.map((step, si) => (
                              <div key={si} className="flex items-start gap-2">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{si + 1}</span>
                                <p className="text-sm text-foreground">{step}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          ⚠️ AI-generated advice. Consult local AO (Agricultural Officer) for critical steps.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-heading font-bold text-foreground">No schemes found</p>
            <p className="text-sm text-muted-foreground mt-1">Try changing filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemesPage;
