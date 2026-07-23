import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ExternalLink, Lock, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "wouter";

type AccessRecord = {
  granted: boolean;
  name: string;
  email: string;
  requestedAt: string;
};

const STORAGE_KEY = "belvo-lms-access";
const LMS_DRIVE_LINK = "https://drive.google.com/drive/folders/your-folder-id";

export default function LLMs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [accessGranted, setAccessGranted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed: AccessRecord = JSON.parse(stored);
      if (parsed?.granted) {
        setAccessGranted(true);
        setSubmittedName(parsed.name || "");
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail) {
      setError("Please enter both your name and Gmail ID.");
      return;
    }

    const payload: AccessRecord = {
      granted: true,
      name: trimmedName,
      email: trimmedEmail,
      requestedAt: new Date().toISOString(),
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setAccessGranted(true);
    setSubmittedName(trimmedName);
    setError("");
  };

  const handleReset = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setAccessGranted(false);
    setSubmittedName("");
    setName("");
    setEmail("");
    setError("");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f6fc", fontFamily: "'Inter',sans-serif" }}>
      <div style={{ maxWidth: "980px", margin: "0 auto", padding: "48px 24px 80px" }}>
        <Link href="/careers">
          <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "#7B2FBE", fontSize: "0.85rem", fontWeight: 500, marginBottom: "24px" }}>
            <ArrowLeft size={16} /> Back to Careers
          </span>
        </Link>

        <div style={{ marginBottom: "12px" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9D4EDD" }}>
            Admin Access Required
          </span>
        </div>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#1a1a1a", margin: "0 0 8px", lineHeight: 1.15 }}>
          Explore LMS
        </h1>
        <p style={{ fontSize: "0.95rem", color: "#666", margin: "0 0 28px", maxWidth: "700px" }}>
          Request access to the curated LMS resources portal. Once your request is submitted, the resources unlock for this browser.
        </p>

        {!accessGranted ? (
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            style={{ background: "#ffffff", border: "1px solid rgba(157,78,221,0.14)", borderRadius: "24px", padding: "28px", boxShadow: "0 16px 48px rgba(15,23,42,0.06)" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(157,78,221,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Lock size={18} color="#9D4EDD" />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.04rem", fontWeight: 700, color: "#1a1a1a" }}>Request Access</h2>
                <p style={{ margin: "2px 0 0", fontSize: "0.83rem", color: "#777" }}>Submit your details to unlock the LMS resources.</p>
              </div>
            </div>

            <div style={{ display: "grid", gap: "16px" }}>
              <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", fontWeight: 600, color: "#333" }}>
                Name
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1px solid rgba(157,78,221,0.2)", outline: "none", boxSizing: "border-box" }}
                />
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", fontWeight: 600, color: "#333" }}>
                Gmail ID
                <div style={{ position: "relative" }}>
                  <Mail size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9D4EDD" }} />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="you@gmail.com"
                    style={{ width: "100%", padding: "12px 14px 12px 42px", borderRadius: "12px", border: "1px solid rgba(157,78,221,0.2)", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              </label>
            </div>

            {error ? (
              <p style={{ color: "#d14343", fontSize: "0.84rem", margin: "14px 0 0" }}>{error}</p>
            ) : null}

            <button
              type="submit"
              style={{ marginTop: "22px", display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 22px", background: "linear-gradient(135deg,#7B2FBE,#9D4EDD)", border: "none", borderRadius: "10px", color: "#ffffff", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer" }}
            >
              Submit Request <ArrowUpRight size={14} />
            </button>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ background: "#ffffff", border: "1px solid rgba(157,78,221,0.14)", borderRadius: "24px", padding: "28px", boxShadow: "0 16px 48px rgba(15,23,42,0.06)" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(157,78,221,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ShieldCheck size={18} color="#9D4EDD" />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.04rem", fontWeight: 700, color: "#1a1a1a" }}>Access Granted</h2>
                <p style={{ margin: "2px 0 0", fontSize: "0.83rem", color: "#777" }}>Welcome {submittedName || "there"}, the LMS portal is unlocked.</p>
              </div>
            </div>

            <div style={{ border: "1px solid rgba(157,78,221,0.16)", borderRadius: "16px", padding: "20px", background: "linear-gradient(135deg, rgba(123,47,190,0.06), rgba(157,78,221,0.03))" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <Sparkles size={16} color="#9D4EDD" />
                <span style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#7B2FBE" }}>LMS Resource Link</span>
              </div>
              <p style={{ margin: "0 0 14px", fontSize: "0.92rem", color: "#555" }}>
                Use the link below to access the curated LMS drive folder.
              </p>
              <a
                href={LMS_DRIVE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 16px", borderRadius: "10px", background: "#fff", border: "1px solid rgba(157,78,221,0.2)", color: "#7B2FBE", fontWeight: 700, textDecoration: "none" }}
              >
                Open LMS Drive <ExternalLink size={14} />
              </a>
            </div>

            <button
              onClick={handleReset}
              style={{ marginTop: "18px", display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 16px", background: "transparent", border: "1px solid rgba(157,78,221,0.2)", borderRadius: "10px", color: "#7B2FBE", fontWeight: 600, cursor: "pointer" }}
            >
              Reset access
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
