import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// ─── DATA ───────────────────────────────────────────────────────────────────

const CEO = {
  name: "Hrishikesh Mishra",
  title: "Founder & CEO",
  tagline:
    "Building BELVO to deliver world-class digital solutions — one idea, one team, one product at a time.",
};

const TEAMS = [
  {
    id: "web",
    name: "Web Development",
    color: "#7B2FBE",
    lightColor: "#9D4EDD",
    members: [
      "Lokesh", "Sri Satya", "Akhil", "Harsh", "Saurav",
      "Mohammad Anasuddin Zaid", "Ishwari",
      "Sandali", "Tamil Selvan", "Ramnath",
    ],
  },
  {
    id: "app",
    name: "App Development",
    color: "#7B2FBE",
    lightColor: "#9D4EDD",
    members: ["Anand", "Anshika Srivastava", "Aaryan", "Suhani", "Aditya", "Navin Kumar", "Navin J.D"],
  },
  {
    id: "analytics",
    name: "Business & Data Analytics",
    color: "#7B2FBE",
    lightColor: "#9D4EDD",
    members: ["Ishika", "Obed", "Sasikumar", "Sharfudeen", "Sibijan"],
  },
  {
    id: "Graphic",
    name: "Graphic Designing",
    color: "#7B2FBE",
    lightColor: "#9D4EDD",
    members: ["Anurag khushwaha", "Rimi gosh", "Sanskruti akare", "Deepak Sharma"],
  },
  {
    id: "admin",
    name: "Administration",
    color: "#C9A341",
    lightColor: "#E0B84A",
    members: ["Mohammad Ali"],
    responsibilities: ["Operations", "Team Coordination", "Client Communication", "Internal Management"] as readonly string[],
  },

] as const;

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] },
  }),
};

// ─── CEO CARD ────────────────────────────────────────────────────────────────

// function CeoCard({ inView }: { inView: boolean }) {
//   const initials = getInitials(CEO.name);

//   return (
//     <motion.div
//       custom={3}
//       variants={fadeUp}
//       initial="hidden"
//       animate={inView ? "visible" : "hidden"}
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         marginBottom: "80px",
//       }}
//     >
//       <motion.div
//         whileHover={{ y: -6, transition: { duration: 0.22, ease: "easeOut" } }}
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: "48px",
//           maxWidth: "680px",
//           width: "100%",
//           padding: "48px 56px",
//           background: "var(--belvo-bg-card)",
//           border: "1px solid #7B2FBE44",
//           borderRadius: "20px",
//           position: "relative",
//           overflow: "hidden",
//           backdropFilter: "blur(14px)",
//           boxShadow: "0 0 0 1px #C9A34122, inset 0 1px 0 rgba(255,255,255,0.06)",
//         }}
//       >
//         {/* top-right ambient glow */}
//         <div style={{
//           position: "absolute", top: -60, right: -60,
//           width: 220, height: 220, borderRadius: "50%",
//           background: "radial-gradient(ellipse, rgba(123,47,190,0.14), transparent 70%)",
//           pointerEvents: "none",
//         }} />

//         {/* avatar */}
//         <div style={{ position: "relative", flexShrink: 0 }}>
//           {/* outer orbit ring */}
//           <div style={{
//             position: "absolute", inset: -8, borderRadius: "50%",
//             border: "1.5px solid rgba(201,163,65,0.28)",
//             animation: "belvoCeoSpin 12s linear infinite",
//           }} />
//           {/* dashed orbit */}
//           <div style={{
//             position: "absolute", inset: -16, borderRadius: "50%",
//             border: "0.5px dashed rgba(123,47,190,0.2)",
//             animation: "belvoCeoSpin 20s linear infinite reverse",
//           }} />

