import { motion, MotionValue, useTransform } from "framer-motion";

export default function ScrollBackground({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const bgGradient = useTransform(
    scrollYProgress,
    [0, 0.32, 0.34, 0.65, 0.67, 1],
    [
      "linear-gradient(135deg, #b5c6ff 0%, #4b92db 100%)",
      "linear-gradient(135deg, #b5c6ff 0%, #4b92db 100%)",
      "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
      "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
      "linear-gradient(135deg, #a1ffd5 0%, #4facfe 100%)",
      "linear-gradient(135deg, #a1ffd5 0%, #4facfe 100%)",
    ]
  );

  return (
    <motion.div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        background: bgGradient,
        pointerEvents: "none",
        overflow: "hidden"
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          width: "45vw",
          height: "45vw",
          minWidth: "300px",
          minHeight: "300px",
          background: "radial-gradient(circle at 30% 30%, #f0a8ea, #b5c6ff 50%, #4b92db 90%)",
          boxShadow: "inset -20px -20px 40px rgba(0,0,0,0.15), inset 20px 20px 40px rgba(255,255,255,0.6), 0 20px 50px rgba(0,0,0,0.1)",
          mixBlendMode: "hard-light",
          opacity: 0.9,
          top: "10%",
          right: "-5%",
        }}
        animate={{
          borderRadius: [
            "60% 40% 30% 70% / 60% 30% 70% 40%",
            "30% 60% 70% 40% / 50% 60% 30% 60%",
            "60% 40% 30% 70% / 60% 30% 70% 40%"
          ],
          rotate: [0, 180, 360],
          y: ["-5%", "5%", "-5%"]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        style={{
          position: "absolute",
          width: "35vw",
          height: "35vw",
          minWidth: "250px",
          minHeight: "250px",
          background: "radial-gradient(circle at 30% 30%, #ffffff 0%, #dab1da 50%, #b88eb8 100%)",
          boxShadow: "inset -15px -15px 30px rgba(0,0,0,0.15), inset 15px 15px 30px rgba(255,255,255,0.6), 0 15px 40px rgba(0,0,0,0.1)",
          mixBlendMode: "normal",
          opacity: 0.9,
          bottom: "5%",
          left: "-10%",
        }}
        animate={{
          borderRadius: [
            "40% 60% 70% 30% / 40% 50% 60% 50%",
            "70% 30% 50% 50% / 30% 40% 70% 60%",
            "40% 60% 70% 30% / 40% 50% 60% 50%"
          ],
          rotate: [360, 180, 0],
          y: ["5%", "-5%", "5%"]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        style={{
          position: "absolute",
          width: "25vw",
          height: "25vw",
          minWidth: "150px",
          minHeight: "150px",
          background: "radial-gradient(circle at 30% 30%, #ffffff 0%, #ffa5bb 50%, #ff8fab 100%)",
          boxShadow: "inset -10px -10px 20px rgba(0,0,0,0.15), inset 10px 10px 20px rgba(255,255,255,0.6), 0 10px 30px rgba(0,0,0,0.1)",
          mixBlendMode: "normal",
          opacity: 0.6,
          bottom: "-5%",
          right: "30%",
        }}
        animate={{
          borderRadius: [
            "50% 50% 30% 70% / 60% 40% 60% 40%",
            "30% 70% 60% 40% / 40% 60% 40% 60%",
            "50% 50% 30% 70% / 60% 40% 60% 40%"
          ],
          rotate: [0, -180, -360],
          y: ["0%", "10%", "0%"]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        style={{
          position: "absolute",
          width: "8vw",
          height: "8vw",
          minWidth: "60px",
          minHeight: "60px",
          borderRadius: "50%",
          background: "radial-gradient(circle at 30% 30%, #f0a8ea, #b5c6ff 50%, #4b92db 90%)",
          boxShadow: "inset -8px -8px 15px rgba(0,0,0,0.15), inset 8px 8px 15px rgba(255,255,255,0.6), 0 10px 20px rgba(0,0,0,0.1)",
          mixBlendMode: "hard-light",
          top: "15%",
          left: "25%",
        }}
        animate={{ y: ["-20px", "20px", "-20px"], x: ["-10px", "10px", "-10px"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        style={{
          position: "absolute",
          width: "5vw",
          height: "5vw",
          minWidth: "40px",
          minHeight: "40px",
          borderRadius: "50%",
          background: "radial-gradient(circle at 30% 30%, #00f4d3, #4facfe 50%, #b5c6ff 90%)",
          boxShadow: "inset -5px -5px 10px rgba(0,0,0,0.15), inset 5px 5px 10px rgba(255,255,255,0.6), 0 5px 15px rgba(0,0,0,0.1)",
          mixBlendMode: "hard-light",
          top: "40%",
          right: "15%",
        }}
        animate={{ y: ["25px", "-25px", "25px"], x: ["15px", "-15px", "15px"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        style={{
          position: "absolute",
          width: "6vw",
          height: "6vw",
          minWidth: "50px",
          minHeight: "50px",
          borderRadius: "50%",
          background: "radial-gradient(circle at 30% 30%, #a1ffd5, #00f4d3 50%, #4b92db 90%)",
          boxShadow: "inset -6px -6px 12px rgba(0,0,0,0.15), inset 6px 6px 12px rgba(255,255,255,0.6), 0 8px 18px rgba(0,0,0,0.1)",
          mixBlendMode: "hard-light",
          bottom: "20%",
          left: "40%",
        }}
        animate={{ y: ["-15px", "15px", "-15px"], x: ["-15px", "15px", "-15px"] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <div 
        style={{
          position: "absolute", inset: 0, opacity: 0.1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay", zIndex: 1, pointerEvents: "none"
        }}
      />
    </motion.div>
  );
}
