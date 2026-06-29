const BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

export async function reserveDonation(
  donationId: number,
  token: string
) {
  const response = await fetch(`${BASE_URL}/reservation/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      donation_id: donationId,
    }),
  });

  return response.json();
}

export async function getMyReservations(token: string) {
  const response = await fetch(`${BASE_URL}/reservation/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
}

export async function pickupReservation(
  reservationId: number,
  token: string
) {
  const response = await fetch(
    `${BASE_URL}/reservation/${reservationId}/pickup`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
}

export async function completeReservation(
  reservationId: number,
  token: string
) {
  const response = await fetch(
    `${BASE_URL}/reservation/${reservationId}/complete`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
}