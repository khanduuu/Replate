import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  useEffect(() => {

    setToken(localStorage.getItem("token"));
    setRole(localStorage.getItem("role"));
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");

    setToken(null);
    setRole(null);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Sprout className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">
            Replate
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">

          <Link
            to="/browse"
            className="rounded-full px-4 py-2 text-sm font-medium text-foreground/70 hover:bg-secondary"
          >
            Browse Food
          </Link>

          {role === "donor" && (
            <>
              <Link
                to="/donate"
                className="rounded-full px-4 py-2 text-sm font-medium text-foreground/70 hover:bg-secondary"
              >
                Donate
              </Link>

              <Link
                to="/my-donations"
                className="rounded-full px-4 py-2 text-sm font-medium text-foreground/70 hover:bg-secondary"
              >
                My Donations
              </Link>
            </>
          )}

          {role === "ngo" && (
            <Link
              to="/my-reservations"
              className="rounded-full px-4 py-2 text-sm font-medium text-foreground/70 hover:bg-secondary"
            >
              My Reservations
            </Link>
          )}

          <Link
            to="/dashboard"
            className="rounded-full px-4 py-2 text-sm font-medium text-foreground/70 hover:bg-secondary"
          >
            Dashboard
          </Link>

        </nav>

        <div className="flex items-center gap-2">
          {token ? (
  <>
    <Button
  variant="ghost"
  size="sm"
  onClick={handleLogout}
>
  Logout
</Button>

    {role === "donor" && (
      <Button asChild size="sm" className="rounded-full">
        <Link to="/donate">Post surplus</Link>
      </Button>
    )}
  </>
) : (
  <>
    <Button asChild variant="ghost" size="sm">
      <Link to="/login">Login</Link>
    </Button>

    <Button asChild size="sm" className="rounded-full">
      <Link to="/register">Register</Link>
    </Button>
  </>
)}
        </div>
      </div>
    </header>
  );
}
