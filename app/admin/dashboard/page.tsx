"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Clock,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Activity,
  CreditCard,
  PieChart as PieChartIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    revenue: 0,
    advance: 0,
    final: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("customer_submissions")
        .select("*");

      if (error) throw error;

      if (data) {
        const stats = data.reduce(
          (acc, curr) => {
            acc.total++;
            if (curr.submission_status === "pending") acc.pending++;
            if (curr.submission_status === "completed") acc.completed++;

            acc.revenue += curr.total_amount || 0;
            acc.advance += curr.advance_payment || 0;
            acc.final += curr.final_payment || 0;

            return acc;
          },
          {
            total: 0,
            pending: 0,
            completed: 0,
            revenue: 0,
            advance: 0,
            final: 0,
          }
        );

        setStats(stats);

        const days = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return {
            date: d.toLocaleDateString("en-US", { weekday: "short" }),
            fullDate: d.toISOString().split("T")[0],
            count: 0,
          };
        });

        data.forEach((sub) => {
          const subDate = sub.created_at.split("T")[0];
          const day = days.find((d) => d.fullDate === subDate);
          if (day) day.count++;
        });

        setChartData(days);
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 pb-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 px-2">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic underline decoration-primary/50 underline-offset-8">
            Command Center
          </h1>
          <p className="text-foreground/60 mt-4 text-lg font-medium">
            Real-time pulse of your hand-casting empire.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-xl backdrop-blur-md">
            <Activity className="w-5 h-5 text-primary animate-pulse" />
            <span className="font-bold text-foreground">
              LIVE STATUS: ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
        <Card className="glass relative overflow-hidden border-white/10 shadow-2xl group hover:-translate-y-1 transition-all">
          <div className="absolute top-0 right-0 p-6 text-primary/10 group-hover:scale-110 transition-transform">
            <Users size={80} />
          </div>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-black uppercase tracking-widest text-foreground/40">
              Engagements
            </CardDescription>
            <CardTitle className="text-5xl font-black tracking-tighter italic text-foreground">
              {stats.total}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full text-[10px] font-black text-primary uppercase">
                <Clock size={12} strokeWidth={3} /> {stats.pending} WAIT
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 rounded-full text-[10px] font-black text-green-500 uppercase">
                <CheckCircle size={12} strokeWidth={3} /> {stats.completed} DONE
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass relative overflow-hidden border-white/10 shadow-2xl group hover:-translate-y-1 transition-all">
          <div className="absolute top-0 right-0 p-6 text-emerald-500/10 group-hover:scale-110 transition-transform">
            <DollarSign size={80} />
          </div>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-black uppercase tracking-widest text-foreground/40">
              Gross Pipeline
            </CardDescription>
            <CardTitle className="text-5xl font-black tracking-tighter italic text-foreground">
              ₹{stats.revenue.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-500 uppercase tracking-widest">
              <TrendingUp size={14} strokeWidth={3} />
              <span>Projected Earnings</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass relative overflow-hidden border-white/10 shadow-2xl group hover:-translate-y-1 transition-all">
          <div className="absolute top-0 right-0 p-6 text-primary/10 group-hover:scale-110 transition-transform">
            <CreditCard size={80} />
          </div>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-black uppercase tracking-widest text-foreground/40">
              Secured Advance
            </CardDescription>
            <CardTitle className="text-5xl font-black tracking-tighter italic text-primary">
              ₹{stats.advance.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest">
              Liquidity in Vault
            </div>
          </CardContent>
        </Card>

        <Card className="glass relative overflow-hidden border-white/10 shadow-2xl group hover:-translate-y-1 transition-all">
          <div className="absolute top-0 right-0 p-6 text-green-600/10 group-hover:scale-110 transition-transform">
            <CheckCircle size={80} />
          </div>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-black uppercase tracking-widest text-foreground/40">
              Realized Yield
            </CardDescription>
            <CardTitle className="text-5xl font-black tracking-tighter italic text-green-600">
              ₹{stats.final.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest">
              Finalized & Settled
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graph Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2">
        <Card className="lg:col-span-2 glass border-white/10 shadow-2xl overflow-hidden">
          <CardHeader className="p-8 border-b border-white/5 bg-white/1">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-black uppercase tracking-tighter">
                  Velocity Matrix
                </CardTitle>
                <CardDescription className="text-sm font-medium text-foreground/40 uppercase tracking-widest mt-1">
                  Submission frequency last 168 hours
                </CardDescription>
              </div>
              <div className="p-3 bg-primary/20 rounded-2xl">
                <Activity size={20} className="text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-100 w-full p-8">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--primary)"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11,
                    fontWeight: 900,
                    fill: "currentColor",
                    opacity: 0.3,
                  }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11,
                    fontWeight: 900,
                    fill: "currentColor",
                    opacity: 0.3,
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "20px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                    padding: "16px",
                  }}
                  itemStyle={{
                    color: "var(--primary)",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    fontSize: "10px",
                  }}
                  labelStyle={{
                    color: "rgba(255,255,255,0.4)",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    fontSize: "10px",
                    marginBottom: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="var(--primary)"
                  fillOpacity={1}
                  fill="url(#colorCount)"
                  strokeWidth={4}
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="glass border-white/10 shadow-2xl">
            <CardHeader className="p-8 border-b border-white/5 bg-white/1">
              <CardTitle className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                <PieChartIcon className="w-5 h-5 text-primary" />
                Fiscal Pulse
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-foreground/40">
                  <span>Throughput Rate</span>
                  <span className="text-foreground">
                    {(stats.total / 7).toFixed(1)} / DAY
                  </span>
                </div>
                <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div
                    className="h-full bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] transition-all duration-1000"
                    style={{ width: "65%" }}
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-foreground/40">
                    Unfilled Gap
                  </span>
                  <span className="text-xl font-black italic text-primary">
                    ₹{(stats.revenue - stats.final).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-foreground/40">
                    Market Edge
                  </span>
                  <div className="px-3 py-1 bg-green-500 text-black text-[10px] font-black rounded-lg transform -skew-x-12 uppercase">
                    +12% Alpha
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-primary/20 shadow-2xl bg-primary/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/20 transition-colors" />
            <CardContent className="p-8 relative z-10">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-2">
                Internal Advisory
              </h4>
              <p className="text-foreground/70 font-bold italic leading-relaxed">
                "Growth trajectory remains consistent. Suggest increasing
                gallery visibility for antique collection to capitalize on
                current trending sentiment."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
