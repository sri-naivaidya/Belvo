import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const easeSmooth = [0.22, 1, 0.36, 1] as const;

const imageModules = import.meta.glob<{ default: string }>("/src/collectives/*", { eager: true, import: "default" });

const IMAGE_MAP: Record<string, string> = {};
Object.entries(imageModules).forEach(([path, url]) => {
  const name = path.split("/").pop()!.replace(/\.[^.]+$/, "").toLowerCase();
  IMAGE_MAP[name] = url;
});

const NAME_OVERRIDES: Record<string, string> = {
  "ram nath g k": "ramnath",
  "saurav": "sourav",
  "sharfudeen": "sharfu",
  "sheth yamani": "seth yamani",
  "naveen k d": "naveen kumar",
  "mohammad anasuddin zaid": "aman",
  "shailender": "shilendar",
  "sibijan": "sibi",
  "raavula vaibhav": "vaibhav",
  "sanskruti akare": "sanskruthi",
  "rimi gosh": "rimi",
  "mohd usaid ali khan": "mohd usaid",
  "anshika srivastava": "anshika",
  "sri satya": "sri",
  "guru dutt": "guru",
  "anurag khushwaha": "anurag",
  "achintya gurba": "achintya gurba",
  "deepak sharma": "deepak sharma",
};

function getImageUrl(memberName: string): string | undefined {
  const key = memberName.toLowerCase().trim();
  const override = NAME_OVERRIDES[key];
  if (override && IMAGE_MAP[override]) return IMAGE_MAP[override];
  const BLOCKED = new Set(["naveen kumar"]);
  if (!BLOCKED.has(key) && IMAGE_MAP[key]) return IMAGE_MAP[key];
  const firstName = key.split(/\s+/)[0];
  if (!BLOCKED.has(firstName) && IMAGE_MAP[firstName]) return IMAGE_MAP[firstName];
  const lastName = key.split(/\s+/).pop()!;
  if (!BLOCKED.has(lastName) && IMAGE_MAP[lastName]) return IMAGE_MAP[lastName];
  const fuzzy = Object.keys(IMAGE_MAP).find(k => !BLOCKED.has(k) && (key.includes(k) || k.includes(key)));
  if (fuzzy) return IMAGE_MAP[fuzzy];
  return undefined;
}

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
      "Lokesh", "Sri Satya", "Akhil",
      "Mohammad Anasuddin Zaid", "Ishwari",
      "Sandali", "Tamil Selvan", "Ram Nath G K",
      "Guru dutt", "Shailender",
    ],
  },
  {
    id: "app",
    name: "App Development",
    color: "#7B2FBE",
    lightColor: "#9D4EDD",
    members: ["Anand", "Anshika Srivastava", "Aaryan", "Suhani", "Aditya", "Naveen Kumar", "Naveen K D"],
  },
  {
    id: "cyber",
    name: "Cyber Security",
    color: "#7B2FBE",
    lightColor: "#9D4EDD",
    members: ["Harsh", "Sourav", "Parv"],
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
    id: "hr",
    name: "Human Resource",
    color: "#7B2FBE",
    lightColor: "#9D4EDD",
    members: ["Raavula Vaibhav", "Mohd Usaid Ali Khan"],
    responsibilities: ["HR"],
  },
  {
    id: "admin",
    name: "Administration",
    color: "#007BFF",
    lightColor: "#0056b3",
    members: ["Mohammad Ali"],
    responsibilities: ["Operations", "Team Coordination", "Client Communication", "Internal Management"] as readonly string[],
  },
  {
    id: "coadmin",
    name: "Co-Administration",
    color: "#007BFF",
    lightColor: "#0056b3",
    members: ["Achintya Gurba"],
    responsibilities: ["Operations", "Team Coordination", "Client Communication", "Internal Management"] as readonly string[],
  },
  {
    id: "content",
    name: "Content Writer",
    color: "#7B2FBE",
    lightColor: "#9D4EDD",
    members: ["Sheth Yamani"],
  }
] as const;

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const fadeUp = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: i * 0.05, ease: "easeOut" },
  }),
};

// ─── CEO CARD ────────────────────────────────────────────────────────────────

