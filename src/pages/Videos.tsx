import SEO from "@/components/SEO";
import ExploreSection from "@/sections/ExploreSection";
import Footer from "@/sections/Footer";
import { motion } from "framer-motion";

export default function Videos() {
  return (
    <>
      <SEO title="Videos" description="Watch Belvo's creative work in motion — campaign moments, case studies, and brand stories." path="/videos" />
      <section
        style={{
          background: "var(--belvo-bg)",
          position: "relative",
          overflow: "hidden",
          padding: "140px 24px 60px",
          textAlign: "center",
        }}
      >
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.68rem",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "rgba(157,78,221,0.6)",
            marginBottom: "16px",
            display: "block",
          }}
        >
          Press play. We'll do the rest.
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(2.2rem, 5.5vw, 4.2rem)",
            lineHeight: 1.05,
            color: "var(--belvo-text-1)",
            margin: "0 auto 18px",
            letterSpacing: "-0.02em",
          }}
        >
          Belvo on Screen
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(0.9rem, 1.3vw, 1.05rem)",
            lineHeight: 1.75,
            color: "var(--belvo-text-2)",
            maxWidth: "540px",
            margin: "0 auto",
          }}
        >
          Campaign moments, creative experiments, and work that simply hits better in motion.
        </motion.p>
      </section>

      <ExploreSection />
      <Footer />
    </>
  );
}