//           <div style={{
//             width: 120, height: 120, borderRadius: "50%",
//             background: "linear-gradient(135deg, rgba(123,47,190,0.85), rgba(157,78,221,0.5))",
//             border: "2px solid rgba(123,47,190,0.4)",
//             display: "flex", alignItems: "center", justifyContent: "center",
//             position: "relative", zIndex: 1,
//           }}>
//             <div style={{
//               position: "absolute", inset: 4, borderRadius: "50%",
//               border: "1px solid rgba(255,255,255,0.15)",
//             }} />
//             <span style={{
//               fontFamily: "'Inter', sans-serif",
//               fontWeight: 800, fontSize: "2rem", color: "#fff",
//               letterSpacing: "-0.02em", position: "relative", zIndex: 1,
//             }}>{initials}</span>
//           </div>

//           {/* gold status dot */}
//           <div style={{
//             position: "absolute", bottom: 6, right: 6,
//             width: 18, height: 18, borderRadius: "50%",
//             background: "linear-gradient(135deg, #C9A341, #E0B84A)",
//             border: "2.5px solid var(--belvo-bg)",
//             boxShadow: "0 0 10px rgba(201,163,65,0.6)",
//             zIndex: 2,
//           }} />
//         </div>

//         {/* info */}
//         <div style={{ flex: 1, minWidth: 0 }}>
//           {/* CEO badge */}
//           <div style={{
//             display: "inline-flex", alignItems: "center", gap: 6,
//             background: "linear-gradient(135deg, rgba(201,163,65,0.15), rgba(224,184,74,0.08))",
//             border: "0.5px solid rgba(201,163,65,0.35)",
//             borderRadius: "100px", padding: "4px 14px",
//             marginBottom: 10,
//           }}>
//             <svg width={11} height={11} viewBox="0 0 20 20" fill="none" aria-hidden="true">
//               <path d="M10 2l2.3 5H17l-3.9 3 1.4 5.3L10 12.5 5.5 15.3l1.4-5.3L3 7h4.7z" fill="#E0B84A" />
//             </svg>
//             <span style={{
//               fontFamily: "'Inter', sans-serif",
//               fontSize: "0.62rem", fontWeight: 600,
//               letterSpacing: "0.2em", textTransform: "uppercase",
//               color: "#E0B84A",
//             }}>Chief Executive Officer</span>
//           </div>

//           <div style={{
//             fontFamily: "'Inter', sans-serif",
//             fontWeight: 800, fontSize: "1.6rem",
//             color: "var(--belvo-text-1)", letterSpacing: "-0.02em",
//             marginBottom: 4, lineHeight: 1.1,
//           }}>
//             {CEO.name}
//             <span style={{ color: "var(--belvo-text-3)", fontWeight: 400, fontSize: "1rem" }}>
//               {" "}— Founder & CEO
//             </span>
//           </div>

//           <div style={{
//             fontFamily: "'Inter', sans-serif",
//             fontSize: "0.8rem", color: "var(--belvo-text-3)", marginBottom: 18,
//           }}>BELVO · Visionary · Builder</div>

//           <div style={{
//             fontFamily: "'Inter', sans-serif",
//             fontSize: "0.88rem", color: "var(--belvo-text-2)",
//             lineHeight: 1.7, fontStyle: "italic",
//             borderLeft: "2px solid rgba(201,163,65,0.4)",
//             paddingLeft: 14,
//           }}>
//             {CEO.tagline}
//           </div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// }


// Assuming getInitials, CEO, and fadeUp are defined elsewhere in your file
// function CeoCard({ inView }: { inView: boolean }) {
//   const initials = getInitials(CEO.name);

