const BASE_URL = "http://127.0.0.1:5000/api";

export async function getDashboardStats() {
  const response = await fetch(`${BASE_URL}/dashboard`);

  return response.json();
}