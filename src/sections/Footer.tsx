import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState, type ReactNode } from "react";
import { useLocation } from "wouter";
import { Mail, Download, Phone, ArrowUpRight } from "lucide-react";
import { CONTACT_TARGETS } from "@/lib/contact";

// ── DARK PINK COLOR PALETTE ──
const PINK = {
  primary: "#5a1b4b",
  light: "#a25b88",
  dark: "#32102d",
  soft: "rgba(90,27,75,0.7)",
  muted: "rgba(90,27,75,0.45)",
  glow: "rgba(90,27,75,0.32)",
};

const COLORS = {
  white: "#ffffff",
  black: "#000000",
  textPrimary: "#ffffff",
  textSecondary: "rgba(255,255,255,0.78)",
  textMuted: "rgba(255,255,255,0.58)",
  pink: PINK.primary,
  pinkLight: PINK.light,
  pinkDark: PINK.dark,
  pinkSoft: PINK.soft,
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const SOCIAL_LINKS = [
  {
    id: "email-contact",
    label: "Email",
    href: "mailto:contact.belvo@gmail.com",
    icon: <Mail size={17} />,
  },
  {
    id: "instagram",
    label: "Instagram",
    href: CONTACT_TARGETS.instagramUrl,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: CONTACT_TARGETS.linkedinUrl,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

const PHONE_NUMBERS = [
  { id: "phone-1", label: "+91 89284 66820", href: "tel:+918928466820" },
  { id: "phone-2", label: "+91 98495 67122", href: "tel:+919849567122" },
];

const LINK_COLUMNS = [
  {
    title: "Company",
    links: [
      { label: "About", id: "about" },
      { label: "Services", id: "services" },
      { label: "Portfolio", id: "portfolio" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Tools & Pricing", path: "/tools" },
      { label: "FAQ", id: "faq" },
      { label: "Book A Call", id: "book-a-call" },
    ],
  },
];

const LEGAL_LINKS = [
  { label: "Terms of Use", href: "#" },
  { label: "Privacy Notice", href: "#" },
];

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

type SocialLink = {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
};

/**
 * A polished, self-contained social icon button.
 * Idle: soft outlined circle, muted icon.
 * Hover: pink gradient ring fills in, icon turns white, subtle glow + lift.
 */
function SocialIcon({ link }: { link: SocialLink }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={link.href}
      target={link.href.startsWith("mailto") ? "_self" : "_blank"}
      rel="noopener noreferrer"
      aria-label={link.label}
      data-testid={`link-footer-${link.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "42px",
        height: "42px",
        borderRadius: "50%",
        textDecoration: "none",
        position: "relative",
        color: hovered ? COLORS.white : COLORS.textSecondary,
        background: hovered
          ? `linear-gradient(135deg, ${COLORS.pinkDark}, ${COLORS.pink})`
          : "rgba(255,255,255,0.04)",
        border: hovered ? "1px solid transparent" : "1px solid rgba(255,255,255,0.14)",
        boxShadow: hovered ? `0 6px 20px ${PINK.glow}` : "none",
        transform: hovered ? "translateY(-3px) scale(1.06)" : "translateY(0) scale(1)",
        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {link.icon}
    </a>
  );
}

/**
 * The BELVO wordmark + icon. Idle: pink gradient text, static logo.
 * Hover: logo gets a soft pink glow and lifts slightly, gradient shifts brighter.
 */
function BrandMark() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "14px",
        cursor: "default",
      }}
    >
      <img
        src="/belvo-logo-transparent.png"
        alt="BELVO"
        style={{
          height: "32px",
          width: "auto",
          filter: hovered
            ? `drop-shadow(0 0 10px ${COLORS.pinkSoft})`
            : "drop-shadow(0 0 0 transparent)",
          transform: hovered ? "translateY(-1px) scale(1.05)" : "translateY(0) scale(1)",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 700,
          fontSize: "1.1rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: hovered ? "#d8efff" : "#ffffff",
          display: "inline-block",
          transition: "background 0.3s ease",
        }}
      >
        BELVO
      </span>
    </div>
  );
}

export default function Footer() {
  const ref = useRef(null);
  const [, navigate] = useLocation();
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -20]);

  return (
    <footer
      ref={ref}
      id="footer"
      style={{
        background: "radial-gradient(circle at 84% 10%, rgba(90, 27, 75, 0.38), transparent 23%), linear-gradient(180deg, #d8efff 0%, #a9d9ff 8%, #0d3c97 30%, #061a5e 100%)",
        alignSelf: "stretch",
        margin: "0 -24px",
        width: "calc(100% + 48px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at top left, rgba(255, 255, 255, 0.65), transparent 24%), radial-gradient(circle at bottom right, rgba(23, 83, 181, 0.42), transparent 42%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "84px",
          zIndex: 0,
          pointerEvents: "none",
          background: "linear-gradient(180deg, rgba(255,255,255,0.05), transparent)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "120px",
          zIndex: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at 20% 0%, rgba(255,255,255,0.16), transparent 36%), radial-gradient(ellipse at 80% 0%, rgba(255,255,255,0.1), transparent 32%)",
        }}
      />
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{ position: "absolute", left: 0, right: 0, top: 0, width: "100%", height: "140px", zIndex: 0 }}
      >
        <path d="M0,92 C120,70 240,64 360,78 C480,92 600,122 720,120 C840,118 960,90 1080,82 C1240,72 1360,72 1440,70 L1440,0 L0,0 Z" fill="rgba(255,255,255,0.10)" />
        <path d="M0,112 C140,86 270,80 420,98 C560,116 700,146 840,142 C980,138 1120,106 1260,102 C1350,100 1408,100 1440,100" stroke="rgba(255,255,255,0.22)" strokeWidth="2" fill="none" />
        <path d="M0,124 C160,96 320,92 480,112 C640,132 800,164 960,156 C1120,148 1280,120 1440,112" stroke="rgba(0,0,0,0.35)" strokeWidth="3" fill="none" />
      </svg>
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{ position: "absolute", left: 0, right: 0, bottom: 0, width: "100%", height: "180px", zIndex: 0 }}
      >
        <path d="M0,180 C160,130 320,110 480,138 C640,166 800,220 960,210 C1120,200 1280,150 1440,140 L1440,320 L0,320 Z" fill="rgba(7, 37, 113, 0.42)" />
        <path d="M0,208 C180,172 340,158 520,182 C700,206 860,252 1040,234 C1180,220 1320,184 1440,170 L1440,320 L0,320 Z" fill="rgba(2, 18, 72, 0.8)" />
      </svg>
      {/* Top border line */}
      <div
        style={{
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, var(--belvo-border-divider), rgba(91,169,230,0.42), transparent)",
        }}
      />

      {/* Ambient glow blob */}
      <motion.div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "60vw",
          height: "300px",
          background: "radial-gradient(ellipse at center bottom, var(--belvo-glow-blob) 0%, transparent 70%)",
          filter: "blur(50px)",
          pointerEvents: "none",
          y: bgY,
        }}
      />
      {/* Floating particles */}
      <motion.div
        style={{
          position: "absolute", top: "20%", left: "10%",
          width: 6, height: 6, borderRadius: "50%",
          background: PINK.soft, filter: "blur(2px)",
        }}
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{
          position: "absolute", top: "45%", right: "15%",
          width: 4, height: 4, borderRadius: "50%",
          background: "rgba(91,169,230,0.26)", filter: "blur(1px)",
        }}
        animate={{ y: [0, -15, 0], opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "72px 24px 0", position: "relative", zIndex: 1 }}>
        {/* ── TOP GRID: brand + link columns + offices ── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "48px",
            justifyContent: "space-between",
            paddingBottom: "56px",
          }}
        >
          {/* Brand */}
          <motion.div
            custom={0} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
            style={{ maxWidth: "320px", flex: "1 1 260px" }}
          >
            <BrandMark />
            <p
              style={{
                fontFamily: "'Inter', sans-serif", fontSize: "0.875rem",
                color: COLORS.textSecondary, lineHeight: 1.7, letterSpacing: "0.01em",
              }}
            >
              We build brands that dominate. Premium creative agency helping businesses scale
              globally and compete at the highest level.
            </p>
            <a
              href="/Portfolio.pdf"
              download="BELVO-Portfolio.pdf"
              data-testid="button-download-portfolio"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "10px 22px", marginTop: "24px",
                background: `linear-gradient(135deg, ${COLORS.pinkDark}, ${COLORS.pink})`,
                border: "none", borderRadius: "8px", color: "#ffffff",
                fontFamily: "'Inter', sans-serif", fontWeight: 600,
                fontSize: "0.78rem", letterSpacing: "0.14em",
                textTransform: "uppercase", cursor: "pointer", textDecoration: "none",
                boxShadow: `0 0 20px ${PINK.glow}`,
                transition: "background 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `linear-gradient(135deg, ${COLORS.pink}, ${COLORS.pinkLight})`; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${PINK.soft}`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `linear-gradient(135deg, ${COLORS.pinkDark}, ${COLORS.pink})`; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${PINK.glow}`; }}
            >
              <Download size={13} />
              Download Portfolio
            </a>
          </motion.div>

          {/* Link columns */}
          {LINK_COLUMNS.map((col, ci) => (
            <motion.div
              key={col.title}
              custom={ci + 1} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
              style={{ flex: "0 1 160px" }}
            >
              <p
                style={{
                  fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase",
                  color: COLORS.textMuted, fontFamily: "'Inter', sans-serif", marginBottom: "20px",
                }}
              >
                {col.title}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {col.links.map(link => (
                  <button
                    key={"id" in link ? link.id : link.path}
                    onClick={() => {
                      if ("path" in link) navigate(link.path);
                      else scrollToId((link as { id: string }).id);
                    }}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "8px",
                      background: "none", border: "none", padding: 0, cursor: "pointer",
                      color: COLORS.textPrimary,
                      fontFamily: "'Inter', sans-serif", fontSize: "0.875rem",
                      letterSpacing: "0.01em", textAlign: "left", transition: "color 0.2s",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = COLORS.pink; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = COLORS.textPrimary; }}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Offices */}
          <motion.div
            custom={3} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
            style={{ flex: "0 1 200px" }}
          >
            <p
              style={{
                fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase",
                color: COLORS.textMuted, fontFamily: "'Inter', sans-serif", marginBottom: "20px",
              }}
            >
              Our Office
            </p>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <span style={{ color: COLORS.pinkSoft, display: "flex", marginTop: "2px", flexShrink: 0 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="15" height="15">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
              </span>
              <div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", fontWeight: 600, color: COLORS.textPrimary, margin: 0, letterSpacing: "0.01em" }}>
                  Goregaon
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: COLORS.textMuted, margin: "2px 0 0", letterSpacing: "0.02em" }}>
                  Mumbai, Maharashtra
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "22px" }}>
              {PHONE_NUMBERS.map(phone => (
                <a
                  key={phone.id}
                  href={phone.href}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "10px",
                    color: COLORS.textPrimary, fontFamily: "'Inter', sans-serif",
                    fontSize: "0.85rem", textDecoration: "none", transition: "color 0.2s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = COLORS.pink; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = COLORS.textPrimary; }}
                >
                  <Phone size={14} style={{ color: COLORS.pinkSoft }} />
                  {phone.label}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── DIVIDER ── */}
        <div style={{ borderTop: "1px solid var(--belvo-border-bottom)" }} />

        {/* ── CTA BAND: bold contact line + socials ── */}
        <motion.div
          custom={4} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
          style={{
            padding: "36px 0",
            display: "flex", flexWrap: "wrap", gap: "24px",
            alignItems: "center", justifyContent: "space-between",
          }}
        >
          <a
            href="#book-a-call"
            onClick={e => { e.preventDefault(); scrollToId("book-a-call"); }}
            style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              textDecoration: "none", color: COLORS.white,
              fontFamily: "'Inter', sans-serif", fontWeight: 600,
              fontSize: "clamp(1.25rem, 2.4vw, 1.6rem)", letterSpacing: "-0.01em",
            }}
          >
            Got a project in mind?{" "}
            <span
              style={{
                background: `linear-gradient(135deg, #ffffff 0%, ${COLORS.pink} 60%, ${COLORS.pinkDark} 100%)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                display: "inline-flex", alignItems: "center", gap: "6px",
              }}
            >
              Let's talk <ArrowUpRight size={20} />
            </span>
          </a>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {SOCIAL_LINKS.map(link => (
              <SocialIcon key={link.id} link={link} />
            ))}
          </div>
        </motion.div>

        {/* ── DIVIDER ── */}
        <div style={{ borderTop: "1px solid var(--belvo-border-bottom)" }} />

        {/* ── BOTTOM BAR ── */}
        <motion.div
          custom={5} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}
          style={{
            padding: "22px 0 28px",
            display: "flex", flexWrap: "wrap", gap: "14px",
            justifyContent: "space-between", alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif", fontSize: "0.78rem",
              color: COLORS.textMuted, letterSpacing: "0.04em",
            }}
          >
            © {new Date().getFullYear()} BELVO. All rights reserved.
          </span>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "center" }}>
            {LEGAL_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  fontFamily: "'Inter', sans-serif", fontSize: "0.78rem",
                  color: COLORS.textMuted, letterSpacing: "0.04em",
                  textDecoration: "none", transition: "color 0.2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = COLORS.pink; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = COLORS.textMuted; }}
              >
                {link.label}
              </a>
            ))}
            <span
              style={{
                fontFamily: "'Inter', sans-serif", fontSize: "0.78rem",
                color: "#000000", letterSpacing: "0.04em", fontWeight: 700,
              }}
            >
              Growth Core
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
