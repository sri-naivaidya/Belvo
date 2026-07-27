import SEO from "@/components/SEO";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { smoothScrollToElement } from "@/lib/smoothScroll";
import ServiceDialog from "@/components/ServiceDialog";
import { type ServiceItem } from "@/content/services";
import Footer from "@/sections/Footer";
import BookACall from "@/sections/BookACall";
import Testimonials from "@/sections/Testimonials";

import { useTheme } from "@/contexts/ThemeContext";
import ServicesSection from "@/sections/ServicesSection";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function Services() {
  const { theme } = useTheme();
  const isIvory = theme === "ivory";
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-80px" });

  return (
    <>
      <SEO title="Services" description="Belvo offers branding, web development, social media, content creation, and design services to scale your business." path="/services" />
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--belvo-bg)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          position: "relative",
          overflow: "hidden",
          padding: "20px 24px 20px",
          textAlign: "center",
        }}
      >
        {/* Ambient glows */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: "80vw", height: "60vh", background: "radial-gradient(ellipse at center, rgba(244,91,150,0.3) 0%, transparent 65%)", filter: "blur(60px)" }} />
          <div style={{ position: "absolute", bottom: 0, left: "15%", width: "50vw", height: "40vh", background: "radial-gradient(ellipse at center, rgba(250,152,194,0.25) 0%, transparent 70%)", filter: "blur(80px)" }} />
          <div style={{ position: "absolute", top: 0, right: "10%", width: "40vw", height: "35vh", background: "radial-gradient(ellipse at center, rgba(244,91,150,0.2) 0%, transparent 70%)", filter: "blur(70px)" }} />
          <div style={{ position: "absolute", inset: "0", background: isIvory ? "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 30%, rgba(248,245,239,0.85) 100%)" : "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 30%, rgba(4,0,14,0.6) 100%)" }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "120px", background: isIvory ? "linear-gradient(to bottom, var(--belvo-bg), transparent)" : "linear-gradient(to bottom, rgba(4,0,14,0.9), transparent)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "140px", background: isIvory ? "linear-gradient(to top, var(--belvo-bg), transparent)" : "linear-gradient(to top, rgba(4,0,14,0.95), transparent)" }} />
        </div>

        {/* Scattered dots */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          {[[120, 160], [310, 80], [490, 220], [680, 100], [870, 250], [1050, 130], [1230, 200], [1380, 90], [200, 700], [450, 760], [700, 680], [950, 750], [1150, 700], [1340, 760]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 1.5 : 1} fill={i % 2 === 0 ? "rgba(250,152,194,0.6)" : isIvory ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.35)"} />
          ))}
        </svg>

        <div style={{ position: "relative", zIndex: 1, maxWidth: "800px" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} style={{ marginBottom: "18px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 18px", background: "rgba(244,91,150,0.15)", border: "1px solid rgba(244,91,150,0.3)", borderRadius: "100px", fontFamily: "'Inter',sans-serif", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "#F45B96" }}>
              <Sparkles size={11} />
              Our Services
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
            style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: "clamp(2.4rem,6vw,5.5rem)", lineHeight: 1.04, color: "var(--belvo-text-1)", margin: "0 0 10px", letterSpacing: "-0.01em" }}
          >
            Full-Service{" "}
            <span style={{ color: "#F45B96" }}>Creative</span>{" "}
            Agency
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
            style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.9rem,1.6vw,1.05rem)", lineHeight: 1.75, color: "var(--belvo-text-2)", margin: "0 auto 36px", maxWidth: "560px", letterSpacing: "0.01em" }}
          >
            From SEO and branding to web development and performance marketing — we offer
            15 specialised services designed to take your brand from zero to dominate.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}>
            <button
              onClick={() => smoothScrollToElement("services-grid")}
              data-testid="button-explore-services"
              style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "14px 36px", background: "linear-gradient(135deg,#F45B96,#FA98C2)", border: "none", borderRadius: "8px", color: "#ffffff", fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: "0.82rem", letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer", boxShadow: "0 0 32px rgba(244,91,150,0.45)", transition: "box-shadow 0.3s, transform 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 52px rgba(244,91,150,0.65)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 32px rgba(244,91,150,0.45)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Explore Services <ArrowUpRight size={14} strokeWidth={2.5} />
            </button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.8 }} style={{ position: "absolute", bottom: "28px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "26px", height: "42px", borderRadius: "100px", border: "1px solid var(--belvo-border-card)", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "8px" }}>
            <motion.div style={{ width: "4px", height: "8px", borderRadius: "100px", background: "rgba(244,91,150,0.8)" }} animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} />
          </div>
          <span style={{ fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--belvo-text-4)", fontFamily: "'Inter',sans-serif" }}>Scroll</span>
        </motion.div>
      </section>

      {/* ── SERVICES GRID / STICKY SCROLL SECTION ─────────────────── */}
      <ServicesSection id="services-grid" onServiceClick={setSelectedService} />

      <Testimonials />

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section
        ref={ctaRef}
        style={{ background: "var(--belvo-bg)", padding: "0 24px 120px", position: "relative", overflow: "hidden" }}
      >
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "70vw", height: "400px", background: "radial-gradient(ellipse at center, rgba(244,91,150,0.18) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />

        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
          style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center", background: "var(--belvo-bg-card)", border: "1px solid var(--belvo-border-card)", borderRadius: "16px", padding: "clamp(36px,5vw,60px)", backdropFilter: "blur(12px)" }}
        >
          <h2 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: "clamp(1.6rem,3.5vw,2.6rem)", lineHeight: 1.1, color: "var(--belvo-text-1)", margin: "0 0 14px" }}>
            Ready to Scale Your <span style={{ color: "#F45B96" }}>Brand?</span>
          </h2>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.9rem", lineHeight: 1.75, color: "var(--belvo-text-6)", margin: "0 auto 32px", maxWidth: "480px" }}>
            Let's talk about which services are right for your business. Book a free consultation with our team.
          </p>
          <button
            data-testid="button-services-cta"
            style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "14px 40px", background: "linear-gradient(135deg,#F45B96,#FA98C2)", border: "none", borderRadius: "8px", color: "#ffffff", fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: "0.82rem", letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer", boxShadow: "0 0 32px rgba(244,91,150,0.45)", transition: "box-shadow 0.3s, transform 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 52px rgba(244,91,150,0.65)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 32px rgba(244,91,150,0.45)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Book a Free Call <ArrowUpRight size={14} strokeWidth={2.5} />
          </button>
        </motion.div>
      </section>

      <BookACall />
      <ServiceDialog service={selectedService} onClose={() => setSelectedService(null)} />
      <Footer />
    </>
  );
}
