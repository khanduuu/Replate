export type Listing = {
  id: string;
  title: string;
  donor: string;
  donorType: "Restaurant" | "Hotel" | "Caterer" | "Event" | "Individual";
  category: "Cooked meals" | "Bakery" | "Produce" | "Dairy" | "Packaged";
  servings: number;
  pickupBy: string; // ISO
  distanceKm: number;
  neighborhood: string;
  notes: string;
  status: "Available" | "Reserved" | "Picked up";
};

const now = Date.now();
const hours = (h: number) => new Date(now + h * 3600_000).toISOString();

export const listings: Listing[] = [
  {
    id: "l1",
    title: "Veg biryani & dal trays",
    donor: "Saffron Banquet Hall",
    donorType: "Event",
    category: "Cooked meals",
    servings: 120,
    pickupBy: hours(3),
    distanceKm: 1.4,
    neighborhood: "Indiranagar",
    notes: "Wedding overflow. Kept warm in chafing dishes.",
    status: "Available",
  },
  {
    id: "l2",
    title: "Sourdough loaves & pastries",
    donor: "Levain & Co.",
    donorType: "Restaurant",
    category: "Bakery",
    servings: 45,
    pickupBy: hours(2),
    distanceKm: 0.8,
    neighborhood: "Koramangala",
    notes: "End of day bake. Best eaten within 24h.",
    status: "Available",
  },
  {
    id: "l3",
    title: "Mixed produce crates",
    donor: "Green Basket Grocers",
    donorType: "Individual",
    category: "Produce",
    servings: 80,
    pickupBy: hours(8),
    distanceKm: 3.2,
    neighborhood: "HSR Layout",
    notes: "Tomatoes, spinach, bananas. Slight blemishes only.",
    status: "Reserved",
  },
  {
    id: "l4",
    title: "Continental buffet (veg + non-veg)",
    donor: "Hotel Athena",
    donorType: "Hotel",
    category: "Cooked meals",
    servings: 200,
    pickupBy: hours(4),
    distanceKm: 5.1,
    neighborhood: "MG Road",
    notes: "Breakfast buffet surplus. Refrigerated.",
    status: "Available",
  },
  {
    id: "l5",
    title: "Yogurt & milk cartons",
    donor: "DairyFresh Depot",
    donorType: "Caterer",
    category: "Dairy",
    servings: 60,
    pickupBy: hours(12),
    distanceKm: 2.6,
    neighborhood: "Whitefield",
    notes: "Sealed cartons. 3 days from expiry.",
    status: "Available",
  },
  {
    id: "l6",
    title: "Boxed snacks & juices",
    donor: "TechCorp Office",
    donorType: "Event",
    category: "Packaged",
    servings: 150,
    pickupBy: hours(20),
    distanceKm: 4.0,
    neighborhood: "Electronic City",
    notes: "Conference leftovers. Individually packed.",
    status: "Picked up",
  },
];

export const weeklyRescued = [
  { day: "Mon", meals: 320 },
  { day: "Tue", meals: 410 },
  { day: "Wed", meals: 380 },
  { day: "Thu", meals: 520 },
  { day: "Fri", meals: 690 },
  { day: "Sat", meals: 880 },
  { day: "Sun", meals: 740 },
];

export const categoryBreakdown = [
  { name: "Cooked meals", value: 42 },
  { name: "Bakery", value: 18 },
  { name: "Produce", value: 22 },
  { name: "Dairy", value: 9 },
  { name: "Packaged", value: 9 },
];
