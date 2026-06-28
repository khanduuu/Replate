import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { login } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      const { ok, data } = await login(email, password);

if (ok) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.role);
  localStorage.setItem("name", data.name);

  toast.success("Login successful!");

  window.location.href = "/";
} else {
  toast.error(data.message);
}
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto mt-20 max-w-md rounded-3xl border p-8">
      <h1 className="mb-6 text-3xl font-bold">Login</h1>

      <form onSubmit={handleLogin} className="space-y-5">

        <div>
          <Label>Email</Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
        </div>

        <div>
          <Label>Password</Label>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        </div>

        <Button type="submit" disabled={loading}>
  {loading ? "Logging in..." : "Login"}
</Button>

      </form>
    </div>
  );
}