import { toast } from "sonner";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
 
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


import {
  getMyDonations,
  deleteDonation,
  updateDonation,
} from "@/api/myDonation";

export const Route = createFileRoute("/my-donations")({
  component: MyDonationsPage,
});

function MyDonationsPage() {
    
  const [donations, setDonations] = useState<any[]>([]); 
      async function loadDonations() {
      const token = localStorage.getItem("token");

      if (!token) return;

      const result = await getMyDonations(token);

if (result.ok) {
  setDonations(result.data);
} else {
  toast.error(result.data.message);
}
    }

  useEffect(() => {
   

    loadDonations();
  }, []);
      async function handleDelete(id: number) {
  const token = localStorage.getItem("token");

  if (!token) return;

  const result = await deleteDonation(id, token);

 toast.success(result.data.message);

  await loadDonations();
} 
       async function handleEdit(donation: any) {
  const token = localStorage.getItem("token");

  if (!token) return;

  const food_name = prompt("Food name", donation.food_name);

  if (!food_name) return;

  const quantity = prompt(
    "Quantity",
    donation.quantity.toString()
  );

  if (!quantity) return;

  const address = prompt(
    "Address",
    donation.address
  );

  if (!address) return;

  const result = await updateDonation(
    donation.id,
    {
      food_name,
      quantity: Number(quantity),
      address,
    },
    token
  );

 toast.success(result.data.message);

  await loadDonations();
}

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-6 py-12">

  <h1 className="mb-8 text-4xl font-bold">
    My Donations
  </h1>

  <div className="space-y-4">

    {donations.length === 0 ? (
      <div className="rounded-xl border p-6 text-center">
        No donations found.
      </div>
    ) : (
      donations.map((donation) => (
        <div
          key={donation.id}
          className="rounded-2xl border bg-card p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-semibold">
                {donation.food_name}
              </h2>

              <p className="text-muted-foreground">
                📍 {donation.address}
              </p>

              <p>
                🍽 {donation.quantity} servings
              </p>

              <span
  className={
    "rounded-full px-3 py-1 text-sm font-medium " +
    (donation.status === "available"
      ? "bg-green-100 text-green-700"
      : donation.status === "reserved"
      ? "bg-yellow-100 text-yellow-700"
      : donation.status === "picked_up"
      ? "bg-blue-100 text-blue-700"
      : "bg-gray-200 text-gray-700")
  }
>
  {donation.status === "available"
    ? "🟢 Available"
    : donation.status === "reserved"
    ? "🟡 Reserved"
    : donation.status === "picked_up"
    ? "🔵 Picked Up"
    : "✅ Completed"}
</span>
            </div>

            <div className="flex gap-3">

              <button
                    onClick={() => handleEdit(donation)}
                    className="rounded bg-blue-600 px-4 py-2 text-white"
                    >
                    Edit
              </button>

             <AlertDialog>
  <AlertDialogTrigger asChild>
    <button className="rounded bg-red-600 px-4 py-2 text-white">
      Delete
    </button>
  </AlertDialogTrigger>

  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>
        Delete Donation?
      </AlertDialogTitle>

      <AlertDialogDescription>
        This action cannot be undone. This donation will be permanently deleted.
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter>
      <AlertDialogCancel>
        Cancel
      </AlertDialogCancel>

      <AlertDialogAction
        onClick={() => handleDelete(donation.id)}
      >
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
            </div>

          </div>
        </div>
      ))
    )}

  </div>

</section>

      <SiteFooter />
    </div>
  );
}
