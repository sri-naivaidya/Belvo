import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: easeOut },
  }),
};

export default function TeamStory() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="team-story"
      ref={ref}
      style={{
        background: "var(--belvo-bg)",
        position: "relative",
        overflow: "hidden",
        padding: "100px 24px",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, var(--belvo-border-divider), transparent)",
      }} />

      <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.68rem",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "rgba(157,78,221,0.6)",
            marginBottom: 14,
          }}
        >
          06
        </motion.p>

        <motion.h2
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
            lineHeight: 1.1,
            color: "var(--belvo-text-1)",
            margin: "0 0 8px",
          }}
        >
          Team spotlight
        </motion.h2>

        <motion.h3
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(0.9rem, 1.8vw, 1.2rem)",
            color: "#9D4EDD",
            margin: "0 0 16px",
          }}
        >
          Team Story of Belvo
        </motion.h3>

        <motion.p
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.95rem",
            lineHeight: 1.7,
            color: "var(--belvo-text-2)",
            maxWidth: 560,
            margin: "0 auto 32px",
          }}
        >
          Team spotlights, short interviews, and stories from the people building Belvo.
        </motion.p>

        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <a
            href="/team-story"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 32px",
              background: "linear-gradient(135deg, #7B2FBE, #9D4EDD)",
              border: "none",
              borderRadius: 8,
              color: "#ffffff",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "0.82rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor: "pointer",
              textDecoration: "none",
              boxShadow: "0 0 32px rgba(130,40,200,0.35)",
              transition: "box-shadow 0.3s, transform 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 52px rgba(157,78,221,0.55)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 32px rgba(130,40,200,0.35)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Read article
          </a>
        </motion.div>
      </div>
    </section>
  );
}