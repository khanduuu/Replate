import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock,
  HandHeart,
  Leaf,
  MapPin,
  ShieldCheck,
  Soup,
  Sparkles,
  Users,
  Utensils,
} from "lucide-react";

import heroImg from "@/assets/hero-food.jpg";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Replate — Rescue surplus food, feed your city" },
      {
        name: "description",
        content:
          "A live marketplace for surplus food donations. Restaurants and event organizers post extras; verified NGOs claim and deliver them before they spoil.",
      },
      { property: "og:title", content: "Replate — Rescue surplus food" },
      {
        property: "og:description",
        content:
          "Connect surplus food with the people who need it most — in real time.",
      },
    ],
  }),
  component: LandingPage,
});

const stats = [
  { label: "Meals rescued", value: "184,302" },
  { label: "Partner kitchens", value: "1,240" },
  { label: "NGOs on platform", value: "318" },
  { label: "Cities live", value: "27" },
];

const steps = [
  {
    icon: Utensils,
    title: "Post surplus in 30 seconds",
    body: "Donors snap a photo, set a pickup window and quantity. We do the rest.",
  },
  {
    icon: MapPin,
    title: "Nearest NGO claims it",
    body: "Verified NGOs see live listings on a map and reserve with one tap.",
  },
  {
    icon: HandHeart,
    title: "Food reaches people, fast",
    body: "Volunteers pick up within the window. Donors get an impact receipt.",
  },
];

const audiences = [
  {
    icon: Soup,
    tag: "For donors",
    title: "Turn tomorrow's waste into today's meals",
    body: "Restaurants, hotels, caterers and event organizers can offload surplus in minutes — no calls, no spreadsheets, no spoilage.",
    cta: { to: "/donate", label: "Post your first donation" },
  },
  {
    icon: Users,
    tag: "For NGOs",
    title: "A real-time pipeline of fresh food",
    body: "Browse live listings near your shelter, filter by category, and track every pickup from claim to delivery.",
    cta: { to: "/browse", label: "Browse available food" },
  },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[1.1fr_1fr] md:py-28">
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-tomato" />
              Live in 27 cities · 184k meals rescued
            </span>

            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] text-foreground md:text-6xl lg:text-7xl">
              Rescue surplus food.
              <br />
              <span className="text-primary">Feed</span> your city.
            </h1>

            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Replate is the real-time bridge between businesses with surplus
              food and the NGOs feeding people who need it — before a single
              meal goes to waste.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-6">
                <Link to="/donate">
                  I have food to donate <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-foreground/15 bg-card/60 px-6 backdrop-blur"
              >
                <Link to="/browse">I'm an NGO — browse food</Link>
              </Button>
            </div>

            <dl className="mt-12 grid max-w-lg grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-semibold text-foreground">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-honey/30 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-xl">
              <img
                src={heroImg}
                alt="Volunteers packing rescued surplus produce into donation boxes"
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/40 bg-white/85 p-4 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Saffron Banquet · 120 meals
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Pickup in 3h · Indiranagar · 1.4 km away
                    </p>
                  </div>
                  <span className="ml-auto rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    Live
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="surface-grain border-y border-border/60 bg-secondary/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-tomato">
                How it works
              </p>
              <h2 className="mt-2 font-display text-4xl font-semibold md:text-5xl">
                Three steps from surplus to served.
              </h2>
            </div>
            <Button asChild variant="ghost" className="hidden md:inline-flex">
              <Link to="/browse">
                See it live <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <li
                key={s.title}
                className="group relative rounded-3xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <span className="font-display text-sm text-muted-foreground">
                  0{i + 1}
                </span>
                <div className="mt-4 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Audiences */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-6 md:grid-cols-2">
          {audiences.map((a) => (
            <article
              key={a.tag}
              className="flex flex-col justify-between rounded-3xl border border-border bg-card p-8"
            >
              <div>
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-accent text-accent-foreground">
                    <a.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    {a.tag}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-3xl font-semibold leading-tight">
                  {a.title}
                </h3>
                <p className="mt-3 text-muted-foreground">{a.body}</p>
              </div>
              <Button asChild className="mt-8 w-fit rounded-full">
                <Link to={a.cta.to}>
                  {a.cta.label} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </article>
          ))}
        </div>

        <div className="mt-16 grid gap-6 rounded-3xl border border-border bg-primary p-10 text-primary-foreground md:grid-cols-[1.4fr_1fr] md:p-14">
          <div>
            <Leaf className="h-8 w-8 text-honey" />
            <h3 className="mt-4 font-display text-3xl font-semibold leading-tight md:text-4xl">
              Every meal rescued is 2.5 kg of CO₂ saved.
            </h3>
            <p className="mt-3 max-w-xl text-primary-foreground/80">
              Replate auto-generates impact reports for your sustainability,
              CSR and ESG filings — measured in meals, kilos and emissions.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 self-end">
            <Metric icon={ShieldCheck} label="Verified NGO partners" value="100%" />
            <Metric icon={Clock} label="Avg. pickup time" value="42 min" />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-5">
      <Icon className="h-5 w-5 text-honey" />
      <p className="mt-3 font-display text-2xl font-semibold">{value}</p>
      <p className="text-xs text-primary-foreground/70">{label}</p>
    </div>
  );
}