//   return (
//     <motion.div
//       custom={3}
//       variants={fadeUp}
//       initial="hidden"
//       animate={inView ? "visible" : "hidden"}
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         marginBottom: "80px",
//       }}
//     >
//       <motion.div
//         whileHover={{ y: -6, transition: { duration: 0.22, ease: "easeOut" } }}
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: "48px",
//           maxWidth: "680px",
//           width: "100%",
//           padding: "48px 56px",
//           // Swapped the background to a deep slate/navy glass effect
//           background: "rgba(15, 23, 42, 0.65)",
//           // Changed border to a subtle steel blue
//           border: "1px solid rgba(56, 189, 248, 0.2)",
//           borderRadius: "20px",
//           position: "relative",
//           overflow: "hidden",
//           backdropFilter: "blur(16px)",
//           // Updated shadow to match the cool theme
//           boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
//         }}
//       >
//         {/* top-right ambient glow - Changed from purple to soft cyan */}
//         <div style={{
//           position: "absolute", top: -60, right: -60,
//           width: 220, height: 220, borderRadius: "50%",
//           background: "radial-gradient(ellipse, rgba(56, 189, 248, 0.12), transparent 70%)",
//           pointerEvents: "none",
//         }} />

//         {/* avatar */}
//         <div style={{ position: "relative", flexShrink: 0 }}>
//           {/* outer orbit ring - Changed to steel blue */}
//           <div style={{
//             position: "absolute", inset: -8, borderRadius: "50%",
//             border: "1.5px solid rgba(56, 189, 248, 0.25)",
//             animation: "belvoCeoSpin 12s linear infinite",
//           }} />
//           {/* dashed orbit - Changed to muted slate */}
//           <div style={{
//             position: "absolute", inset: -16, borderRadius: "50%",
//             border: "0.5px dashed rgba(148, 163, 184, 0.3)",
//             animation: "belvoCeoSpin 20s linear infinite reverse",
//           }} />

//           {/* Avatar Background - Changed to a cool blue/cyan gradient */}
//           <div style={{
//             width: 120, height: 120, borderRadius: "50%",
//             background: "linear-gradient(135deg, rgba(2, 132, 199, 0.85), rgba(14, 165, 233, 0.5))",
//             border: "2px solid rgba(56, 189, 248, 0.4)",
//             display: "flex", alignItems: "center", justifyContent: "center",
//             position: "relative", zIndex: 1,
//           }} >
//             <div style={{
//               position: "absolute", inset: 4, borderRadius: "50%",
//               border: "1px solid rgba(255,255,255,0.15)",
//             }} />
//             <span style={{
//               fontFamily: "'Inter', sans-serif",
//               fontWeight: 800, fontSize: "2rem", color: "#F8FAFC",
//               letterSpacing: "-0.02em", position: "relative", zIndex: 1,
//             }}>{initials}</span>
//           </div>

//           {/* Status dot - Changed from gold to an "active" crisp cyan */}
//           <div style={{
//             position: "absolute", bottom: 6, right: 6,
//             width: 18, height: 18, borderRadius: "50%",
//             background: "linear-gradient(135deg, #38BDF8, #0EA5E9)",
//             border: "2.5px solid #0F172A", // Matches the new slate background
//             boxShadow: "0 0 10px rgba(56, 189, 248, 0.6)",
//             zIndex: 2,
//           }} />
//         </div>

//         {/* info */}
//         <div style={{ flex: 1, minWidth: 0 }}>
//           {/* CEO badge - Changed from gold to a sleek icy blue */}
//           <div style={{
//             display: "inline-flex", alignItems: "center", gap: 6,
//             background: "linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(14, 165, 233, 0.08))",
//             border: "0.5px solid rgba(56, 189, 248, 0.3)",
//             borderRadius: "100px", padding: "4px 14px",
//             marginBottom: 10,
//           }}>
//             <svg width={11} height={11} viewBox="0 0 20 20" fill="none" aria-hidden="true">
//               <path d="M10 2l2.3 5H17l-3.9 3 1.4 5.3L10 12.5 5.5 15.3l1.4-5.3L3 7h4.7z" fill="#38BDF8" />
//             </svg>
//             <span style={{
//               fontFamily: "'Inter', sans-serif",
//               fontSize: "0.62rem", fontWeight: 600,
//               letterSpacing: "0.2em", textTransform: "uppercase",
//               color: "#38BDF8",
//             }}>Chief Executive Officer</span>
//           </div>

