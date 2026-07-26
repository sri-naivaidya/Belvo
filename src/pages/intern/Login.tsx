import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, KeyRound, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { sendOtp, verifyOtp } from "@/lib/intern-auth";

const PINK = {
  primary: "#f54397",
  light: "#ff6bb5",
  dark: "#c42a78",
  glow: "rgba(245,67,151,0.3)",
};

const VIOLET = {
  primary: "#7B2FBE",
  light: "#9D4EDD",
  glow: "rgba(123,47,190,0.3)",
};

export default function InternLogin() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);
  const otpRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === "otp" && otpRef.current) {
      otpRef.current.focus();
    }
  }, [step]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const ALLOWED_EMAIL = "intern.belvo@gmail.com";

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (email.toLowerCase() !== ALLOWED_EMAIL) {
      setError("Incorrect email address. Please use registered email address.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await sendOtp(email);
      setSuccess("OTP sent! Check your inbox.");
      setStep("otp");
      setCountdown(60);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await verifyOtp(email, otp);
      navigate("/intern/checklist");
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await sendOtp(email);
      setSuccess("OTP resent! Check your inbox.");
      setCountdown(60);
      setOtp("");
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    setOtp("");
    setError("");
    setSuccess("");
  };

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
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px",
          padding: "40px 32px",
          position: "relative",
          zIndex: 1,
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Branding */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <img
            src="/belvo-logo-transparent.png"
            alt="BELVO"
            style={{ height: "28px", width: "auto", marginBottom: "8px" }}
          />
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.7rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
              margin: 0,
            }}
          >
            Intern Portal
          </p>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "1.1rem",
            fontWeight: 600,
            color: "rgba(255,255,255,0.9)",
            textAlign: "center",
            marginBottom: "8px",
            lineHeight: 1.4,
          }}
        >
          This page belongs to the internals/employees
        </h1>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.4)",
            textAlign: "center",
            marginBottom: "28px",
          }}
        >
          {step === "email"
            ? "Enter your registered email to receive a verification code"
            : `We sent a 6-digit code to ${email}`}
        </p>

        {/* Error/Success messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 16px",
              marginBottom: "20px",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: "10px",
              color: "#ef4444",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.8rem",
            }}
          >
            <AlertCircle size={16} />
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 16px",
              marginBottom: "20px",
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.2)",
              borderRadius: "10px",
              color: "#22c55e",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.8rem",
            }}
          >
            <CheckCircle2 size={16} />
            {success}
          </motion.div>
        )}

        {/* Step 1: Email */}
        {step === "email" && (
          <form onSubmit={handleSendOtp}>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.5)",
                  marginBottom: "8px",
                  letterSpacing: "0.05em",
                }}
              >
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={16}
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "rgba(255,255,255,0.3)",
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={{
                    width: "100%",
                    padding: "14px 14px 14px 42px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px",
                    color: "#fff",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.9rem",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = VIOLET.primary;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: loading
                  ? "rgba(123,47,190,0.5)"
                  : `linear-gradient(135deg, ${VIOLET.primary}, ${VIOLET.light})`,
                border: "none",
                borderRadius: "10px",
                color: "#fff",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.3s",
                boxShadow: loading ? "none" : `0 0 20px ${VIOLET.glow}`,
              }}
            >
              {loading ? (
                <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
              ) : (
                <>
                  <Mail size={16} />
                  Send OTP
                </>
              )}
            </button>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === "otp" && (
          <>
            <form onSubmit={handleVerifyOtp}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.75rem",
                    color: "rgba(255,255,255,0.5)",
                    marginBottom: "8px",
                    letterSpacing: "0.05em",
                  }}
                >
                  Verification Code
                </label>
                <div style={{ position: "relative" }}>
                  <KeyRound
                    size={16}
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "rgba(255,255,255,0.3)",
                    }}
                  />
                  <input
                    ref={otpRef}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 6-digit code"
                    required
                    style={{
                      width: "100%",
                      padding: "14px 14px 14px 42px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "10px",
                      color: "#fff",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "1.2rem",
                      letterSpacing: "0.3em",
                      textAlign: "center",
                      outline: "none",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = VIOLET.primary;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                style={{
                  width: "100%",
                  padding: "14px",
                  background:
                    loading || otp.length !== 6
                      ? "rgba(123,47,190,0.5)"
                      : `linear-gradient(135deg, ${VIOLET.primary}, ${VIOLET.light})`,
                  border: "none",
                  borderRadius: "10px",
                  color: "#fff",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: loading || otp.length !== 6 ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "all 0.3s",
                  boxShadow:
                    loading || otp.length !== 6 ? "none" : `0 0 20px ${VIOLET.glow}`,
                }}
              >
                {loading ? (
                  <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                ) : (
                  <>
                    <KeyRound size={16} />
                    Verify
                  </>
                )}
              </button>
            </form>

            {/* Resend OTP + Back */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              <button
                onClick={handleBackToEmail}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: 0,
                }}
              >
                <ArrowLeft size={14} />
                Change email
              </button>

              <button
                onClick={handleResendOtp}
                disabled={countdown > 0}
                style={{
                  background: "none",
                  border: "none",
                  color:
                    countdown > 0
                      ? "rgba(255,255,255,0.2)"
                      : VIOLET.light,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.8rem",
                  cursor: countdown > 0 ? "not-allowed" : "pointer",
                  padding: 0,
                }}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
              </button>
            </div>
          </>
        )}
      </motion.div>

      {/* CSS for spinner animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
