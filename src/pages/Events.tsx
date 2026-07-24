import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { EVENTS } from "@/lib/events";
import { Link } from "wouter";
import { Calendar, Globe, Mail, MapPin, Phone, Wifi } from "lucide-react";
import Footer from "@/sections/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] as const } }),
};

function EventCard({ event, index }: { event: typeof EVENTS[0]; index: number }) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      style={{
        background: "var(--belvo-bg-card)",
        border: "1px solid var(--belvo-border-card)",
        borderRadius: "18px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      <div style={{ height: "3px", background: `linear-gradient(90deg, ${event.accentColor}, transparent)` }} />

      <div
        style={{
          padding: "28px 28px 20px",
          background: `linear-gradient(135deg, ${event.gradientFrom}, ${event.gradientTo})`,
          borderBottom: "1px solid var(--belvo-border-bottom)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
          <span
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "4px 12px",
              background: "rgba(57,88,134,0.14)",
              border: "1px solid rgba(57,88,134,0.28)",
              borderRadius: "100px",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.65rem", fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: event.accentColor,
            }}
          >
            {event.category}
          </span>

          <span
            style={{
              display: "inline-flex", alignItems: "center", gap: "5px",
              padding: "4px 10px",
              background: event.mode === "Online" ? "rgba(34,197,94,0.10)" : "rgba(251,146,60,0.10)",
              border: `1px solid ${event.mode === "Online" ? "rgba(34,197,94,0.28)" : "rgba(251,146,60,0.28)"}`,
              borderRadius: "100px",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.65rem", fontWeight: 600,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: event.mode === "Online" ? "rgba(34,197,94,0.9)" : "rgba(251,146,60,0.9)",
            }}
          >
            {event.mode === "Online" ? <Wifi size={11} strokeWidth={2} /> : <MapPin size={11} strokeWidth={2} />}
            {event.mode}
          </span>
        </div>

        <h3
          style={{
            fontFamily: "'Inter', sans-serif", fontWeight: 800,
            fontSize: "clamp(1.1rem, 2vw, 1.3rem)", lineHeight: 1.25,
            color: "var(--belvo-text-1)", margin: "0 0 12px", letterSpacing: "-0.01em",
          }}
        >
          {event.title}
        </h3>

        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <Calendar size={13} style={{ color: event.accentColor, flexShrink: 0 }} strokeWidth={2} />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", fontWeight: 600, color: event.accentColor, letterSpacing: "0.04em" }}>
            {event.date}
          </span>
        </div>
      </div>

      <div style={{ padding: "22px 28px 28px", flex: 1, display: "flex", flexDirection: "column" }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", lineHeight: 1.78, color: "var(--belvo-text-6)", margin: "0 0 20px", flex: 1 }}>
          {event.description}
        </p>

        <div
          style={{
            padding: "16px 18px",
            background: "rgba(57,88,134,0.08)",
            border: "1px solid rgba(57,88,134,0.18)",
            borderRadius: "10px",
            marginBottom: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "8px" }}>
            <Mail size={13} style={{ color: "#395886", flexShrink: 0 }} strokeWidth={2} />
            <a href="mailto:contact.belvo@gmail.com" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", fontWeight: 600, color: "#395886", letterSpacing: "0.02em", textDecoration: "none" }}>
              contact.belvo@gmail.com
            </a>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "8px" }}>
            <Phone size={13} style={{ color: "#395886", flexShrink: 0 }} strokeWidth={2} />
            <a href="tel:+918928466820" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", fontWeight: 600, color: "#395886", letterSpacing: "0.02em", textDecoration: "none" }}>
              +91 89284 66820
            </a>
          </div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: "var(--belvo-text-3)", margin: 0, lineHeight: 1.5, letterSpacing: "0.01em" }}>
            For registrations, please contact us via email or phone.
          </p>
        </div>

        <Link
          href={`/event-register/${event.id}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            padding: "12px 16px",
            background: "#395886",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "12px",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            marginBottom: "16px",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
        >
          Click to Register
        </Link>

        <div style={{ paddingTop: "16px", borderTop: "1px solid var(--belvo-border-bottom)", display: "flex", alignItems: "center", gap: "7px" }}>
          {event.mode === "Online"
            ? <Globe size={13} style={{ color: "var(--belvo-text-3)" }} strokeWidth={1.8} />
            : <MapPin size={13} style={{ color: "var(--belvo-text-3)" }} strokeWidth={1.8} />
          }
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: "var(--belvo-text-3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {event.mode === "Online" ? "Virtual Event — Join from Anywhere" : "In-Person Event"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Events() {
  return (
    <>
      <section
        style={{
          background: "var(--belvo-bg)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          position: "relative",
          padding: "20px 24px 20px",
          textAlign: "center",
        }}
      >
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: "80vw", height: "60vh", background: "radial-gradient(ellipse at center, rgba(57,88,134,0.22) 0%, transparent 65%)", filter: "blur(60px)" }} />
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: "800px" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} style={{ marginBottom: "18px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 18px", background: "rgba(57,88,134,0.15)", border: "1px solid rgba(57,88,134,0.3)", borderRadius: "100px", fontFamily: "'Inter',sans-serif", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "#395886" }}>
              <Sparkles size={11} />
              Events
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
            style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: "clamp(2.4rem,6vw,5.5rem)", lineHeight: 1.04, color: "var(--belvo-text-1)", margin: "0 0 10px", letterSpacing: "-0.01em" }}
          >
            Upcoming <span style={{ color: "#395886" }}>Events</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
            style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.9rem,1.6vw,1.05rem)", lineHeight: 1.75, color: "var(--belvo-text-2)", margin: "0 auto 36px", maxWidth: "560px", letterSpacing: "0.01em" }}
          >
            Webinars, workshops, and networking events crafted for founders, developers, and creators ready to level up.
          </motion.p>
        </div>
      </section>

      <section style={{ background: "var(--belvo-bg)", padding: "20px 24px 120px", position: "relative" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ alignItems: "stretch" }}>
            {EVENTS.map((event, index) => (
              <EventCard key={event.id} event={event} index={index + 1} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
