import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--belvo-bg)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "40%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "60vw", height: "60vw", maxWidth: "600px", maxHeight: "600px",
        background: "radial-gradient(ellipse at center, var(--belvo-glow-blob) 0%, transparent 65%)",
        filter: "blur(70px)", pointerEvents: "none",
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: "480px" }}
      >
        <div style={{
          width: 72, height: 72, borderRadius: "16px",
          background: "linear-gradient(135deg, rgba(123,47,190,0.2), rgba(157,78,221,0.08))",
          border: "1px solid rgba(157,78,221,0.22)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 32px",
        }}>
          <SearchX size={32} style={{ color: "rgba(157,78,221,0.8)" }} />
        </div>

        <h1 style={{
          fontFamily: "'Inter', sans-serif", fontWeight: 900,
          fontSize: "clamp(4rem, 12vw, 8rem)", lineHeight: 1,
          color: "var(--belvo-text-1)", margin: "0 0 8px",
          letterSpacing: "-0.03em",
        }}>
          404
        </h1>

        <div style={{
          fontFamily: "'Inter', sans-serif", fontWeight: 600,
          fontSize: "0.68rem", letterSpacing: "0.35em",
          textTransform: "uppercase", color: "#9D4EDD",
          marginBottom: "16px",
        }}>
          Page Not Found
        </div>

        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: "0.92rem",
          lineHeight: 1.75, color: "var(--belvo-text-3)",
          margin: "0 0 36px",
        }}>
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        <Link
          href="/"
          style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            padding: "14px 36px",
            background: "linear-gradient(135deg, #7B2FBE, #9D4EDD)",
            border: "none", borderRadius: "8px", color: "#ffffff",
            fontFamily: "'Inter', sans-serif", fontWeight: 600,
            fontSize: "0.82rem", letterSpacing: "0.18em",
            textTransform: "uppercase", cursor: "pointer",
            textDecoration: "none",
            boxShadow: "0 0 32px rgba(130,40,200,0.35)",
          }}
        >
          <ArrowLeft size={15} strokeWidth={2.5} />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
