const BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

export async function register(
  name: string,
  email: string,
  password: string,
  role: string
) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
      role,
    }),
  });

  return response.json();
}