function CeoCard({ inView }: { inView: boolean }) {
  const initials = getInitials(CEO.name);
  const gold = "#C9A341";
  const ceoImg = getImageUrl(CEO.name);

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
        style={{
          display: "flex",
          alignItems: "center",
          gap: "48px",
          maxWidth: "680px",
          width: "100%",
          padding: "48px 56px",
          background: "var(--belvo-bg-card)",
          border: `1px solid ${gold}44`,
          borderRadius: "20px",
          position: "relative",
          overflow: "hidden",
          backdropFilter: "blur(14px)",
          boxShadow: `0 0 0 1px ${gold}22, inset 0 1px 0 rgba(255,255,255,0.06)`,
        }}
      >
        <div style={{
          position: "absolute", top: -60, right: -60,
          width: 220, height: 220, borderRadius: "50%",
          background: `radial-gradient(ellipse, ${gold}22, transparent 70%)`,
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{
            position: "absolute", inset: -8, borderRadius: "50%",
            border: `1.5px solid ${gold}44`,
          }} />
          <div style={{
            position: "absolute", inset: -16, borderRadius: "50%",
            border: `0.5px dashed ${gold}44`,
          }} />

          <div
            style={{
              width: 120, height: 120, borderRadius: "50%",
              background: ceoImg ? "none" : "linear-gradient(135deg, #C9A341, #E0B84A)",
              border: `2px solid ${gold}66`,
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative", zIndex: 1, overflow: "hidden",
              boxShadow: `0 0 30px ${gold}33`,
            }}
          >
            {ceoImg ? (
              <img
                src={ceoImg} alt={CEO.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
              />
            ) : (
              <>
                <div style={{
                  position: "absolute", inset: 4, borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.3)",
                }} />
                <span style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 800, fontSize: "2rem", color: "#fff",
                  letterSpacing: "-0.02em", position: "relative", zIndex: 1,
                }}>{initials}</span>
              </>
            )}
          </div>

          <div style={{
            position: "absolute", bottom: 6, right: 6,
            width: 18, height: 18, borderRadius: "50%",
            background: "linear-gradient(135deg, #C9A341, #E0B84A)",
            border: "2.5px solid var(--belvo-bg)",
            boxShadow: `0 0 10px ${gold}66`,
            zIndex: 2,
          }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
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
  const img = getImageUrl(name);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={cardRef}
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "28px 20px 24px",
        background: "var(--belvo-bg-card)",
        border: "1px solid var(--belvo-border-card)",
        borderRadius: "18px",
        cursor: "default", position: "relative", overflow: "hidden",
        backdropFilter: "blur(14px)",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: 80, height: 40,
        background: `radial-gradient(ellipse at center, ${color}25, transparent 70%)`,
        filter: "blur(12px)", pointerEvents: "none",
      }} />

      <div style={{ position: "relative", marginBottom: 16 }}>
        <div
          style={{
            width: 84, height: 84, borderRadius: "50%",
            background: img ? "none" : `linear-gradient(135deg, ${color}cc, ${lightColor}88)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: `2px solid ${color}44`,
            boxShadow: `0 0 28px ${color}22`,
            position: "relative", overflow: "hidden",
          }}
        >
          {img ? (
            <img src={img} alt={name}
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
            />
          ) : (
            <>
              <div style={{
                position: "absolute", inset: 4, borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.15)",
              }} />
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 800, fontSize: "1.35rem", color: "#fff",
                letterSpacing: "-0.02em", position: "relative", zIndex: 1,
              }}>{initials}</span>
            </>
          )}
        </div>
        <div
          style={{
            position: "absolute", bottom: 4, right: 4,
            width: 14, height: 14, borderRadius: "50%",
            background: `linear-gradient(135deg, ${color}, ${lightColor})`,
            border: "2.5px solid var(--belvo-bg)",
            boxShadow: `0 0 10px ${color}80`,
          }}
        />
      </div>

      <span style={{
        fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.9rem",
        color: "var(--belvo-text-1)", textAlign: "center",
        letterSpacing: "-0.01em", lineHeight: 1.3, marginBottom: 6,
      }}>{name}</span>
