import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring, useTransform, useReducedMotion, type MotionValue } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { SERVICES as SERVICE_ITEMS, type ServiceItem } from "@/content/services";
import { useTheme } from "@/contexts/ThemeContext";

interface Props {
  id: string;
  onServiceClick?: (service: ServiceItem) => void;
}

const ACCENT = "#9D4EDD";
const IMAGE_HEIGHT = 620;

function markImageLoaded(img: HTMLImageElement | null) {
  if (img?.complete) img.classList.add("loaded");
}

function handleImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.classList.add("loaded");
}

function FeatureTextCard({
  service,
  index,
  total,
  smoothProgress,
  isIvory,
  onServiceClick,
}: {
  service: ServiceItem;
  index: number;
  total: number;
  smoothProgress: MotionValue<number>;
  isIvory: boolean;
  onServiceClick?: (service: ServiceItem) => void;
}) {
  const step = 1 / total;
  const start = index * step;
  const peakStart = start + step * 0.2;
  const peakEnd = (index + 1) * step - step * 0.2;
  const end = (index + 1) * step;

  const range =
    index === 0
      ? [0, 0, peakEnd, end]
      : index === total - 1
      ? [start, peakStart, 1, 1]
      : [start, peakStart, peakEnd, end];

  const opacityOutput =
    index === 0
      ? [1, 1, 1, 0]
      : index === total - 1
      ? [0, 1, 1, 1]
      : [0, 1, 1, 0];

  const yOutput =
    index === 0
      ? [0, 0, 0, -36]
      : index === total - 1
      ? [36, 0, 0, 0]
      : [36, 0, 0, -36];

  const opacity = useTransform(smoothProgress, range, opacityOutput);
  const y = useTransform(smoothProgress, range, yOutput);
  const pointerEvents = useTransform(opacity, (o) => (o > 0.5 ? "auto" : "none"));

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingRight: 32,
        opacity,
        y,
        pointerEvents,
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            borderRadius: 999,
            background: isIvory ? "rgba(157,78,221,0.08)" : "rgba(157,78,221,0.14)",
            border: "1px solid rgba(157,78,221,0.25)",
            color: ACCENT,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: "0.72rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      <h3
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "clamp(2rem, 3.8vw, 4rem)",
          lineHeight: 1.06,
          margin: 0,
          color: "var(--belvo-text-1)",
          fontWeight: 900,
          letterSpacing: "-0.03em",
        }}
      >
        {service.title}
      </h3>

      <p
        style={{
          marginTop: 22,
          maxWidth: 500,
          fontFamily: "'Inter', sans-serif",
          color: "var(--belvo-text-2)",
          lineHeight: 1.8,
          fontSize: "clamp(0.95rem, 1.6vw, 1.05rem)",
        }}
      >
        {service.desc}
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          marginTop: 28,
        }}
      >
        {service.keywords.map((tag) => (
          <span
            key={tag}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              fontFamily: "'Inter', sans-serif",
              background: isIvory ? "rgba(157,78,221,0.08)" : "rgba(157,78,221,0.12)",
              color: ACCENT,
              border: "1px solid rgba(157,78,221,0.25)",
              fontSize: "0.78rem",
              fontWeight: 600,
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {onServiceClick && (
        <div style={{ marginTop: 32 }}>
          <button
            onClick={() => onServiceClick(service)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 26px",
              borderRadius: 10,
              border: "1px solid rgba(157,78,221,0.35)",
              background: isIvory ? "rgba(157,78,221,0.06)" : "rgba(157,78,221,0.14)",
              color: "var(--belvo-text-1)",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(157,78,221,0.15)",
              transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = ACCENT;
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(157,78,221,0.3)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(157,78,221,0.35)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(157,78,221,0.15)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Explore Service <ArrowUpRight size={15} />
          </button>
        </div>
      )}
    </motion.div>
  );
}

function FeatureImageCard({
  service,
  index,
  total,
  smoothProgress,
  isIvory,
}: {
  service: ServiceItem;
  index: number;
  total: number;
  smoothProgress: MotionValue<number>;
  isIvory: boolean;
}) {
  const step = 1 / total;
  const start = index * step;
  const peakStart = start + step * 0.2;
  const peakEnd = (index + 1) * step - step * 0.2;
  const end = (index + 1) * step;

  const range =
    index === 0
      ? [0, 0, peakEnd, end]
      : index === total - 1
      ? [start, peakStart, 1, 1]
      : [start, peakStart, peakEnd, end];

  const opacityOutput =
    index === 0
      ? [1, 1, 1, 0]
      : index === total - 1
      ? [0, 1, 1, 1]
      : [0, 1, 1, 0];

  const scaleOutput =
    index === 0
      ? [1, 1, 1, 0.96]
      : index === total - 1
      ? [0.95, 1, 1, 1]
      : [0.95, 1, 1, 0.96];

  const opacity = useTransform(smoothProgress, range, opacityOutput);
  const scale = useTransform(smoothProgress, range, scaleOutput);

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        scale,
        borderRadius: 24,
        overflow: "hidden",
        border: "1px solid var(--belvo-border-card)",
        background: "var(--belvo-bg-card)",
        boxShadow: isIvory
          ? "0 20px 60px rgba(0, 0, 0, 0.08)"
          : "0 24px 80px rgba(0, 0, 0, 0.42)",
      }}
    >
      <img
        ref={markImageLoaded}
        src={service.image}
        alt={service.title}
        loading={index <= 1 ? "eager" : "lazy"}
        onLoad={handleImageLoad}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />

      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: isIvory
            ? "radial-gradient(ellipse at 50% 30%, rgba(157,78,221,0.1) 0%, transparent 60%)"
            : "radial-gradient(ellipse at 50% 30%, rgba(157,78,221,0.2) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: isIvory
            ? "linear-gradient(to top, rgba(248,245,239,0.6) 0%, transparent 40%)"
            : "linear-gradient(to top, rgba(4,0,14,0.6) 0%, transparent 40%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 20,
          right: 20,
          bottom: 20,
          padding: "12px 16px",
          borderRadius: 14,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          background: isIvory ? "rgba(255,255,255,0.75)" : "rgba(12,6,24,0.75)",
          border: "1px solid rgba(157,78,221,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.95rem",
            fontWeight: 800,
            color: "var(--belvo-text-1)",
          }}
        >
          {service.title}
        </span>
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.15em",
            color: ACCENT,
          }}
        >
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>
    </motion.div>
  );
}

