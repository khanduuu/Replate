const BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

export async function getMyDonations(token: string) {
  const response = await fetch(`${BASE_URL}/donation/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

return {
  ok: response.ok,
  status: response.status,
  data,
};
}
export async function deleteDonation(id: number, token: string) {
  const response = await fetch(`${BASE_URL}/donation/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

return {
  ok: response.ok,
  status: response.status,
  data,
};
}
export async function updateDonation(
  id: number,
  donation: any,
  token: string
) {
  const response = await fetch(
    `${BASE_URL}/donation/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(donation),
    }
  );

  const data = await response.json();

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}