//           <div style={{
//             fontFamily: "'Inter', sans-serif",
//             fontWeight: 800, fontSize: "1.6rem",
//             color: "#F1F5F9", letterSpacing: "-0.02em",
//             marginBottom: 4, lineHeight: 1.1,
//           }}>
//             {CEO.name}
//             <span style={{ color: "#94A3B8", fontWeight: 400, fontSize: "1rem" }}>
//               {" "}— Founder & CEO
//             </span>
//           </div>

//           <div style={{
//             fontFamily: "'Inter', sans-serif",
//             fontSize: "0.8rem", color: "#94A3B8", marginBottom: 18,
//           }}>BELVO · Visionary · Builder</div>

//           <div style={{
//             fontFamily: "'Inter', sans-serif",
//             fontSize: "0.88rem", color: "#CBD5E1",
//             lineHeight: 1.7, fontStyle: "italic",
//             // Changed accent border from gold to steel blue
//             borderLeft: "2px solid rgba(56, 189, 248, 0.4)",
//             paddingLeft: 14,
//           }}>
//             {CEO.tagline}
//           </div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// }


// Assuming CEO and fadeUp are imported/defined elsewhere in your file
// const CEO = { name: "Hrishikesh Mishra", tagline: "Building BELVO to deliver world-class digital solutions..." };
// const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

// export function CeoCard({ inView }: { inView: boolean }) {
//   // Utility function for initials (assuming it's defined in your file)
//   const getInitials = (name: string) => {
//     return name.split(" ").map((n) => n[0]).join("");
//   };

//   const initials = getInitials("Hrishikesh Mishra"); // Replace with CEO.name dynamically

//   return (
//     <motion.div
//       custom={3}
//       variants={fadeUp} // Ensure fadeUp is defined in your scope
//       initial="hidden"
//       animate={inView ? "visible" : "hidden"}
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         marginBottom: "80px",
//       }}
//     >
//       <motion.div
//         whileHover={{ y: -6, transition: { duration: 0.22, ease: "easeOut" } }}
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: "48px",
//           maxWidth: "680px",
//           width: "100%",
//           padding: "48px 56px",
//           // INCREASED OPACITY: A solid gradient prevents light backgrounds from washing out the card
//           background: "linear-gradient(145deg, #1E293B, #0F172A)",
//           border: "1px solid rgba(56, 189, 248, 0.2)",
//           borderRadius: "20px",
//           position: "relative",
//           overflow: "hidden",
//           // Elevated shadow to ensure it pops off a white background in light theme
//           boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
//         }}
//       >
//         {/* Top-right ambient glow - Subtle cyan */}
//         <div style={{
//           position: "absolute", top: -60, right: -60,
//           width: 220, height: 220, borderRadius: "50%",
//           background: "radial-gradient(ellipse, rgba(56, 189, 248, 0.15), transparent 70%)",
//           pointerEvents: "none",
//         }} />

//         {/* Avatar Section */}
//         <div style={{ position: "relative", flexShrink: 0 }}>
//           {/* Outer orbit ring */}
//           <div style={{
//             position: "absolute", inset: -8, borderRadius: "50%",
//             border: "1.5px solid rgba(56, 189, 248, 0.25)",
//             animation: "belvoCeoSpin 12s linear infinite", // Ensure this keyframe is in your CSS
//           }} />
//           {/* Dashed orbit */}
//           <div style={{
//             position: "absolute", inset: -16, borderRadius: "50%",
//             border: "0.5px dashed rgba(148, 163, 184, 0.3)",
//             animation: "belvoCeoSpin 20s linear infinite reverse",
//           }} />

