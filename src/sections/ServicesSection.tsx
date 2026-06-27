import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Sparkles, Search, Megaphone, Palette, Share2, Box, Video, Image, Globe, ShoppingCart, BarChart3, Users, Smartphone, Code, GitBranch } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface Props {
  id: string;
}

const SERVICE_ICONS = [
  <Search size={16} />,
  <Megaphone size={16} />,
  <Palette size={16} />,
  <Share2 size={16} />,
  <Box size={16} />,
  <Video size={16} />,
  <Image size={16} />,
  <Globe size={16} />,
  <ShoppingCart size={16} />,
  <BarChart3 size={16} />,
  <Users size={16} />,
  <Smartphone size={16} />,
  <Code size={16} />,
  <GitBranch size={16} />,
];

const SERVICE_IMAGES = [
  "https://images.unsplash.com/photo-1557838923-2985c318be48?w=200&q=80",
  "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=200&q=80",
  "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&q=80",
  "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&q=80",
  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&q=80",
  "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=200&q=80",
  "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=200&q=80",
  "https://images.unsplash.com/photo-1547658719-da2b51169166?w=200&q=80",
  "https://images.unsplash.com/photo-1553729459-afe8f6eeb8e7?w=200&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&q=80",
  "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=200&q=80",
  "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=200&q=80",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&q=80",
  "https://images.unsplash.com/photo-1559526324-593bc073d938?w=200&q=80",
];

