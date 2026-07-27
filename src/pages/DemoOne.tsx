import SEO from "@/components/SEO";
import { motion } from "framer-motion";

export default function DemoOne() {
  return (
    <>
      <SEO title="Book a Demo" description="Schedule a demo with Belvo to see how our creative agency can help scale your brand." path="/demo" />
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, #1a0533 0%, #04000e 100%)",
        }}
      />
      <div className="relative z-10 text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold mb-4"
          style={{ color: "#ffffff", fontFamily: "'Cinzel', serif" }}
        >
          Demo
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl"
          style={{ color: "rgba(255,255,255,0.7)" }}
        >
          Coming soon.
        </motion.p>
      </div>
    </div>
    </>
  );
}