//           {/* Avatar Background */}
//           <div style={{
//             width: 120, height: 120, borderRadius: "50%",
//             background: "linear-gradient(135deg, rgba(2, 132, 199, 0.9), rgba(14, 165, 233, 0.7))",
//             border: "2px solid rgba(56, 189, 248, 0.5)",
//             display: "flex", alignItems: "center", justifyContent: "center",
//             position: "relative", zIndex: 1,
//           }} >
//             <div style={{
//               position: "absolute", inset: 4, borderRadius: "50%",
//               border: "1px solid rgba(255,255,255,0.2)",
//             }} />
//             <span style={{
//               fontFamily: "'Inter', sans-serif",
//               fontWeight: 800, fontSize: "2rem", color: "#FFFFFF",
//               letterSpacing: "-0.02em", position: "relative", zIndex: 1,
//             }}>
//               {initials}
//             </span>
//           </div>

//           {/* Active Status Dot */}
//           <div style={{
//             position: "absolute", bottom: 6, right: 6,
//             width: 18, height: 18, borderRadius: "50%",
//             background: "linear-gradient(135deg, #38BDF8, #0EA5E9)",
//             border: "2.5px solid #0F172A", // Matches the deep slate card background perfectly
//             boxShadow: "0 0 10px rgba(56, 189, 248, 0.6)",
//             zIndex: 2,
//           }} />
//         </div>

//         {/* Info Section */}
//         <div style={{ flex: 1, minWidth: 0 }}>
//           {/* CEO Badge */}
//           <div style={{
//             display: "inline-flex", alignItems: "center", gap: 6,
//             background: "linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(14, 165, 233, 0.08))",
//             border: "0.5px solid rgba(56, 189, 248, 0.3)",
//             borderRadius: "100px", padding: "4px 14px",
//             marginBottom: 10,
//           }}>
//             <svg width={11} height={11} viewBox="0 0 20 20" fill="none" aria-hidden="true">
//               <path d="M10 2l2.3 5H17l-3.9 3 1.4 5.3L10 12.5 5.5 15.3l1.4-5.3L3 7h4.7z" fill="#38BDF8" />
//             </svg>
//             <span style={{
//               fontFamily: "'Inter', sans-serif",
//               fontSize: "0.62rem", fontWeight: 700,
//               letterSpacing: "0.2em", textTransform: "uppercase",
//               color: "#38BDF8",
//             }}>
//               Chief Executive Officer
//             </span>
//           </div>

//           {/* Name & Title */}
//           <div style={{
//             fontFamily: "'Inter', sans-serif",
//             fontWeight: 800, fontSize: "1.6rem",
//             color: "#FFFFFF", // Pure white for highest contrast
//             letterSpacing: "-0.02em",
//             marginBottom: 4, lineHeight: 1.1,
//           }}>
//             Hrishikesh Mishra {/* Replace with {CEO.name} */}
//             <span style={{ color: "#94A3B8", fontWeight: 400, fontSize: "1rem" }}>
//               {" "}— Founder & CEO
//             </span>
//           </div>

//           <div style={{
//             fontFamily: "'Inter', sans-serif",
//             fontSize: "0.85rem", color: "#94A3B8", marginBottom: 18,
//           }}>
//             BELVO · Visionary · Builder
//           </div>

//           {/* Tagline / Quote */}
//           <div style={{
//             fontFamily: "'Inter', sans-serif",
//             fontSize: "0.9rem", color: "#CBD5E1",
//             lineHeight: 1.6, fontStyle: "italic",
//             borderLeft: "2px solid #38BDF8", // Solid cyan border for the quote
//             paddingLeft: 14,
//           }}>
//             Building BELVO to deliver world-class digital solutions — one idea, one team, one product at a time. {/* Replace with {CEO.tagline} */}
//           </div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// }

