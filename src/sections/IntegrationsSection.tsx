import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const COMPANIES = [
  { name: "Zoho", id: "zoho", color: "#E02E2E", logo: "/company_logos/zoho.svg" },
  { name: "Microsoft Teams", id: "microsoftteams", color: "#6264A7", logo: "/company_logos/microsoftteams.svg" },
  { name: "Microsoft 365", id: "microsoft365", color: "#D83B01", logo: "/company_logos/microsoft.svg" },
  { name: "Notion", id: "notion", color: "#555555", logo: "/company_logos/notion.svg" },
  { name: "Google Workspace", id: "google", color: "#4285F4", logo: "/company_logos/google.svg" },
  { name: "Jira", id: "jira", color: "#0052CC", logo: "/company_logos/jira.svg" },
  { name: "Bitrix", id: "bitrix24", color: "#56C1FF", logo: "/company_logos/bitrix24.svg" },
];

function Card({ company, index, totalCards, scrollYProgress }: { company: typeof COMPANIES[0], index: number, totalCards: number, scrollYProgress: any }) {
  const rangeStart = index * (1 / totalCards);
  const rangeEnd = (index + 1) * (1 / totalCards);

  const scale = useTransform(
    scrollYProgress,
    [rangeStart, rangeEnd],
    [1, 0.95]
  );

  const opacity = useTransform(
    scrollYProgress,
    [rangeStart, rangeEnd],
    [1, 0.5]
  );

  const isLast = index === totalCards - 1;

  return (
    <div
      style={{
        position: "sticky",
        top: `calc(20vh + ${index * 15}px)`,
        height: "50vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "20vh",
      }}
    >
      <motion.div
        style={{
          scale: isLast ? 1 : scale,
          opacity: isLast ? 1 : opacity,
          width: "100%",
          maxWidth: "800px",
          height: "100%",
          background: `linear-gradient(135deg, ${company.color} 0%, rgba(10,5,20,0.95) 100%)`,
          borderRadius: "24px",
          border: `1px solid ${company.color}40`,
          boxShadow: `0 -10px 40px -10px ${company.color}20`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transformOrigin: "top center",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }} />

        <div style={{
          width: "100px", height: "100px",
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(12px)",
          borderRadius: "24px",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "24px",
          border: "1px solid rgba(255,255,255,0.2)"
        }}>
          <img src={company.logo} alt={company.name} style={{ width: "50px", height: "50px", objectFit: "contain", filter: "brightness(0) invert(1)" }} />
        </div>

        <h3 style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 800,
          fontSize: "2.5rem",
          color: "#fff",
          margin: 0,
          letterSpacing: "-0.02em"
        }}>
          {company.name}
        </h3>
      </motion.div>
    </div>
  );
}

export default function IntegrationsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section
      style={{
        background: "var(--belvo-bg)",
        position: "relative",
        padding: "100px 24px 0",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "80px" }}>
        <h2 style={{
          fontFamily: "'Inter',sans-serif", fontWeight: 900,
          fontSize: "clamp(2rem,5vw,3.8rem)",
          lineHeight: 1.05,
          color: "var(--belvo-text-1)",
          margin: "0 0 16px",
          letterSpacing: "-0.01em"
        }}>
          Belvo is presented by <span style={{ color: "#581a8a" }}>----</span>
        </h2>
        <p style={{
          fontFamily: "'Inter',sans-serif", fontSize: "0.95rem",
          lineHeight: 1.75, color: "var(--belvo-text-3)",
          maxWidth: "480px", margin: "0 auto",
        }}>
          Seamlessly integrated with your favorite tools and platforms.
        </p>
      </div>

      <div
        ref={containerRef}
        style={{
          position: "relative",
          paddingBottom: "10vh",
        }}
      >
        {COMPANIES.map((company, i) => (
          <Card
            key={company.id}
            company={company}
            index={i}
            totalCards={COMPANIES.length}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
}
