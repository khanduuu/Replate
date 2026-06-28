const BASE_URL = "http://127.0.0.1:5000/api";

export async function getAllDonations() {
    const response = await fetch(`${BASE_URL}/donation/all`);
    const data = await response.json();

return {
  ok: response.ok,
  status: response.status,
  data,
};
}

export async function createDonation(
  donation: any,
  token: string
) {
  const response = await fetch(`${BASE_URL}/donation/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(donation),
  });

  const data = await response.json();

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}


