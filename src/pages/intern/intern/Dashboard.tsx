import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  LogOut,
  User,
  Mail,
  Clock,
  BookOpen,
  Users,
  FileText,
  ArrowRight,
} from "lucide-react";
import { isAuthenticated, getEmail, logout } from "@/lib/intern-auth";

const PINK = {
  primary: "#f54397",
  glow: "rgba(245,67,151,0.3)",
};

const VIOLET = {
  primary: "#7B2FBE",
  light: "#9D4EDD",
  glow: "rgba(123,47,190,0.3)",
};

export default function InternDashboard() {
  const [, navigate] = useLocation();
  const [loginTime, setLoginTime] = useState("");
  const email = getEmail();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/intern/login");
      return;
    }
    setLoginTime(
      new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      })
    );
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/intern/login");
  };

  const placeholderSections = [
    {
      icon: <FileText size={20} />,
      title: "Your Tasks",
      description: "No tasks assigned yet. Check back soon!",
    },
    {
      icon: <BookOpen size={20} />,
      title: "Resources",
      description: "Access learning materials and documents.",
      link: "/notes-pdfs",
      linkLabel: "View Resources",
    },
    {
      icon: <Users size={20} />,
      title: "Team",
      description: "Meet the BELVO collective.",
      link: "/#team",
      linkLabel: "View Team",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#0a0a0f",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "fixed",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          background: `radial-gradient(circle, ${VIOLET.glow} 0%, transparent 70%)`,
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "40px 24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "40px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <img
              src="/belvo-logo-transparent.png"
              alt="BELVO"
              style={{ height: "24px", width: "auto", marginBottom: "16px" }}
            />
            <h1
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
                fontWeight: 700,
                color: "#fff",
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              This page belongs to the
              <br />
              <span
                style={{
                  background: `linear-gradient(135deg, #fff 0%, ${VIOLET.light} 50%, ${PINK.primary} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                internals/employees
              </span>
            </h1>
          </div>

          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              color: "rgba(255,255,255,0.6)",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.82rem",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
              e.currentTarget.style.color = "#ef4444";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              e.currentTarget.style.color = "rgba(255,255,255,0.6)";
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            padding: "28px",
            marginBottom: "32px",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                background: `linear-gradient(135deg, ${VIOLET.primary}, ${VIOLET.light})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <User size={28} style={{ color: "#fff" }} />
            </div>
            <div>
              <h2
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "#fff",
                  margin: 0,
                }}
              >
                Welcome, Intern
              </h2>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.8rem",
                  color: "rgba(255,255,255,0.4)",
                  margin: "2px 0 0",
                }}
              >
                Intern / Employee
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <ProfileRow
              icon={<Mail size={16} />}
              label="Email"
              value={email || "N/A"}
            />
            <ProfileRow
              icon={<Clock size={16} />}
              label="Login Time"
              value={loginTime || "N/A"}
            />
          </div>
        </motion.div>

        {/* Sections Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          {placeholderSections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
            >
              <SectionCard
                icon={section.icon}
                title={section.title}
                description={section.description}
                link={section.link}
                linkLabel={section.linkLabel}
              />
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.72rem",
            color: "rgba(255,255,255,0.2)",
            textAlign: "center",
            marginTop: "48px",
          }}
        >
          BELVO Intern Portal — belvo.buzz
        </motion.p>
      </div>
    </div>
  );
}

function ProfileRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 16px",
        background: "rgba(255,255,255,0.02)",
        borderRadius: "10px",
        border: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <span style={{ color: VIOLET.light, flexShrink: 0 }}>{icon}</span>
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.72rem",
          color: "rgba(255,255,255,0.35)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          width: "80px",
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.85rem",
          color: "rgba(255,255,255,0.8)",
          wordBreak: "break-all",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function SectionCard({
  icon,
  title,
  description,
  link,
  linkLabel,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  link?: string;
  linkLabel?: string;
}) {
  const content = (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "14px",
        padding: "24px",
        height: "100%",
        transition: "all 0.3s",
        cursor: link ? "pointer" : "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(123,47,190,0.3)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ color: VIOLET.light, marginBottom: "12px" }}>{icon}</div>
      <h3
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.95rem",
          fontWeight: 600,
          color: "#fff",
          margin: "0 0 8px",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.8rem",
          color: "rgba(255,255,255,0.4)",
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>
      {link && linkLabel && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginTop: "16px",
            color: VIOLET.light,
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.78rem",
            fontWeight: 500,
          }}
        >
          {linkLabel}
          <ArrowRight size={14} />
        </div>
      )}
    </div>
  );

  if (link) {
    return (
      <a
        href={link}
        style={{ textDecoration: "none", display: "block", height: "100%" }}
      >
        {content}
      </a>
    );
  }

  return content;
}
