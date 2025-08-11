"use client";
import { CalendarDays, Coins, Shield, Upload, Download, ChevronRight } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, Tooltip } from "recharts";

const spark = [
  { d: "Jan", v: 3.2 }, { d: "Feb", v: 4.1 }, { d: "Mar", v: 4.9 },
  { d: "Apr", v: 5.3 }, { d: "Mai", v: 6.8 }, { d: "Jun", v: 7.6 }, { d: "Jul", v: 8.9 }
];

const nextPayouts = [
  { date: "12. aug", name: "Aker BP", amount: "2 480 NOK" },
  { date: "20. aug", name: "Vår Energi", amount: "1 120 NOK" },
  { date: "28. aug", name: "Orkla", amount: "980 NOK" }
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="hero-glow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Oversikt</h1>
            <p className="text-slate-400">Se YTD-utbytte, kommende utbetalinger og rask eksport til regnskap.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm">
              <Upload className="inline -mt-0.5 mr-2 h-4 w-4" /> Importer filer
            </button>
            <button className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-sm">
              <Download className="inline -mt-0.5 mr-2 h-4 w-4" /> Generér bilag
            </button>
          </div>
        </div>
      </section>

      {/* KPI-kort */}
      <section className="grid gap-4 md:grid-cols-3">
        {[
          { title: "YTD utbytte (NOK)", value: "12 480", icon: Coins, tip: "Sum siste 12 mnd" },
          { title: "Neste utbetalinger", value: `${nextPayouts.length} i kø`, icon: CalendarDays, tip: "30 dager frem" },
          { title: "Kildeskatt i år", value: "5 940 NOK", icon: Shield, tip: "Refusjon/credit" }
        ].map(({ title, value, icon: Icon, tip }) => (
          <div key={title} className="card-glass">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="text-sm text-slate-300 font-medium">{title}</div>
              <div className="h-9 w-9 rounded-xl bg-white/5 grid place-items-center border border-white/10">
                <Icon className="h-4 w-4 text-indigo-300" />
              </div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-semibold tracking-tight">{value}</div>
              <div className="text-xs text-slate-400 mt-1">{tip}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Graf + neste utbetalinger */}
      <section className="grid gap-4 md:grid-cols-5">
        <div className="card-glass md:col-span-3">
          <div className="p-4 border-b border-white/10 text-sm text-slate-300">Utbytte – YTD</div>
          <div className="h-48 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={spark} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
                <Tooltip
                  contentStyle={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }}
                  labelStyle={{ color: "#cbd5e1" }}
                  itemStyle={{ color: "#e2e8f0" }}
                />
                <Line type="monotone" dataKey="v" stroke="hsl(var(--brand))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-glass md:col-span-2">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="text-sm text-slate-300">Neste utbetalinger</div>
            <button className="px-3 py-1.5 rounded-xl text-indigo-300 hover:text-indigo-200 hover:bg-white/5 text-sm">
              Se kalender <ChevronRight className="inline ml-1 h-4 w-4" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            {nextPayouts.map((p) => (
              <div key={p.date} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <div>
                  <div className="text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-slate-400">{p.date}</div>
                </div>
                <div className="text-sm">{p.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
