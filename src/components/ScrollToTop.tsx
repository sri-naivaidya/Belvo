import { motion, useScroll, useSpring } from "framer-motion";
import { smoothScrollTo } from "@/lib/smoothScroll";

export default function ScrollToTop() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[9999]"
        style={{ scaleX, background: "linear-gradient(90deg, #7B2FBE, #9D4EDD)" }}
      />
      <motion.button
        onClick={() => smoothScrollTo(0)}
        className="fixed bottom-8 right-8 z-[9999] flex items-center justify-center w-12 h-12 rounded-full cursor-pointer border-none shadow-lg"
        style={{ background: "var(--belvo-accent, #9D4EDD)", color: "#fff" }}
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.5, y: 20 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </motion.button>
    </>
  );
}
