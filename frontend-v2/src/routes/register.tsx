import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { register } from "@/api/register";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("donor");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
  e.preventDefault();

  setLoading(true);

  try {
    const result = await register(
      name,
      email,
      password,
      role
    );

    if (result.message === "User registered successfully") {
      toast.success(result.message);

      window.location.href = "/login";
    } else {
      toast.error(result.message);
    }
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md rounded-2xl border bg-card p-8 shadow"
      >
        <h1 className="mb-6 text-center text-3xl font-bold">
          Register
        </h1>

        <Input
          className="mb-4"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          className="mb-4"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          className="mb-4"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          className="mb-6 w-full rounded border p-2"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="donor">Donor</option>
          <option value="ngo">NGO</option>
        </select>

        <Button
  type="submit"
  className="w-full"
  disabled={loading}
>
  {loading ? "Registering..." : "Register"}
</Button>
      </form>
    </div>
  );
}