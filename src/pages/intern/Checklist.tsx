import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  FileText,
  CreditCard,
  GraduationCap,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
  Upload,
  Download,
  Shield,
  Instagram,
  Linkedin,
  MessageCircle,
  Users,
} from "lucide-react";
import {
  isAuthenticated,
  getEmail,
  getChecklistStatus,
  submitOfferLetter,
  submitIdCard,
  submitNda,
  markSocial,
  markChecklistItem,
} from "@/lib/intern-auth";

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

const LMS_URL =
  "https://drive.google.com/drive/folders/1LROsyAXCedL25SuulwQ6adxxnkHtfivh?usp=drive_link";

const INSTAGRAM_URL = "https://www.instagram.com/belvo_official/";
const LINKEDIN_URL = "https://www.linkedin.com/company/belvo.buzz/";
const WHATSAPP_URL = "https://chat.whatsapp.com/EoicXUyjXfD9Zvy47ursid?mode=gi_t";

interface ChecklistStatus {
  watchedLms: boolean;
  offerLetter: boolean;
  idCard: boolean;
  instagram: boolean;
  linkedin: boolean;
  whatsapp: boolean;
  nda: boolean;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px",
  color: "#fff",
  fontFamily: "'Inter', sans-serif",
  fontSize: "0.85rem",
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "'Inter', sans-serif",
  fontSize: "0.72rem",
  color: "rgba(255,255,255,0.5)",
  marginBottom: "6px",
  letterSpacing: "0.05em",
  textTransform: "uppercase",
};

