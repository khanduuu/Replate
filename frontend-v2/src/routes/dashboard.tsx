import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getDashboardStats } from "@/api/dashboard";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpRight, Leaf, Truck, Utensils, Users } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getAllDonations } from "@/api/donation";


export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Impact dashboard · Replate" },
      {
        name: "description",
        content:
          "Track meals rescued, CO₂ saved, NGO pickups and category breakdown for your organization.",
      },
      { property: "og:title", content: "Impact dashboard · Replate" },
      {
        property: "og:description",
        content:
          "Real-time analytics for your food rescue operations on Replate.",
      },
    ],
  }),
  component: DashboardPage,
});

const chartColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  useEffect(() => {
    async function loadDashboard() {
      const dashboardResponse = await getDashboardStats();
const donationsResponse = await getAllDonations();

if (dashboardResponse.ok) {
  setStats(dashboardResponse.data);
}

if (donationsResponse.ok) {
  setListings(donationsResponse.data);
}
    }

    loadDashboard();
  }, []);
  const pieData = [
    {
      name: "Available",
      value: stats?.available ?? 0,
    },
    {
      name: "Reserved",
      value: stats?.reserved ?? 0,
    },
    {
      name: "Picked Up",
      value: stats?.picked_up ?? 0,
    },
    {
      name: "Completed",
      value: stats?.completed ?? 0,
    },
  ];
  const statusData = [
    {
      name: "Available",
      count: stats?.available ?? 0,
    },
    {
      name: "Reserved",
      count: stats?.reserved ?? 0,
    },
    {
      name: "Picked Up",
      count: stats?.picked_up ?? 0,
    },
    {
      name: "Completed",
      count: stats?.completed ?? 0,
    },
  ];



  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="border-b border-border/60 bg-secondary/40">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-tomato">
                Impact dashboard
              </p>
              <h1 className="mt-2 font-display text-4xl font-semibold md:text-5xl">
                This week, you fed a city.
              </h1>
              <p className="mt-2 text-muted-foreground">
                Live numbers from your kitchens and NGO partners.
              </p>
            </div>
            <div className="flex gap-2 rounded-full border border-border bg-card p-1 text-sm">
              {["7 days", "30 days", "Quarter"].map((t, i) => (
                <button
                  key={t}
                  className={
                    "rounded-full px-4 py-1.5 transition " +
                    (i === 0
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground")
                  }
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-4 md:grid-cols-4">
          <Kpi
            icon={Utensils}
            label="Total Donations"
            value={stats?.total_donations?.toString() ?? "0"}
            delta=""
          />

          <Kpi
            icon={Leaf}
            label="Available"
            value={stats?.available?.toString() ?? "0"}
            delta=""
          />

          <Kpi
            icon={Truck}
            label="Completed"
            value={stats?.completed?.toString() ?? "0"}
            delta=""
          />

          <Kpi
            icon={Users}
            label="NGO Partners"
            value={stats?.total_ngos?.toString() ?? "0"}
            delta=""
          />

        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-3xl border border-border bg-card p-6">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-display text-2xl font-semibold">
                  Donation Status
                </h2>
                <p className="text-sm text-muted-foreground">
                  Current donations by status.
                </p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Live Data
              </span>
            </div>
            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} barSize={40}>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} strokeDasharray="3 6" />
                  <XAxis
                    dataKey="name"
                    stroke="var(--color-muted-foreground)"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: "var(--color-secondary)" }}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid var(--color-border)",
                      background: "var(--color-card)",
                    }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="var(--color-primary)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6">
            <h2 className="font-display text-2xl font-semibold">
              Donation Distribution
            </h2>
            <p className="text-sm text-muted-foreground">
              Current donation status distribution.
            </p>
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={48}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={chartColors[i % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid var(--color-border)",
                      background: "var(--color-card)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 space-y-2 text-sm">
              {pieData.map((c, i) => (
                <li key={c.name} className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: chartColors[i % chartColors.length] }}
                    />
                    {c.name}
                  </span>
                  <span className="text-muted-foreground">
                    {c.value} donations
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <div>
              <h2 className="font-display text-2xl font-semibold">
                Recent listings
              </h2>
              <p className="text-sm text-muted-foreground">
                Your latest posts and their pickup status.
              </p>
            </div>
            <a
              href="/browse"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary"
            >
              View all <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          <div className="divide-y divide-border">
            {listings.slice(0, 5).map((l) => (
              <div
                key={l.id}
                className="grid items-center gap-4 px-6 py-4 md:grid-cols-[2fr_1fr_2fr_120px]"
              >
                <p className="font-medium">{l.food_name}</p>

                <p className="text-sm text-muted-foreground">
                  {l.quantity} servings
                </p>

                <p className="text-sm text-muted-foreground">
                  {l.address}
                </p>

                <span
                  className={
                    "justify-self-start rounded-full px-2.5 py-1 text-xs font-medium " +
                    (l.status === "available"
                      ? "bg-green-100 text-green-700"
                      : l.status === "reserved"
                        ? "bg-yellow-100 text-yellow-700"
                        : l.status === "picked_up"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-200 text-gray-700")
                  }
                >
                  {l.status === "available"
                    ? "🟢 Available"
                    : l.status === "reserved"
                      ? "🟡 Reserved"
                      : l.status === "picked_up"
                        ? "🔵 Picked Up"
                        : "✅ Completed"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  delta,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  delta: string;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        {delta && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {delta}
          </span>
        )}
      </div>
      <p className="mt-5 font-display text-3xl font-semibold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
