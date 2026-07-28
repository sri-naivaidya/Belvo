"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Lock, Mail, UserRound } from "lucide-react";
import { Button, Input } from "@/components/ui/shared";

type Mode = "sign-in" | "sign-up";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    let didStartRedirect = false;
    setLoading(true);
    setRedirecting(false);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        mode === "sign-up" ? "/api/auth/signup" : "/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, fullName }),
        },
      );
      const result = (await response.json()) as {
        error?: string;
        user?: { role: "admin" | "client" };
      };
      if (!response.ok || !result.user)
        throw new Error(
          result.error || "Unable to continue. Please try again.",
        );
      const destination =
        result.user.role === "admin" ? "/admin/dashboard" : "/client/dashboard";
      didStartRedirect = true;
      setRedirecting(true);
      setMessage(
        result.user.role === "admin"
          ? "Signed in. Redirecting to the admin dashboard..."
          : "Signed in. Redirecting to your dashboard...",
      );
      router.replace(destination);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to continue. Please try again.",
      );
      setRedirecting(false);
      setLoading(false);
    } finally {
      if (!didStartRedirect) setLoading(false);
    }
  }

  function changeMode(nextMode: Mode) {
    if (loading || redirecting) return;
    setMode(nextMode);
    setError("");
    setMessage("");
    setRedirecting(false);
  }

  return (
    <div className="flex min-h-screen">
      <aside className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-[#4C1D95] via-[#7C3AED] to-[#6D28D9] lg:flex lg:items-center lg:justify-center">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-20 right-10 h-80 w-80 rounded-full bg-white/[0.06] blur-3xl" />
        <div className="relative z-10 max-w-lg px-12 text-center">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-2xl font-bold text-white ring-1 ring-white/20">
            B
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white">
            Belvo Portal
          </h1>
          <p className="text-lg leading-relaxed text-purple-100/80">
            Your secure client collaboration platform for managing work,
            milestones, and delivery.
          </p>
        </div>
      </aside>

      <main className="flex w-full items-center justify-center bg-[#F9FAFB] px-6 lg:w-1/2">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-text-primary">
              {mode === "sign-in" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              {mode === "sign-in"
                ? "Sign in to continue to your portal."
                : "New accounts are created as client accounts."}
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="mb-5 rounded-lg border border-danger/20 bg-danger-50 px-3 py-2.5 text-sm text-danger"
            >
              {error}
            </p>
          )}
          {message && (
            <p
              role="status"
              aria-live="polite"
              className={`mb-5 rounded-lg border px-3 py-2.5 text-sm ${
                redirecting
                  ? "border-primary/20 bg-primary-50 text-primary"
                  : "border-success/20 bg-success-50 text-success"
              }`}
            >
              <span className="flex items-center gap-2">
                {redirecting && (
                  <span className="h-2 w-2 rounded-full bg-primary ring-4 ring-primary/15" />
                )}
                {message}
              </span>
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" aria-busy={loading || redirecting}>
            {mode === "sign-up" && (
              <div>
                <label
                  htmlFor="full-name"
                  className="mb-1.5 block text-sm font-medium text-text-primary"
                >
                  Full name
                </label>
                <Input
                  id="full-name"
                  type="text"
                  placeholder="Your name"
                  icon={<UserRound className="h-4 w-4" />}
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  required
                />
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-text-primary"
              >
                Email address
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                icon={<Mail className="h-4 w-4" />}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-text-primary"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={
                    mode === "sign-in" ? "current-password" : "new-password"
                  }
                  minLength={8}
                  placeholder="Enter your password"
                  icon={<Lock className="h-4 w-4" />}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              size="lg"
              loading={loading || redirecting}
              icon={<ArrowRight className="h-4 w-4" />}
              className="w-full"
              disabled={loading || redirecting}
            >
              {redirecting
                ? "Redirecting..."
                : mode === "sign-in"
                  ? "Sign in"
                  : "Create account"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-text-secondary">
            {mode === "sign-in"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() =>
                changeMode(mode === "sign-in" ? "sign-up" : "sign-in")
              }
              disabled={loading || redirecting}
              className="font-medium text-primary hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {mode === "sign-in" ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