export default function InternChecklist() {
  const [, navigate] = useLocation();
  const [status, setStatus] = useState<ChecklistStatus>({
    watchedLms: false,
    offerLetter: false,
    idCard: false,
    instagram: false,
    linkedin: false,
    whatsapp: false,
    nda: false,
  });
  const [loading, setLoading] = useState(true);
  const [activeForm, setActiveForm] = useState<"offer" | "idcard" | "nda" | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const email = getEmail();

  // Offer letter form
  const [olName, setOlName] = useState("");
  const [olAge, setOlAge] = useState("");
  const [olAadhar, setOlAadhar] = useState("");
  const [olDesignation, setOlDesignation] = useState("");
  const [olTenure, setOlTenure] = useState("");
  const [olAddress, setOlAddress] = useState("");

  // ID card form
  const [idName, setIdName] = useState("");
  const [idDepartment, setIdDepartment] = useState("");
  const [idPhoto, setIdPhoto] = useState<File | null>(null);
  const [idPhotoPreview, setIdPhotoPreview] = useState<string | null>(null);

  // NDA form
  const [ndaFile, setNdaFile] = useState<File | null>(null);
  const [ndaFileName, setNdaFileName] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/intern/login");
      return;
    }
    setStatus(getChecklistStatus());
    setLoading(false);
  }, [navigate]);

  const allComplete =
    status.watchedLms &&
    status.offerLetter &&
    status.idCard &&
    status.instagram &&
    status.linkedin &&
    status.whatsapp &&
    status.nda;

  const handleOfferLetterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!olName || !olAge || !olAadhar || !olDesignation || !olTenure || !olAddress) {
      setError("All fields are required");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await submitOfferLetter({
        name: olName,
        age: olAge,
        aadharNumber: olAadhar,
        designation: olDesignation,
        tenure: olTenure,
        address: olAddress,
      });
      setStatus((prev) => ({ ...prev, offerLetter: true }));
      setActiveForm(null);
      setSuccess("Offer letter request submitted!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  const handleIdCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idName || !idDepartment || !idPhoto) {
      setError("Name, department, and photo are required");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      let photoBase64 = "";
      if (idPhoto) {
        photoBase64 = await fileToBase64(idPhoto);
      }
      await submitIdCard({ name: idName, department: idDepartment, photoBase64 });
      setStatus((prev) => ({ ...prev, idCard: true }));
      setActiveForm(null);
      setSuccess("ID card request submitted!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNdaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ndaFile) {
      setError("Please select a PDF file");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const pdfBase64 = await fileToBase64(ndaFile);
      await submitNda(pdfBase64);
      setStatus((prev) => ({ ...prev, nda: true }));
      setActiveForm(null);
      setSuccess("NDA submitted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSocialClick = async (item: "instagram" | "linkedin" | "whatsapp") => {
    const urls = { instagram: INSTAGRAM_URL, linkedin: LINKEDIN_URL, whatsapp: WHATSAPP_URL };
    window.open(urls[item], "_blank");
    try {
      await markSocial(item);
      setStatus((prev) => ({ ...prev, [item]: true }));
    } catch {
      // silently fail, user can retry
    }
  };

  const toggleLocalItem = (item: keyof ChecklistStatus, value: boolean) => {
    const raw = localStorage.getItem("belvo_intern_checklist");
    const current = raw ? JSON.parse(raw) : {};
    current[item] = value;
    localStorage.setItem("belvo_intern_checklist", JSON.stringify(current));
    setStatus((prev) => ({ ...prev, [item]: value }));
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Photo must be under 5MB");
        return;
      }
      setIdPhoto(file);
      const reader = new FileReader();
      reader.onload = () => setIdPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleNdaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setError("Only PDF files are accepted");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("File must be under 10MB");
        return;
      }
      setNdaFile(file);
      setNdaFileName(file.name);
    }
  };

  const handleProceed = async () => {
    try {
      await fetch("http://localhost:3001/intern/submit-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          offerLetter: status.offerLetter ? { name: olName, age: olAge, aadharNumber: olAadhar, designation: olDesignation, tenure: olTenure, address: olAddress } : null,
          idCard: status.idCard ? { name: idName, department: idDepartment } : null,
          nda: status.nda,
          social: { instagram: status.instagram, linkedin: status.linkedin, whatsapp: status.whatsapp },
        }),
      });
    } catch {
      // silently fail
    }
    navigate("/about");
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0f",
        }}
      >
        <Loader2
          size={32}
          style={{ color: VIOLET.light, animation: "spin 1s linear infinite" }}
        />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

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
          width: "600px",
          height: "600px",
          background: `radial-gradient(circle, ${VIOLET.glow} 0%, transparent 70%)`,
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: "100%",
          maxWidth: "480px",
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
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <img
            src="/belvo-logo-transparent.png"
            alt="BELVO"
            style={{ height: "24px", width: "auto", marginBottom: "8px" }}
          />
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
              margin: 0,
            }}
          >
            Onboarding Checklist
          </p>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "1.2rem",
            fontWeight: 700,
            color: "#fff",
            textAlign: "center",
            marginBottom: "6px",
          }}
        >
          Welcome! Complete Your Onboarding
        </h1>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.82rem",
            color: "rgba(255,255,255,0.4)",
            textAlign: "center",
            marginBottom: "28px",
          }}
        >
          All 7 items must be completed to proceed
        </p>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.7rem",
            color: "rgba(239,68,68,0.6)",
            textAlign: "center",
            marginTop: "-22px",
            marginBottom: "28px",
            letterSpacing: "0.02em",
          }}
        >
          Providing false information may result in disciplinary action.
        </p>

        {/* Messages */}
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

        {/* Checklist Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "28px" }}>
          {/* Item 1: LMS */}
          <ChecklistItem
            completed={status.watchedLms}
            icon={<GraduationCap size={20} />}
            title="You have watched LMS"
            action={
              !status.watchedLms ? (
                <a
                  href={LMS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: VIOLET.light,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    textDecoration: "none",
                    transition: "all 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(123,47,190,0.15)";
                    e.currentTarget.style.borderColor = VIOLET.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                >
                  Watch Now
                  <ExternalLink size={14} />
                </a>
              ) : (
                <span style={{ color: "#22c55e", fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 500 }}>
                  Completed ✓
                </span>
              )
            }
            onToggle={async () => {
              try {
                await markChecklistItem("watchedLms");
                setStatus((prev) => ({ ...prev, watchedLms: !prev.watchedLms }));
              } catch {
                // silently fail
              }
            }}
          />

          {/* Item 2: Offer Letter */}
          <ChecklistItem
            completed={status.offerLetter}
            icon={<FileText size={20} />}
            title="You got an offer letter"
            action={
              !status.offerLetter ? (
                <button
                  onClick={() => setActiveForm("offer")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: VIOLET.light,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(123,47,190,0.15)";
                    e.currentTarget.style.borderColor = VIOLET.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                >
                  Tap to Get
                  <ExternalLink size={14} />
                </button>
              ) : (
                <span style={{ color: "#22c55e", fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 500 }}>
                  Completed ✓
                </span>
              )
            }
            onToggle={async () => {
              try {
                await markChecklistItem("offerLetter");
                setStatus((prev) => ({ ...prev, offerLetter: !prev.offerLetter }));
              } catch {
                // silently fail
              }
            }}
          />

          {/* Item 3: ID Card */}
          <ChecklistItem
            completed={status.idCard}
            icon={<CreditCard size={20} />}
            title="You got an ID card"
            action={
              !status.idCard ? (
                <button
                  onClick={() => setActiveForm("idcard")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: VIOLET.light,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(123,47,190,0.15)";
                    e.currentTarget.style.borderColor = VIOLET.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                >
                  Tap to Get
                  <ExternalLink size={14} />
                </button>
              ) : (
                <span style={{ color: "#22c55e", fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 500 }}>
                  Completed ✓
                </span>
              )
            }
            onToggle={async () => {
              try {
                await markChecklistItem("idCard");
                setStatus((prev) => ({ ...prev, idCard: !prev.idCard }));
              } catch {
                // silently fail
              }
            }}
          />

          {/* Item 4: Instagram */}
          <ChecklistItem
            completed={status.instagram}
            icon={<Instagram size={20} />}
            title="Follow us on Instagram"
            action={
              !status.instagram ? (
                <button
                  onClick={() => handleSocialClick("instagram")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: VIOLET.light,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(123,47,190,0.15)";
                    e.currentTarget.style.borderColor = VIOLET.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                >
                  Follow
                  <ExternalLink size={14} />
                </button>
              ) : (
                <span style={{ color: "#22c55e", fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 500 }}>
                  Completed ✓
                </span>
              )
            }
            onToggle={async () => {
              if (!status.instagram) {
                handleSocialClick("instagram");
              } else {
                toggleLocalItem("instagram", false);
              }
            }}
          />

          {/* Item 5: LinkedIn */}
          <ChecklistItem
            completed={status.linkedin}
            icon={<Linkedin size={20} />}
            title="Connect with us on LinkedIn"
            action={
              !status.linkedin ? (
                <button
                  onClick={() => handleSocialClick("linkedin")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: VIOLET.light,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(123,47,190,0.15)";
                    e.currentTarget.style.borderColor = VIOLET.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                >
                  Connect
                  <ExternalLink size={14} />
                </button>
              ) : (
                <span style={{ color: "#22c55e", fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 500 }}>
                  Completed ✓
                </span>
              )
            }
            onToggle={async () => {
              if (!status.linkedin) {
                handleSocialClick("linkedin");
              } else {
                toggleLocalItem("linkedin", false);
              }
            }}
          />

          {/* Item 6: WhatsApp */}
          <ChecklistItem
            completed={status.whatsapp}
            icon={<MessageCircle size={20} />}
            title="Join our WhatsApp Community"
            action={
              !status.whatsapp ? (
                <button
                  onClick={() => handleSocialClick("whatsapp")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: VIOLET.light,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(123,47,190,0.15)";
                    e.currentTarget.style.borderColor = VIOLET.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                >
                  Join
                  <ExternalLink size={14} />
                </button>
              ) : (
                <span style={{ color: "#22c55e", fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 500 }}>
                  Completed ✓
                </span>
              )
            }
            onToggle={async () => {
              if (!status.whatsapp) {
                handleSocialClick("whatsapp");
              } else {
                toggleLocalItem("whatsapp", false);
              }
            }}
          />

          {/* Item 7: NDA */}
          <ChecklistItem
            completed={status.nda}
            icon={<Shield size={20} />}
            title="Sign & upload NDA"
            action={
              !status.nda ? (
                <button
                  onClick={() => setActiveForm("nda")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: VIOLET.light,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(123,47,190,0.15)";
                    e.currentTarget.style.borderColor = VIOLET.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                >
                  Tap to Upload
                  <Upload size={14} />
                </button>
              ) : (
                <span style={{ color: "#22c55e", fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", fontWeight: 500 }}>
                  Completed ✓
                </span>
              )
            }
            onToggle={async () => {
              if (!status.nda) {
                setActiveForm("nda");
              } else {
                toggleLocalItem("nda", false);
              }
            }}
          />
        </div>

        {/* Proceed Button */}
        <button
          onClick={handleProceed}
          disabled={!allComplete}
          style={{
            width: "100%",
            padding: "14px",
            background: allComplete
              ? `linear-gradient(135deg, ${PINK.dark}, ${PINK.primary})`
              : "rgba(255,255,255,0.05)",
            border: "none",
            borderRadius: "10px",
            color: allComplete ? "#fff" : "rgba(255,255,255,0.2)",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: "0.9rem",
            cursor: allComplete ? "pointer" : "not-allowed",
            transition: "all 0.3s",
            boxShadow: allComplete ? `0 0 20px ${PINK.glow}` : "none",
          }}
        >
          Proceed
        </button>
      </motion.div>

      {/* Form Modal */}
      <AnimatePresence>
        {activeForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 100,
              padding: "24px",
              backdropFilter: "blur(8px)",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setActiveForm(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                width: "100%",
                maxWidth: "440px",
                maxHeight: "90vh",
                overflow: "auto",
                background: "#111118",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "16px",
                padding: "32px",
              }}
            >
              {/* Modal Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "24px",
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    color: "#fff",
                    margin: 0,
                  }}
                >
                  {activeForm === "offer"
                    ? "Offer Letter Request"
                    : activeForm === "idcard"
                    ? "ID Card Request"
                    : "Upload Signed NDA"}
                </h2>
                <button
                  onClick={() => {
                    setActiveForm(null);
                    setError("");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.4)",
                    cursor: "pointer",
                    padding: "4px",
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Offer Letter Form */}
              {activeForm === "offer" && (
                <form onSubmit={handleOfferLetterSubmit}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <FormField label="Email">
                      <input
                        style={inputStyle}
                        value={email || ""}
                        readOnly
                        required
                      />
                    </FormField>
                    <FormField label="Full Name">
                      <input
                        style={inputStyle}
                        value={olName}
                        onChange={(e) => setOlName(e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </FormField>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <FormField label="Age">
                        <input
                          style={inputStyle}
                          type="number"
                          value={olAge}
                          onChange={(e) => setOlAge(e.target.value)}
                          placeholder="Age"
                          required
                        />
                      </FormField>
                      <FormField label="Aadhar Number">
                        <input
                          style={inputStyle}
                          value={olAadhar}
                          onChange={(e) => setOlAadhar(e.target.value.replace(/\D/g, "").slice(0, 12))}
                          placeholder="12 digits"
                          maxLength={12}
                          required
                        />
                      </FormField>
                    </div>
                    <FormField label="Department">
                      <input
                        style={inputStyle}
                        value={olDesignation}
                        onChange={(e) => setOlDesignation(e.target.value)}
                        placeholder="e.g., Web Development"
                        required
                      />
                    </FormField>
                    <FormField label="Tenure">
                      <input
                        style={inputStyle}
                        value={olTenure}
                        onChange={(e) => setOlTenure(e.target.value)}
                        placeholder="e.g., 6 months"
                        required
                      />
                    </FormField>
                    <FormField label="Address">
                      <textarea
                        style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
                        value={olAddress}
                        onChange={(e) => setOlAddress(e.target.value)}
                        placeholder="Enter your full address"
                        required
                      />
                    </FormField>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      width: "100%",
                      padding: "14px",
                      marginTop: "24px",
                      background: submitting
                        ? "rgba(123,47,190,0.5)"
                        : `linear-gradient(135deg, ${VIOLET.primary}, ${VIOLET.light})`,
                      border: "none",
                      borderRadius: "10px",
                      color: "#fff",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      cursor: submitting ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    {submitting ? (
                      <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                    ) : (
                      "Submit Request"
                    )}
                  </button>
                </form>
              )}

              {/* ID Card Form */}
              {activeForm === "idcard" && (
                <form onSubmit={handleIdCardSubmit}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <FormField label="Email">
                      <input
                        style={inputStyle}
                        value={email || ""}
                        readOnly
                        required
                      />
                    </FormField>
                    <FormField label="Full Name">
                      <input
                        style={inputStyle}
                        value={idName}
                        onChange={(e) => setIdName(e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </FormField>
                    <FormField label="Department">
                      <input
                        style={inputStyle}
                        value={idDepartment}
                        onChange={(e) => setIdDepartment(e.target.value)}
                        placeholder="e.g., Web Development"
                        required
                      />
                    </FormField>
                    <FormField label="Passport Size Photo">
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        {idPhotoPreview ? (
                          <img
                            src={idPhotoPreview}
                            alt="Preview"
                            style={{
                              width: "80px",
                              height: "80px",
                              borderRadius: "10px",
                              objectFit: "cover",
                              border: "1px solid rgba(255,255,255,0.1)",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "80px",
                              height: "80px",
                              borderRadius: "10px",
                              background: "rgba(255,255,255,0.04)",
                              border: "1px dashed rgba(255,255,255,0.15)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Upload size={20} style={{ color: "rgba(255,255,255,0.2)" }} />
                          </div>
                        )}
                        <div>
                          <label
                            htmlFor="photo-upload"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "8px 16px",
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              borderRadius: "8px",
                              color: VIOLET.light,
                              fontFamily: "'Inter', sans-serif",
                              fontSize: "0.78rem",
                              fontWeight: 500,
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                          >
                            <Upload size={14} />
                            Choose Photo
                          </label>
                          <input
                            id="photo-upload"
                            type="file"
                            accept="image/jpeg,image/png"
                            onChange={handlePhotoChange}
                            style={{ display: "none" }}
                          />
                          <p
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: "0.68rem",
                              color: "rgba(255,255,255,0.3)",
                              marginTop: "6px",
                            }}
                          >
                            JPEG or PNG, max 5MB
                          </p>
                        </div>
                      </div>
                    </FormField>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      width: "100%",
                      padding: "14px",
                      marginTop: "24px",
                      background: submitting
                        ? "rgba(123,47,190,0.5)"
                        : `linear-gradient(135deg, ${VIOLET.primary}, ${VIOLET.light})`,
                      border: "none",
                      borderRadius: "10px",
                      color: "#fff",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      cursor: submitting ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    {submitting ? (
                      <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                    ) : (
                      "Submit Request"
                    )}
                  </button>
                </form>
              )}

              {/* NDA Upload Form */}
              {activeForm === "nda" && (
                <form onSubmit={handleNdaSubmit}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.82rem",
                        color: "rgba(255,255,255,0.5)",
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      Sign it, convert to PDF, then upload below.
                    </p>
                    <a
                      href="/Belvo_Intern_NDA.docx"
                      download
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 20px",
                        background: `linear-gradient(135deg, ${VIOLET.primary}, ${VIOLET.light})`,
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        fontSize: "0.82rem",
                        textDecoration: "none",
                        cursor: "pointer",
                        alignSelf: "center",
                        boxShadow: `0 0 16px ${VIOLET.glow}`,
                        transition: "all 0.3s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 0 24px ${VIOLET.glow}`; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 0 16px ${VIOLET.glow}`; }}
                    >
                      <Download size={15} />
                      Download NDA
                    </a>

                    <FormField label="Signed NDA (PDF)">
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div
                          style={{
                            flex: 1,
                            padding: "12px 14px",
                            background: "rgba(255,255,255,0.04)",
                            border: "1px dashed rgba(255,255,255,0.15)",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <Upload size={18} style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
                          <span
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: "0.8rem",
                              color: ndaFileName ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {ndaFileName || "No file selected"}
                          </span>
                        </div>
                        <label
                          htmlFor="nda-upload"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "8px 16px",
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "8px",
                            color: VIOLET.light,
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.78rem",
                            fontWeight: 500,
                            cursor: "pointer",
                            transition: "all 0.2s",
                            flexShrink: 0,
                          }}
                        >
                          Browse
                        </label>
                        <input
                          id="nda-upload"
                          type="file"
                          accept="application/pdf"
                          onChange={handleNdaFileChange}
                          style={{ display: "none" }}
                        />
                      </div>
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.68rem",
                          color: "rgba(255,255,255,0.3)",
                          marginTop: "6px",
                        }}
                      >
                        PDF only, max 10MB
                      </p>
                    </FormField>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !ndaFile}
                    style={{
                      width: "100%",
                      padding: "14px",
                      marginTop: "24px",
                      background: submitting || !ndaFile
                        ? "rgba(123,47,190,0.5)"
                        : `linear-gradient(135deg, ${VIOLET.primary}, ${VIOLET.light})`,
                      border: "none",
                      borderRadius: "10px",
                      color: "#fff",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      cursor: submitting || !ndaFile ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    {submitting ? (
                      <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                    ) : (
                      "Upload NDA"
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome Popup */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 100,
              padding: "24px",
              backdropFilter: "blur(8px)",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowWelcome(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: "100%",
                maxWidth: "420px",
                background: "#111118",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "20px",
                padding: "48px 36px",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Decorative glow */}
              <div
                style={{
                  position: "absolute",
                  top: "-40px",
                  right: "-40px",
                  width: "160px",
                  height: "160px",
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${PINK.glow}, transparent 70%)`,
                  filter: "blur(40px)",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "-40px",
                  left: "-40px",
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${VIOLET.glow}, transparent 70%)`,
                  filter: "blur(40px)",
                  pointerEvents: "none",
                }}
              />

              <div style={{ position: "relative", zIndex: 1 }}>
                <img
                  src="/belvo-logo-transparent.png"
                  alt="BELVO"
                  style={{ height: "28px", width: "auto", marginBottom: "20px" }}
                />

                <h2
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "1.6rem",
                    fontWeight: 800,
                    color: "#fff",
                    margin: "0 0 8px",
                    lineHeight: 1.2,
                  }}
                >
                  Welcome onboard!
                </h2>

                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.45)",
                    margin: "0 0 32px",
                    lineHeight: 1.6,
                  }}
                >
                  You're now part of the BELVO family. Let's build something amazing together.
                </p>

                <button
                  onClick={() => navigate("/#team")}
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: `linear-gradient(135deg, ${VIOLET.primary}, ${VIOLET.light})`,
                    border: "none",
                    borderRadius: "10px",
                    color: "#fff",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: `0 0 20px ${VIOLET.glow}`,
                    transition: "all 0.3s",
                    marginBottom: "14px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 30px ${VIOLET.glow}`;
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 20px ${VIOLET.glow}`;
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <Users size={16} />
                  Meet Your Team — BELVO Family
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────

function ChecklistItem({
  completed,
  icon,
  title,
  action,
  onToggle,
}: {
  completed: boolean;
  icon: React.ReactNode;
  title: string;
  action: React.ReactNode;
  onToggle?: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "16px",
        background: completed
          ? "rgba(34,197,94,0.05)"
          : "rgba(255,255,255,0.02)",
        border: completed
          ? "1px solid rgba(34,197,94,0.15)"
          : "1px solid rgba(255,255,255,0.06)",
        borderRadius: "12px",
        transition: "all 0.3s",
      }}
    >
      <button
        onClick={onToggle}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          flexShrink: 0,
          display: "flex",
        }}
      >
        {completed ? (
          <CheckCircle2 size={24} style={{ color: "#22c55e" }} />
        ) : (
          <Circle size={24} style={{ color: "rgba(255,255,255,0.2)" }} />
        )}
      </button>

      <div style={{ color: completed ? "#22c55e" : VIOLET.light, flexShrink: 0 }}>
        {icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.85rem",
            fontWeight: 500,
            color: completed ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.85)",
            margin: 0,
            textDecoration: completed ? "line-through" : "none",
          }}
        >
          {title}
        </p>
      </div>

      <div style={{ flexShrink: 0 }}>{action}</div>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}