function CeoCard({ inView }: { inView: boolean }) {
  const initials = getInitials(CEO.name);
  const gold = "#C9A341"; // Primary gold accent

  return (
    <motion.div
      custom={3}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "80px",
      }}
    >
      <motion.div
        whileHover={{ y: -6, transition: { duration: 0.22, ease: "easeOut" } }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "48px",
          maxWidth: "680px",
          width: "100%",
          padding: "48px 56px",
          background: "var(--belvo-bg-card)",
          border: `1px solid ${gold}44`, // Gold border
          borderRadius: "20px",
          position: "relative",
          overflow: "hidden",
          backdropFilter: "blur(14px)",
          boxShadow: `0 0 0 1px ${gold}22, inset 0 1px 0 rgba(255,255,255,0.06)`,
        }}
      >
        {/* top-right ambient glow - Updated to gold */}
        <div style={{
          position: "absolute", top: -60, right: -60,
          width: 220, height: 220, borderRadius: "50%",
          background: `radial-gradient(ellipse, ${gold}22, transparent 70%)`,
          pointerEvents: "none",
        }} />

        {/* avatar */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{
            position: "absolute", inset: -8, borderRadius: "50%",
            border: `1.5px solid ${gold}44`,
            animation: "belvoCeoSpin 12s linear infinite",
          }} />
          <div style={{
            position: "absolute", inset: -16, borderRadius: "50%",
            border: `0.5px dashed ${gold}44`,
            animation: "belvoCeoSpin 20s linear infinite reverse",
          }} />

          {/* Avatar Background - Gold gradient */}
          <div style={{
            width: 120, height: 120, borderRadius: "50%",
            background: "linear-gradient(135deg, #C9A341, #E0B84A)",
            border: `2px solid ${gold}66`,
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", zIndex: 1,
          }}>
            <div style={{
              position: "absolute", inset: 4, borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.3)",
            }} />
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 800, fontSize: "2rem", color: "#fff",
              letterSpacing: "-0.02em", position: "relative", zIndex: 1,
            }}>{initials}</span>
          </div>

          {/* Gold status dot */}
          <div style={{
            position: "absolute", bottom: 6, right: 6,
            width: 18, height: 18, borderRadius: "50%",
            background: "linear-gradient(135deg, #C9A341, #E0B84A)",
            border: "2.5px solid var(--belvo-bg)",
            boxShadow: `0 0 10px ${gold}66`,
            zIndex: 2,
          }} />
        </div>

        {/* info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* CEO badge - Gold */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: `${gold}15`,
            border: `0.5px solid ${gold}55`,
            borderRadius: "100px", padding: "4px 14px",
            marginBottom: 10,
          }}>
            <svg width={11} height={11} viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M10 2l2.3 5H17l-3.9 3 1.4 5.3L10 12.5 5.5 15.3l1.4-5.3L3 7h4.7z" fill={gold} />
            </svg>
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.62rem", fontWeight: 600,
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: gold,
            }}>Chief Executive Officer</span>
          </div>

          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 800, fontSize: "1.6rem",
            color: "var(--belvo-text-1)", letterSpacing: "-0.02em",
            marginBottom: 4, lineHeight: 1.1,
          }}>
            {CEO.name}
            <span style={{ color: "var(--belvo-text-3)", fontWeight: 400, fontSize: "1rem" }}>
              {" "}— Founder & CEO
            </span>
          </div>

          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.8rem", color: "var(--belvo-text-3)", marginBottom: 18,
          }}>BELVO · Visionary · Builder</div>

          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.88rem", color: "var(--belvo-text-2)",
            lineHeight: 1.7, fontStyle: "italic",
            borderLeft: `2px solid ${gold}66`,
            paddingLeft: 14,
          }}>
            {CEO.tagline}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}


// ─── MEMBER CARD ─────────────────────────────────────────────────────────────