function ProgressDot({
  index,
  total,
  smoothProgress,
  isIvory,
}: {
  index: number;
  total: number;
  smoothProgress: MotionValue<number>;
  isIvory: boolean;
}) {
  const step = 1 / total;
  const start = index * step;
  const mid = (index + 0.5) * step;
  const end = (index + 1) * step;

  const height = useTransform(smoothProgress, [start, mid, end], [8, 26, 8]);
  const opacity = useTransform(smoothProgress, [start, mid, end], [0.35, 1, 0.35]);

  return (
    <motion.div
      style={{
        width: 4,
        height,
        opacity,
        borderRadius: 999,
        background: isIvory ? "rgba(157,78,221,0.8)" : ACCENT,
      }}
    />
  );
}

export default function ServicesSection({ id, onServiceClick }: Props) {
  const { theme } = useTheme();
  const isIvory = theme === "ivory";
  const prefersReducedMotion = useReducedMotion();

  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 1024
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsDesktop(e.matches);
    onChange(mq);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.0001,
  });

  const total = SERVICE_ITEMS.length;

  return (
    <section
      id={id}
      style={{
        position: "relative",
        background: "var(--belvo-bg)",
      }}
    >
      {/* Background radial ambient glows */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "15%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(90vw, 900px)",
            height: "min(70vh, 620px)",
            background: isIvory
              ? "radial-gradient(ellipse at center, rgba(157,78,221,0.08) 0%, transparent 68%)"
              : "radial-gradient(ellipse at center, rgba(157,78,221,0.15) 0%, transparent 68%)",
            filter: "blur(50px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "-5%",
            width: "40vw",
            height: "40vw",
            maxWidth: 480,
            maxHeight: 480,
            background: isIvory
              ? "radial-gradient(circle, rgba(123,47,190,0.06) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(123,47,190,0.12) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {isDesktop && !prefersReducedMotion ? (
        /* Pinned Scroll Track Container (Height = (Total + 1) * 100vh) */
        <div
          ref={containerRef}
          style={{
            position: "relative",
            height: `${(total + 1) * 100}vh`,
          }}
        >
          {/* Sticky Viewport Container */}
          <div
            style={{
              position: "sticky",
              top: 0,
              height: "100vh",
              width: "100%",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              zIndex: 10,
            }}
          >
            {/* Top Scrubbed Progress Line */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: isIvory ? "rgba(157,78,221,0.15)" : "rgba(157,78,221,0.2)",
                zIndex: 30,
              }}
            >
              <motion.div
                style={{
                  height: "100%",
                  background: ACCENT,
                  scaleX: smoothProgress,
                  transformOrigin: "left center",
                  boxShadow: "0 0 10px #9D4EDD",
                }}
              />
            </div>

            {/* Inner Content Grid */}
            <div
              style={{
                position: "relative",
                maxWidth: 1320,
                width: "100%",
                margin: "0 auto",
                padding: "0 24px",
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) 520px",
                gap: 80,
                alignItems: "center",
              }}
            >
              {/* Left Column — Pinned Feature Text Cards */}
              <div
                style={{
                  position: "relative",
                  height: 480,
                  width: "100%",
                }}
              >
                {SERVICE_ITEMS.map((service, index) => (
                  <FeatureTextCard
                    key={service.id}
                    service={service}
                    index={index}
                    total={total}
                    smoothProgress={smoothProgress}
                    isIvory={isIvory}
                    onServiceClick={onServiceClick}
                  />
                ))}
              </div>

              {/* Right Column — Pinned Product Mockup Stack */}
              <div
                style={{
                  position: "relative",
                  height: IMAGE_HEIGHT,
                  width: 520,
                }}
              >
                {/* Step Dots Rail */}
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    left: -36,
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    zIndex: 25,
                  }}
                >
                  {SERVICE_ITEMS.map((_, index) => (
                    <ProgressDot
                      key={index}
                      index={index}
                      total={total}
                      smoothProgress={smoothProgress}
                      isIvory={isIvory}
                    />
                  ))}
                </div>

                {/* Stack of Feature Images */}
                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                  {SERVICE_ITEMS.map((service, index) => (
                    <FeatureImageCard
                      key={service.id}
                      service={service}
                      index={index}
                      total={total}
                      smoothProgress={smoothProgress}
                      isIvory={isIvory}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Mobile / Tablet / Reduced Motion Fallback Layout */
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "80px 20px 100px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 18px",
                borderRadius: 999,
                background: isIvory ? "rgba(157,78,221,0.08)" : "rgba(157,78,221,0.14)",
                border: "1px solid rgba(157,78,221,0.25)",
                color: ACCENT,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "0.72rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              <Sparkles size={12} />
              Our Services
            </span>

            <h2
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(2.2rem, 5vw, 4rem)",
                lineHeight: 1.08,
                marginTop: 22,
                marginBottom: 18,
                color: "var(--belvo-text-1)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
              }}
            >
              Everything Your <span style={{ color: ACCENT }}>Business Needs</span>
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 64 }}>
            {SERVICE_ITEMS.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingBottom: 24,
                }}
              >
                <span
                  style={{
                    color: ACCENT,
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    fontSize: "0.78rem",
                    marginBottom: 12,
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                    lineHeight: 1.1,
                    margin: 0,
                    color: "var(--belvo-text-1)",
                    fontWeight: 900,
                  }}
                >
                  {service.title}
                </h3>

                <p
                  style={{
                    marginTop: 16,
                    fontFamily: "'Inter', sans-serif",
                    color: "var(--belvo-text-2)",
                    lineHeight: 1.75,
                    fontSize: "0.95rem",
                  }}
                >
                  {service.desc}
                </p>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    marginTop: 20,
                  }}
                >
                  {service.keywords.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 999,
                        fontFamily: "'Inter', sans-serif",
                        background: isIvory
                          ? "rgba(157,78,221,0.08)"
                          : "rgba(157,78,221,0.12)",
                        color: ACCENT,
                        border: "1px solid rgba(157,78,221,0.2)",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {onServiceClick && (
                  <div style={{ marginTop: 20 }}>
                    <button
                      onClick={() => onServiceClick(service)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "10px 18px",
                        borderRadius: 8,
                        border: "1px solid rgba(157,78,221,0.3)",
                        background: isIvory
                          ? "rgba(157,78,221,0.05)"
                          : "rgba(157,78,221,0.1)",
                        color: "var(--belvo-text-1)",
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        cursor: "pointer",
                      }}
                    >
                      Explore Service <ArrowUpRight size={12} />
                    </button>
                  </div>
                )}

                <div
                  style={{
                    marginTop: 28,
                    borderRadius: 20,
                    overflow: "hidden",
                    border: "1px solid var(--belvo-border-card)",
                    aspectRatio: "16 / 10",
                  }}
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
