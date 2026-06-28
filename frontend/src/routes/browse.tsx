import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Clock, Filter, MapPin, Search, Utensils } from "lucide-react";
import { toast } from "sonner";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { getAllDonations } from "@/api/donation";
import { reserveDonation } from "@/api/reservation";

export const Route = createFileRoute("/browse")({
  head: () => ({
    meta: [
      { title: "Browse available food · Replate" },
      {
        name: "description",
        content:
          "Live listings of surplus food donations near you. Filter by category, distance and pickup window.",
      },
      { property: "og:title", content: "Browse available food · Replate" },
      {
        property: "og:description",
        content: "Find and claim surplus food donations near you in real time.",
      },
    ],
  }),
  component: BrowsePage,
});

const categories = ["All", "Cooked meals", "Bakery", "Produce", "Dairy", "Packaged"] as const;

function formatTimeLeft(iso: string) {
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return "Expired";
  const h = Math.floor(ms / 3600_000);
  const m = Math.floor((ms % 3600_000) / 60_000);
  return h > 0 ? `${h}h ${m}m left` : `${m}m left`;
}

function BrowsePage() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<(typeof categories)[number]>("All");
  const [sort, setSort] = useState("soonest");
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const [listings, setListings] = useState<any[]>([]);

  async function loadDonations() {
    try {
      
      
      const { ok, data } = await getAllDonations();

if (!ok) return [];

const mapped = data.map((d: any) => ({
        id: d.id,
        title: d.food_name,
        donor: `Donor #${d.donor_id}`,
        donorType: "Restaurant",
        neighborhood: d.address,
        distanceKm: 2,
        pickupBy: d.expiry_time,
        servings: d.quantity,
        notes: "",
        category: "Cooked meals",
        status:
          d.status === "available"
            ? "Available"
            : d.status === "reserved"
              ? "Reserved"
              : d.status === "picked_up"
                ? "Picked Up"
                : "Completed",
      }));

      setListings(mapped);

    } catch (error) {
      console.error(error);
    }
  }
  async function handleReserve(listing: any) {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      return;
    }

    setLoadingId(listing.id);

    try {
      const result = await reserveDonation(listing.id, token);

      if (result.message) {
        toast.success(result.message);
        await loadDonations();
      } else {
        toast.error("Reservation failed");
      }
    } finally {
      setLoadingId(null);
    }
  }
  useEffect(() => {
    loadDonations();
  }, []);

  const filtered = useMemo(() => {
    let xs = listings.filter((l) =>
      cat === "All" ? true : l.category === cat,
    );

    if (query.trim()) {
      const q = query.toLowerCase();
      xs = xs.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.donor.toLowerCase().includes(q) ||
          l.neighborhood.toLowerCase().includes(q),
      );
    }

    xs = [...xs].sort((a, b) => {
      if (sort === "nearest") return a.distanceKm - b.distanceKm;
      if (sort === "largest") return b.servings - a.servings;
      return (
        new Date(a.pickupBy).getTime() -
        new Date(b.pickupBy).getTime()
      );
    });

    return xs;
  }, [query, cat, sort, listings]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="border-b border-border/60 bg-secondary/40">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <p className="text-sm font-medium uppercase tracking-wider text-tomato">
            Live listings
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold md:text-5xl">
            Surplus food, ready for pickup.
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {filtered.length} donations available right now across your area.
            Reserve a listing to lock it for your team.
          </p>

          <div className="mt-8 grid gap-3 rounded-2xl border border-border bg-card p-3 md:grid-cols-[1fr_200px_200px_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by dish, donor or neighborhood"
                className="h-11 rounded-xl border-transparent bg-secondary/60 pl-9"
              />
            </div>
            <Select value={cat} onValueChange={(v) => setCat(v as (typeof categories)[number])}>
              <SelectTrigger className="h-11 rounded-xl border-transparent bg-secondary/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-11 rounded-xl border-transparent bg-secondary/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="soonest">Soonest pickup</SelectItem>
                <SelectItem value="nearest">Nearest first</SelectItem>
                <SelectItem value="largest">Largest quantity</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="h-11 rounded-xl">
              <Filter className="mr-2 h-4 w-4" /> More
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[1fr_360px]">
        <ul className="grid gap-4">
          {filtered.map((l) => (
            <ListingCard
              key={l.id}
              listing={l}
              loadingId={loadingId}
              handleReserve={handleReserve}
            />
          ))}
          {filtered.length === 0 && (
            <li className="rounded-3xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
              No listings match those filters yet. Try widening your search.
            </li>
          )}
        </ul>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-3xl border border-border bg-card">
            <div className="relative aspect-[4/5] surface-grain bg-secondary/60">
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <p className="mt-3 font-display text-lg">Live pickup map</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Connect Google Maps to enable
                  </p>
                </div>
              </div>
              {/* faux pins */}
              <span className="absolute left-[22%] top-[28%] h-3 w-3 animate-pulse rounded-full bg-tomato ring-4 ring-tomato/20" />
              <span className="absolute left-[58%] top-[44%] h-3 w-3 animate-pulse rounded-full bg-primary ring-4 ring-primary/20" />
              <span className="absolute left-[40%] top-[68%] h-3 w-3 animate-pulse rounded-full bg-honey ring-4 ring-honey/20" />
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6">
            <h3 className="font-display text-lg font-semibold">
              Tips for fast pickup
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>• Reserve within 15 min of posting to lock the listing.</li>
              <li>• Bring insulated containers for cooked meals.</li>
              <li>• Confirm pickup in-app so donors see real-time status.</li>
            </ul>
          </div>
        </aside>
      </section>

      <SiteFooter />
    </div>
  );
}

function ListingCard({
  listing,
  loadingId,
  handleReserve,
}: {
  listing: any;
  loadingId: number | null;
  handleReserve: (listing: any) => void;
}) {
  const isAvailable = listing.status === "Available";
  return (
    <li className="group flex flex-col gap-5 rounded-3xl border border-border bg-card p-5 transition-shadow hover:shadow-md md:flex-row md:p-6">
      <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-accent text-accent-foreground">
        <Utensils className="h-8 w-8" />
      </div>
      <div className="flex-1">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-xl font-semibold leading-tight">
              {listing.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {listing.donor} · {listing.donorType}
            </p>
          </div>
          <Badge
            variant="outline"
            className={
              isAvailable
                ? "border-primary/30 bg-primary/10 text-primary"
                : listing.status === "Reserved"
                  ? "border-honey/40 bg-honey/20 text-foreground"
                  : "border-border bg-secondary text-muted-foreground"
            }
          >
            {listing.status}
          </Badge>
        </div>

        <p className="mt-3 text-sm text-muted-foreground">{listing.notes}</p>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-foreground/80">
          <span className="inline-flex items-center gap-1.5">
            <Utensils className="h-4 w-4 text-primary" />
            {listing.servings} servings
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-primary" />
            {listing.neighborhood} · {listing.distanceKm} km
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-primary" />
            {formatTimeLeft(listing.pickupBy)}
          </span>
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs">
            {listing.category}
          </span>
        </div>
      </div>

      <div className="flex items-center md:flex-col md:justify-center">
        <Button
  disabled={!isAvailable || loadingId === listing.id}
  className="w-full rounded-full md:w-auto"
  onClick={() => handleReserve(listing)}
>
  {loadingId === listing.id
    ? "Reserving..."
    : isAvailable
    ? "Reserve"
    : listing.status}
</Button>
      </div>
    </li>
  );
}