function MemberCard({
  name, team, color, lightColor, responsibilities, inView, index,
}: {
  name: string; team: string; color: string; lightColor: string;
  responsibilities?: readonly string[]; inView: boolean; index: number;
}) {
  const initials = getInitials(name);

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover={{ y: -6, transition: { duration: 0.22, ease: "easeOut" } }}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "28px 20px 24px",
        background: "var(--belvo-bg-card)",
        border: "1px solid var(--belvo-border-card)",
        borderRadius: "18px",
        cursor: "default", position: "relative", overflow: "hidden",
        backdropFilter: "blur(14px)",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = `${color}55`;
        el.style.boxShadow = `0 16px 56px rgba(123,47,190,0.18), 0 0 0 1px ${color}22`;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--belvo-border-card)";
        el.style.boxShadow = "none";
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: 80, height: 40,
        background: `radial-gradient(ellipse at center, ${color}25, transparent 70%)`,
        filter: "blur(12px)", pointerEvents: "none",
      }} />

      <div style={{ position: "relative", marginBottom: 16 }}>
        <div style={{
          width: 84, height: 84, borderRadius: "50%",
          background: `linear-gradient(135deg, ${color}cc, ${lightColor}88)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          border: `2px solid ${color}44`,
          boxShadow: `0 0 28px ${color}22`,
          position: "relative",
        }}>
          <div style={{
            position: "absolute", inset: 4, borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.15)",
          }} />
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 800, fontSize: "1.35rem", color: "#fff",
            letterSpacing: "-0.02em", position: "relative", zIndex: 1,
          }}>{initials}</span>
        </div>
        <div style={{
          position: "absolute", bottom: 4, right: 4,
          width: 14, height: 14, borderRadius: "50%",
          background: `linear-gradient(135deg, ${color}, ${lightColor})`,
          border: "2.5px solid var(--belvo-bg)",
          boxShadow: `0 0 10px ${color}80`,
        }} />
      </div>

      <span style={{
        fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.9rem",
        color: "var(--belvo-text-1)", textAlign: "center",
        letterSpacing: "-0.01em", lineHeight: 1.3, marginBottom: 6,
      }}>{name}</span>

      <span style={{
        fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", fontWeight: 500,
        letterSpacing: "0.18em", textTransform: "uppercase",
        color: lightColor,
        marginBottom: responsibilities ? 14 : 0,
      }}>{team}</span>

      {responsibilities && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 4 }}>
          {responsibilities.map(r => (
            <span key={r} style={{
              fontFamily: "'Inter', sans-serif", fontSize: "0.6rem", fontWeight: 600,
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: "var(--belvo-text-2)",
              background: "var(--belvo-bg-card-2)",
              border: "1px solid var(--belvo-border-card)",
              borderRadius: "100px", padding: "3px 10px",
            }}>{r}</span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── TEAM GROUP ───────────────────────────────────────────────────────────────

function TeamGroup({ team }: { team: typeof TEAMS[number] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const isAdmin = team.id === "admin";

  return (
    <div ref={ref} style={{ marginBottom: isAdmin ? 0 : "64px" }}>
      {/* Admin separator */}
      {isAdmin && (
        <motion.div
          custom={0} variants={fadeUp} initial="hidden"
          animate={inView ? "visible" : "hidden"}
          style={{
            display: "flex", alignItems: "center", gap: 14,
            marginBottom: 40, marginTop: 16,
          }}
        >
          <div style={{ flex: 1, height: 1, background: "var(--belvo-border-card)" }} />
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.62rem", fontWeight: 600,
            letterSpacing: "0.22em", textTransform: "uppercase",
            color: "#E0B84A",
            background: "rgba(201,163,65,0.1)",
            border: "0.5px solid rgba(201,163,65,0.3)",
            borderRadius: "100px", padding: "5px 16px",
          }}>Administration</span>
          <div style={{ flex: 1, height: 1, background: "var(--belvo-border-card)" }} />
        </motion.div>
      )}

      {/* Group header (skip for admin — label handled by separator above) */}
      {!isAdmin && (
        <motion.div
          custom={0} variants={fadeUp} initial="hidden"
          animate={inView ? "visible" : "hidden"}
          style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}
        >
          <div style={{
            width: 3, height: 22,
            background: `linear-gradient(180deg, ${team.color}, transparent)`,
            borderRadius: 2, flexShrink: 0,
          }} />
          <h3 style={{
            fontFamily: "'Inter', sans-serif", fontWeight: 800,
            fontSize: "clamp(0.95rem, 2vw, 1.15rem)",
            color: "var(--belvo-text-1)", margin: 0, letterSpacing: "-0.01em",
          }}>{team.name}</h3>
          <div style={{
            height: 1, flex: 1,
            background: `linear-gradient(90deg, ${team.color}28, transparent)`,
          }} />
          <span style={{
            fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", fontWeight: 600,
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "var(--belvo-text-4)",
          }}>{team.members.length} {team.members.length === 1 ? "member" : "members"}</span>
        </motion.div>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: isAdmin ? "repeat(auto-fill, minmax(200px, 220px))" : "repeat(auto-fill, minmax(160px, 1fr))",
        gap: 16,
      }}>
        {team.members.map((name, i) => (
          <MemberCard
            key={name}
            name={name}
            team={team.name}
            color={team.color}
            lightColor={team.lightColor}
            responsibilities={"responsibilities" in team ? team.responsibilities : undefined}
            inView={inView}
            index={i + 1}
          />
        ))}
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────

export default function TeamSection() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <>
      {/* CSS keyframes for CEO card orbit rings */}
      <style>{`
        @keyframes belvoCeoSpin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 600px) {
          .belvo-ceo-inner {
            flex-direction: column !important;
            text-align: center !important;
            padding: 36px 28px !important;
            gap: 28px !important;
          }
        }
      `}</style>

      <section
        id="team"
        style={{
          background: "var(--belvo-bg)",
          position: "relative",
          overflow: "hidden",
          padding: "100px 24px 120px",
        }}
      >
        {/* top divider */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent, var(--belvo-border-divider), transparent)",
        }} />
        {/* ambient glow blob */}
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: "70vw", height: 400,
          background: "radial-gradient(ellipse at center, var(--belvo-glow-blob) 0%, transparent 65%)",
          filter: "blur(70px)", pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* ── Section header ── */}
          <div ref={headerRef} style={{ textAlign: "center", marginBottom: "80px" }}>
            <motion.span
              custom={0} variants={fadeUp} initial="hidden"
              animate={headerInView ? "visible" : "hidden"}
              style={{
                display: "block",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.68rem", letterSpacing: "0.35em",
                textTransform: "uppercase", color: "#9D4EDD", marginBottom: 14,
              }}
            >Our Team</motion.span>

            <motion.h2
              custom={1} variants={fadeUp} initial="hidden"
              animate={headerInView ? "visible" : "hidden"}
              style={{
                fontFamily: "'Inter', sans-serif", fontWeight: 900,
                fontSize: "clamp(2rem, 5vw, 3.8rem)", lineHeight: 1.05,
                color: "var(--belvo-text-1)", margin: "0 0 16px",
                letterSpacing: "-0.01em",
              }}
            >
              The BELVO{" "}
              <span style={{ color: "#9D4EDD" }}>Collective</span>
            </motion.h2>

            <motion.p
              custom={2} variants={fadeUp} initial="hidden"
              animate={headerInView ? "visible" : "hidden"}
              style={{
                fontFamily: "'Inter', sans-serif", fontSize: "0.95rem",
                lineHeight: 1.75, color: "var(--belvo-text-3)",
                maxWidth: 520, margin: "0 auto", letterSpacing: "0.01em",
              }}
            >
              Meet the talented people building exceptional digital experiences together.
            </motion.p>
          </div>

          {/* ── CEO card ── */}
          <CeoCard inView={headerInView} />

          {/* ── Team groups ── */}
          {TEAMS.map((team) => (
            <TeamGroup key={team.id} team={team} />
          ))}

        </div>
      </section>
    </>
  );
}