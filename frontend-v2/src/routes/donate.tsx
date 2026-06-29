import { createDonation } from "@/api/donation";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, ImagePlus, Sparkles } from "lucide-react";
import { toast } from "sonner";


import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title: "Post a donation · Replate" },
      {
        name: "description",
        content:
          "Donate surplus food in 30 seconds. Verified NGOs near you will see it instantly.",
      },
      { property: "og:title", content: "Post a donation · Replate" },
      {
        property: "og:description",
        content: "Turn surplus food into rescued meals — post in 30 seconds.",
      },
    ],
  }),
  component: DonatePage,
});

function DonatePage() {
  const [submitted, setSubmitted] = useState(false);


  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="hero-gradient border-b border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-sm font-medium uppercase tracking-wider text-tomato">
            Post a donation
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold md:text-5xl">
            Tell us what you have.
            <br />
            We'll find it a home.
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Listings go live instantly to verified NGOs within a 10 km radius.
            Average claim time is under 12 minutes.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[1.4fr_1fr]">
        {submitted ? (
          <SuccessCard onReset={() => setSubmitted(false)} />
        ) : (
          <DonationForm onSubmit={() => setSubmitted(true)} />
        )}

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <SidebarItem
            title="Safety first"
            body="Cooked items must be ≤4h old and kept at safe temperature. We'll prompt NGOs to bring insulated carriers."
          />
          <SidebarItem
            title="Tax receipts"
            body="We issue an itemized impact + tax receipt after every confirmed pickup."
          />
          <SidebarItem
            title="Need a bulk pickup?"
            body="For 500+ servings, our ops team coordinates a refrigerated van within 90 minutes."
          />
        </aside>
      </section>

      <SiteFooter />
    </div>
  );
}

function DonationForm({ onSubmit }: { onSubmit: () => void }) {
  const [title, setTitle] = useState("");
  const [servings, setServings] = useState(50);
  const [pickup, setPickup] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("Please login first");
          return;
        }

        setLoading(true);

        try {
  const result = await createDonation(
    {
      food_name: title,
      quantity: servings,
      expiry_time: pickup,
      address,
    },
    token
  );

  if (result.ok) {
    toast.success(result.data.message);
    onSubmit();
  } else {
    toast.error(result.data.message);
  }
} finally {
  setLoading(false);
}
      }}
      className="rounded-3xl border border-border bg-card p-8 shadow-sm"
    >
      <div className="grid gap-6">
        <Field label="Listing title" htmlFor="title">
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g. Veg biryani trays from wedding"
            className="h-11 rounded-xl"
          />
        </Field>

        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Donor type" htmlFor="donorType">
            <Select defaultValue="Restaurant">
              <SelectTrigger id="donorType" className="h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Restaurant">Restaurant</SelectItem>
                <SelectItem value="Hotel">Hotel</SelectItem>
                <SelectItem value="Caterer">Caterer</SelectItem>
                <SelectItem value="Event">Event organizer</SelectItem>
                <SelectItem value="Individual">Individual</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Food category" htmlFor="category">
            <Select defaultValue="Cooked meals">
              <SelectTrigger id="category" className="h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cooked meals">Cooked meals</SelectItem>
                <SelectItem value="Bakery">Bakery</SelectItem>
                <SelectItem value="Produce">Produce</SelectItem>
                <SelectItem value="Dairy">Dairy</SelectItem>
                <SelectItem value="Packaged">Packaged</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Estimated servings" htmlFor="servings">
            <Input
              id="servings"
              type="number"
              min={1}
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
              required
              className="h-11 rounded-xl"
            />
          </Field>
          <Field label="Pickup window ends" htmlFor="pickup">
            <Input
              id="pickup"
              type="datetime-local"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              required
              className="h-11 rounded-xl"
            />
          </Field>
        </div>

        <Field label="Pickup address" htmlFor="address">
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder="Street, neighborhood, city"
            className="h-11 rounded-xl"
          />
        </Field>

        <Field
          label="Notes for the NGO"
          htmlFor="notes"
          hint="Allergens, packaging, access instructions"
        >
          <Textarea
            id="notes"
            rows={4}
            placeholder="Contains nuts. Use the side entrance after 7pm."
            className="rounded-xl"
          />
        </Field>

        <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-border bg-secondary/40 p-5 sm:flex-row sm:items-center">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-card text-primary">
            <ImagePlus className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Add a photo (optional)</p>
            <p className="text-sm text-muted-foreground">
              Photos increase claim rate by 3×.
            </p>
          </div>
          <Button type="button" variant="outline" className="rounded-full">
            Upload
          </Button>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-border pt-6">
          <p className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-tomato" />
            Avg. time to first claim: 12 min
          </p>
          <Button
            type="submit"
            size="lg"
            className="rounded-full px-7"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post Donation"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function SuccessCard({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <h2 className="mt-6 font-display text-3xl font-semibold">
        Your donation is live.
      </h2>
      <p className="mx-auto mt-3 max-w-md text-muted-foreground">
        12 NGOs within 5 km have been notified. We'll text you the moment one
        reserves your listing.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button onClick={onReset} variant="outline" className="rounded-full">
          Post another
        </Button>
        <Button asChild className="rounded-full">
          <a href="/dashboard">View dashboard</a>
        </Button>
      </div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-baseline justify-between">
        <Label htmlFor={htmlFor} className="text-sm font-medium">
          {label}
        </Label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function SidebarItem({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="font-display text-lg font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
