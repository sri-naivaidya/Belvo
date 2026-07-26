import { Link } from "wouter";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

const VIOLET = {
  primary: "#7B2FBE",
  light: "#9D4EDD",
  glow: "rgba(123,47,190,0.3)",
};

export default function ClientComingSoon() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0f",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "500px",
          height: "500px",
          background: `radial-gradient(circle, ${VIOLET.glow} 0%, transparent 70%)`,
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          textAlign: "center",
          maxWidth: "480px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "20px",
            background: `linear-gradient(135deg, ${VIOLET.primary}, ${VIOLET.light})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 28px",
            boxShadow: `0 0 30px ${VIOLET.glow}`,
          }}
        >
          <Lock size={32} style={{ color: "#fff" }} />
        </motion.div>

        {/* Branding */}
        <img
          src="/belvo-logo-transparent.png"
          alt="BELVO"
          style={{ height: "24px", width: "auto", marginBottom: "20px" }}
        />

        <h1
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
            fontWeight: 700,
            color: "#fff",
            margin: "0 0 12px",
          }}
        >
          Client Portal
        </h1>

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "1.2rem",
            fontWeight: 600,
            background: `linear-gradient(135deg, ${VIOLET.light}, #f54397)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: "0 0 16px",
          }}
        >
          Coming Soon
        </p>

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.9rem",
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.7,
            margin: "0 0 36px",
          }}
        >
          We are building something amazing for our clients. Stay tuned for a
          seamless experience to manage your projects, track progress, and
          connect with our team.
        </p>

        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "14px 32px",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "10px",
            color: "#fff",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: "0.82rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            textDecoration: "none",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = VIOLET.light;
            e.currentTarget.style.color = VIOLET.light;
            e.currentTarget.style.boxShadow = `0 0 20px ${VIOLET.glow}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Return to Home
        </Link>
      </motion.div>
    </div>
  );
}
