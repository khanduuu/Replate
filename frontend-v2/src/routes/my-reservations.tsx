import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

import {
    getMyReservations,
    pickupReservation,
    completeReservation,
} from "@/api/reservation";

export const Route = createFileRoute("/my-reservations")({
    component: MyReservationsPage,
});

function MyReservationsPage() {
    const [reservations, setReservations] = useState<any[]>([]);
    const [loadingId, setLoadingId] = useState<number | null>(null);

    async function loadReservations() {
        const token = localStorage.getItem("token");

        if (!token) return;

        const data = await getMyReservations(token);

        setReservations(data);
    }
    async function handleComplete(reservationId: number) {
        const token = localStorage.getItem("token");

        if (!token) return;

        setLoadingId(reservationId);

        try {
            const result = await completeReservation(reservationId, token);

            toast.success(result.message);

            await loadReservations();
        } finally {
            setLoadingId(null);
        }
    }
    async function handlePickup(reservationId: number) {
        const token = localStorage.getItem("token");

        if (!token) return;

        setLoadingId(reservationId);

        try {
            const result = await pickupReservation(reservationId, token);

            toast.success(result.message);

            await loadReservations();
        } finally {
            setLoadingId(null);
        }
    }

    useEffect(() => {
        loadReservations();
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <SiteHeader />

            <section className="mx-auto max-w-6xl px-6 py-12">

                <h1 className="mb-8 text-4xl font-bold">
                    My Reservations
                </h1>

                <div className="space-y-4">

                    {reservations.length === 0 ? (
                        <div className="rounded-xl border p-6 text-center">
                            No reservations found.
                        </div>
                    ) : (
                        reservations.map((reservation) => (
                            <div
                                key={reservation.reservation_id}
                                className="rounded-2xl border bg-card p-6 shadow-sm"
                            >
                                <div className="flex items-center justify-between">

                                    <div>

                                        <h2 className="text-2xl font-semibold">
                                            {reservation.food_name}
                                        </h2>

                                        <p className="text-muted-foreground">
                                            📍 {reservation.address}
                                        </p>

                                        <p>
                                            🍽 {reservation.quantity} servings
                                        </p>

                                        <span
                                            className={
                                                "rounded-full px-3 py-1 text-sm font-medium " +
                                                (reservation.status === "pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : reservation.status === "picked_up"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-green-100 text-green-700")
                                            }
                                        >
                                            {reservation.status === "pending"
                                                ? "🟡 Pending"
                                                : reservation.status === "picked_up"
                                                    ? "🔵 Picked Up"
                                                    : "✅ Completed"}
                                        </span>

                                    </div>

                                    {reservation.status === "pending" ? (
                                        <button
                                            onClick={() => handlePickup(reservation.reservation_id)}
                                            disabled={loadingId === reservation.reservation_id}
                                            className="rounded bg-green-600 px-4 py-2 text-white disabled:opacity-50"
                                        >
                                            {loadingId === reservation.reservation_id
                                                ? "Picking Up..."
                                                : "Mark Picked Up"}
                                        </button>
                                    ) : reservation.status === "picked_up" ? (
                                        <button
                                            onClick={() => handleComplete(reservation.reservation_id)}
                                            disabled={loadingId === reservation.reservation_id}
                                            className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
                                        >
                                            {loadingId === reservation.reservation_id
                                                ? "Completing..."
                                                : "Complete Donation"}
                                        </button>
                                    ) : (
                                        <span className="rounded bg-green-100 px-4 py-2 font-medium text-green-700">
                                            ✅ Completed
                                        </span>
                                    )}

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