const SERVICES = [
  {
    id: "seo-digital-marketing",
    category: "SEO Digital Marketing",
    keywords: ["SEO", "organic growth", "search ranking", "keyword strategy", "on-page/off-page"],
    desc: "We optimize your digital presence to rank higher on search engines. From keyword research to technical SEO and link building, we drive sustainable organic traffic that converts.",
  },
  {
    id: "brand-outreach-pr",
    category: "Brand Outreach & PR",
    keywords: ["public relations", "brand awareness", "media coverage", "press", "outreach"],
    desc: "We craft compelling narratives and pitch your brand to the right publications and media houses — building credibility and expanding your brand's reach in the right circles.",
  },
  {
    id: "branding",
    category: "Branding",
    keywords: ["brand identity", "logo", "brand guide", "visual language", "positioning"],
    desc: "From naming and logo design to a complete brand identity system, we build brands that are memorable, consistent, and strategically positioned for long-term growth.",
  },
  {
    id: "social-media",
    category: "Social Media",
    keywords: ["content creation", "social strategy", "community management", "Instagram", "LinkedIn"],
    desc: "We manage and grow your social media presence with a data-driven content strategy — combining creative storytelling with platform-specific tactics to build loyal communities.",
  },
  {
    id: "3d-cgi",
    category: "3D & CGI",
    keywords: ["3D rendering", "CGI", "product visualization", "architectural renders", "3D animation"],
    desc: "We create hyper-realistic 3D visuals and CGI content for products, architecture, ads, and campaigns — enabling stunning visuals before anything is physically built.",
  },
  {
    id: "animation-vfx",
    category: "Animation & VFX",
    keywords: ["motion graphics", "visual effects", "2D/3D animation", "explainer videos"],
    desc: "From sleek motion graphics to full visual effects pipelines, we bring your stories to life through animation and VFX that captivate and communicate at the highest level.",
  },
  {
    id: "graphics-designing",
    category: "Graphics Designing",
    keywords: ["graphic design", "visual content", "marketing creatives", "UI graphics", "print"],
    desc: "Our designers produce impactful visual content — from marketing creatives and social graphics to packaging and print — all aligned with your brand identity.",
  },
  {
    id: "web-development",
    category: "Web Development",
    keywords: ["website design", "frontend", "backend", "responsive", "CMS", "custom web apps"],
    desc: "We build fast, beautiful, and fully responsive websites and web applications using modern tech stacks — engineered for performance, SEO, and exceptional user experience.",
  },
  {
    id: "ecommerce-management",
    category: "E-Commerce Management",
    keywords: ["e-commerce", "Shopify", "WooCommerce", "product listings", "conversion rate", "store management"],
    desc: "End-to-end e-commerce solutions — from store setup and product management to CRO and scaling. We manage your online store so you can focus on growing your business.",
  },
  {
    id: "performance-marketing",
    category: "Performance Marketing",
    keywords: ["paid ads", "Google Ads", "Meta Ads", "ROI", "ROAS", "PPC", "conversion campaigns"],
    desc: "We run data-driven paid media campaigns across Google, Meta, and beyond — optimizing every rupee spent for maximum ROI with transparent reporting and rapid iteration.",
  },
  {
    id: "influencer-marketing",
    category: "Influencer Marketing",
    keywords: ["influencer outreach", "UGC", "creator campaigns", "brand collaborations", "micro-influencers"],
    desc: "We connect your brand with the right influencers — from macro to micro — to create authentic campaigns that reach your exact target audience and drive real results.",
  },
  {
    id: "app-development",
    category: "App Development",
    keywords: ["mobile app", "iOS", "Android", "Flutter", "React Native", "UI/UX", "app design"],
    desc: "We design and develop intuitive mobile applications for iOS and Android — from concept and wireframing to launch and post-launch support, built for performance and scale.",
  },
  {
    id: "software-development",
    category: "Software Development",
    keywords: ["custom software", "SaaS", "enterprise solutions", "API", "backend systems"],
    desc: "We engineer custom software solutions tailored to your business needs — scalable, secure, and built with clean architecture to solve complex problems efficiently.",
  },
  {
    id: "crm-automation",
    category: "CRM & Automation",
    keywords: ["CRM setup", "workflow automation", "Zapier", "HubSpot", "customer retention", "lead management"],
    desc: "We implement and optimize CRM systems and automation workflows that streamline your sales, marketing, and operations — reducing manual work and improving customer retention.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] as const } }),
};

export default function ServicesSection({ id }: Props) {
  const { theme } = useTheme();
  const isIvory = theme === "ivory";
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-80px" });
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-80px" });
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-80px" });

  return (
    <section id={id} style={{ background: "var(--belvo-bg)", overflow: "hidden" }}>
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <div
        ref={heroRef}
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          padding: "100px 24px 80px",
          textAlign: "center",
        }}
      >
        {/* Ambient glows */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: "80vw", height: "60vh", background: "radial-gradient(ellipse at center, rgba(90,20,160,0.22) 0%, transparent 65%)", filter: "blur(60px)" }} />
          <div style={{ position: "absolute", bottom: 0, left: "15%", width: "50vw", height: "40vh", background: "radial-gradient(ellipse at center, rgba(100,20,180,0.12) 0%, transparent 70%)", filter: "blur(80px)" }} />
          <div style={{ position: "absolute", top: 0, right: "10%", width: "40vw", height: "35vh", background: "radial-gradient(ellipse at center, rgba(80,15,150,0.1) 0%, transparent 70%)", filter: "blur(70px)" }} />
          <div style={{ position: "absolute", inset: "0", background: isIvory ? "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 30%, rgba(248,245,239,0.85) 100%)" : "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 30%, rgba(4,0,14,0.6) 100%)" }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "120px", background: isIvory ? "linear-gradient(to bottom, var(--belvo-bg), transparent)" : "linear-gradient(to bottom, rgba(4,0,14,0.9), transparent)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "140px", background: isIvory ? "linear-gradient(to top, var(--belvo-bg), transparent)" : "linear-gradient(to top, rgba(4,0,14,0.95), transparent)" }} />
        </div>

        {/* Scattered dots */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          {[[120, 160], [310, 80], [490, 220], [680, 100], [870, 250], [1050, 130], [1230, 200], [1380, 90], [200, 700], [450, 760], [700, 680], [950, 750], [1150, 700], [1340, 760]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={i % 3 === 0 ? 1.5 : 1} fill={i % 2 === 0 ? "rgba(200,140,255,0.6)" : isIvory ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.35)"} />
          ))}
        </svg>

        <div style={{ position: "relative", zIndex: 1, maxWidth: "800px" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} style={{ marginBottom: "18px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 18px", background: isIvory ? "rgba(123,47,190,0.08)" : "rgba(123,47,190,0.15)", border: "1px solid rgba(157,78,221,0.3)", borderRadius: "100px", fontFamily: "'Inter',sans-serif", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "#9D4EDD" }}>
              <Sparkles size={11} />
              Our Services
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
            style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: "clamp(2.4rem,6vw,5.5rem)", lineHeight: 1.04, color: "var(--belvo-text-1)", margin: "0 0 10px", letterSpacing: "-0.01em" }}
          >
            Full-Service{" "}
            <span style={{ color: "#9D4EDD" }}>Creative</span>{" "}
            Agency
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
            style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.9rem,1.6vw,1.05rem)", lineHeight: 1.75, color: "var(--belvo-text-2)", margin: "0 auto 36px", maxWidth: "560px", letterSpacing: "0.01em" }}
          >
            From SEO and branding to web development and performance marketing — we offer
            14 specialised services designed to take your brand from zero to dominate.
          </motion.p>
        </div>

      </div>

      {/* ── SERVICES GRID ─────────────────────────────────────────── */}
      <div
        id="services-grid"
        ref={gridRef}
        style={{ padding: "80px 24px 120px", position: "relative", overflow: "hidden", background: "var(--belvo-bg)" }}
      >
        <div style={{ height: "1px", background: "linear-gradient(90deg,transparent,rgba(130,40,200,0.4),rgba(201,163,65,0.18),transparent)", marginBottom: "0" }} />
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "70vw", height: "400px", background: "radial-gradient(ellipse at center, rgba(80,15,140,0.10) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate={gridInView ? "visible" : "hidden"} style={{ textAlign: "center", marginTop: "32px", marginBottom: "48px" }}>
            <h2 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 900, fontSize: "clamp(1.9rem,4.5vw,3.4rem)", lineHeight: 1.06, color: "var(--belvo-text-1)", margin: 0 }}>
              14 Services. <span style={{ color: "#9D4EDD" }}>One Mission.</span>
            </h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "20px" }}>
            {SERVICES.map((svc, i) => (
              <motion.div
                key={svc.id}
                custom={i + 1}
                variants={fadeUp}
                initial="hidden"
                animate={gridInView ? "visible" : "hidden"}
                style={{ background: "var(--belvo-bg-card)", border: "1px solid var(--belvo-border-card)", borderRadius: "14px", padding: "28px", display: "flex", flexDirection: "column", gap: "14px", transition: "border-color 0.3s, box-shadow 0.3s, transform 0.3s", cursor: "default", boxShadow: isIvory ? "0 2px 12px rgba(0,0,0,0.04)" : "none" }}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(157,78,221,0.4)"; (e.currentTarget as HTMLElement).style.boxShadow = isIvory ? "0 8px 32px rgba(100,20,180,0.10)" : "0 8px 40px rgba(100,20,180,0.18)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--belvo-border-card)"; (e.currentTarget as HTMLElement).style.boxShadow = isIvory ? "0 2px 12px rgba(0,0,0,0.04)" : "none"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg,rgba(123,47,190,0.22),rgba(157,78,221,0.08))", border: "1px solid rgba(157,78,221,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#9D4EDD", flexShrink: 0, position: "relative", overflow: "hidden" }}>
                    <img src={SERVICE_IMAGES[i]} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }} />
                    <span style={{ position: "relative", zIndex: 1, fontSize: "0.6rem", fontWeight: 800, color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,0.5)", letterSpacing: "-0.02em" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                    <span style={{ color: "#9D4EDD", display: "flex", flexShrink: 0 }}>{SERVICE_ICONS[i]}</span>
                    <h3 style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "0.97rem", color: "var(--belvo-text-1)", margin: 0, lineHeight: 1.3 }}>
                      {svc.category}
                    </h3>
                  </div>
                </div>

                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.85rem", lineHeight: 1.7, color: "var(--belvo-text-6)", margin: 0, flexGrow: 1 }}>
                  {svc.desc}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
                  {svc.keywords.map((kw) => (
                    <span
                      key={kw}
                      style={{ padding: "4px 10px", background: "rgba(157,78,221,0.08)", border: "1px solid rgba(157,78,221,0.15)", borderRadius: "6px", fontFamily: "'Inter',sans-serif", fontSize: "0.65rem", fontWeight: 500, color: "rgba(157,78,221,0.7)", letterSpacing: "0.02em", whiteSpace: "nowrap" }}
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>


    </section>
  );
}
