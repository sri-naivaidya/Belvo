import { useState } from "react";
import { login } from "@/lib/admin-api";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    setLoading(true);
    setError("");
    try {
      await login(username, password);
      window.location.href = "/admin";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0f",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Purple glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(123,47,190,0.15), transparent 65%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <form
        onSubmit={handleSubmit}
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "400px",
          margin: "0 20px",
          padding: "48px 40px",
          background: "#12121a",
          border: "1px solid #1f1f2a",
          borderRadius: "20px",
          backdropFilter: "blur(14px)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 900,
              fontSize: "1.6rem",
              color: "#fff",
              letterSpacing: "-0.03em",
              marginBottom: 4,
            }}
          >
            BELVO
          </div>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#9D4EDD",
            }}
          >
            Admin Panel
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label
            htmlFor="username"
            style={{
              display: "block",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#9ca3af",
              marginBottom: 8,
            }}
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter admin username"
            autoFocus
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px 16px",
              background: "#0d0d15",
              border: "1px solid #1f1f2a",
              borderRadius: "12px",
              color: "#e4e4e7",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.9rem",
              outline: "none",
              transition: "border-color 0.2s",
              boxSizing: "border-box",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#9D4EDD66")}
            onBlur={(e) => (e.target.style.borderColor = "#1f1f2a")}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label
            htmlFor="password"
            style={{
              display: "block",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#9ca3af",
              marginBottom: 8,
            }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px 16px",
              background: "#0d0d15",
              border: "1px solid #1f1f2a",
              borderRadius: "12px",
              color: "#e4e4e7",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.9rem",
              outline: "none",
              transition: "border-color 0.2s",
              boxSizing: "border-box",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#9D4EDD66")}
            onBlur={(e) => (e.target.style.borderColor = "#1f1f2a")}
          />
        </div>

        {error && (
          <div
            style={{
              padding: "10px 14px",
              background: "rgba(220,38,38,0.1)",
              border: "1px solid rgba(220,38,38,0.3)",
              borderRadius: "10px",
              color: "#ef4444",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.8rem",
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !username.trim() || !password.trim()}
          style={{
            width: "100%",
            padding: "14px 24px",
            background: loading ? "#5a2d8a" : "linear-gradient(135deg, #7B2FBE, #9D4EDD)",
            border: "none",
            borderRadius: "12px",
            color: "#fff",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: "0.85rem",
            letterSpacing: "0.05em",
            cursor: loading || !username.trim() || !password.trim() ? "not-allowed" : "pointer",
            opacity: loading || !password.trim() ? 0.6 : 1,
            transition: "opacity 0.2s",
          }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
