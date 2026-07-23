import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { SERVICES as SERVICE_ITEMS, type ServiceItem } from "@/content/services";
import { useTheme } from "@/contexts/ThemeContext";

interface Props {
  id: string;
}

const ACCENT = "#9D4EDD";
const FADE_OPACITY = 0.28;
const STICKY_TOP = 120;
const IMAGE_HEIGHT = 650;

function markImageLoaded(img: HTMLImageElement | null) {
  if (img?.complete) img.classList.add("loaded");
}

function handleImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.classList.add("loaded");
}

function ServiceImageCard({
  service,
  index,
  active,
  isIvory,
  isDesktop,
  imageTransition,
  textTransition,
  prefersReducedMotion,
}: {
  service: ServiceItem;
  index: number;
  active: boolean;
  isIvory: boolean;
  isDesktop: boolean;
  imageTransition: { duration: number; ease?: readonly [number, number, number, number] };
  textTransition: { duration: number; ease?: readonly [number, number, number, number] };
  prefersReducedMotion: boolean | null;
}) {
  return (
    <motion.div
      animate={{
        opacity: active ? 1 : FADE_OPACITY,
        scale: active ? 1 : 0.98,
      }}
      transition={imageTransition}
      style={{
        position: "relative",
        height: isDesktop ? IMAGE_HEIGHT : undefined,
        aspectRatio: isDesktop ? undefined : "16 / 10",
        borderRadius: 28,
        overflow: "hidden",
        border: "1px solid var(--belvo-border-card)",
        background: "var(--belvo-bg-card)",
        boxShadow: isIvory
          ? "0 24px 64px rgba(0, 0, 0, 0.1)"
          : "0 24px 80px rgba(0, 0, 0, 0.38)",
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
          opacity: 1,
        }}
      />

      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: isIvory
            ? "radial-gradient(ellipse at 50% 30%, rgba(157,78,221,0.12) 0%, transparent 55%)"
            : "radial-gradient(ellipse at 50% 30%, rgba(157,78,221,0.22) 0%, transparent 55%)",
          pointerEvents: "none",
        }}
      />

      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: isIvory
            ? "linear-gradient(to top, rgba(248,245,239,0.55) 0%, transparent 38%)"
            : "linear-gradient(to top, rgba(4,0,14,0.55) 0%, transparent 38%)",
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: active ? 1 : FADE_OPACITY, y: 0 }}
        transition={textTransition}
        style={{
          position: "absolute",
          left: 24,
          right: 24,
          bottom: 24,
          padding: "14px 18px",
          borderRadius: 16,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          background: isIvory
            ? "rgba(255,255,255,0.72)"
            : "rgba(12,6,24,0.72)",
          border: "1px solid rgba(157,78,221,0.22)",
        }}
      >
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: ACCENT,
            marginBottom: 4,
          }}
        >
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(SERVICE_ITEMS.length).padStart(2, "0")}
        </div>
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "1.05rem",
            fontWeight: 800,
            color: "var(--belvo-text-1)",
            letterSpacing: "-0.02em",
          }}
        >
          {service.title}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ServicesSection({ id }: Props) {
  const { theme } = useTheme();
  const isIvory = theme === "ivory";
  const prefersReducedMotion = useReducedMotion();

  const [activeService, setActiveService] = useState(0);
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 1024
  );

  const serviceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ratiosRef = useRef<number[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsDesktop(e.matches);
    onChange(mq);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const pickActive = useCallback(() => {
    const ratios = ratiosRef.current;
    let bestIndex = 0;
    let bestRatio = -1;

    ratios.forEach((ratio, index) => {
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestIndex = index;
      }
    });

    if (bestRatio > 0) {
      setActiveService(bestIndex);
    }
  }, []);

  useEffect(() => {
    ratiosRef.current = new Array(SERVICE_ITEMS.length).fill(0);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));
          if (!Number.isNaN(index)) {
            ratiosRef.current[index] = entry.intersectionRatio;
          }
        });
        pickActive();
      },
      {
        threshold: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1],
        rootMargin: "-18% 0px -18% 0px",
      }
    );

    serviceRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pickActive]);

  const imageTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const };

  const textTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <section
      id={id}
      style={{
        position: "relative",
        background: "var(--belvo-bg)",
        padding: isDesktop ? "120px 24px 140px" : "80px 20px 100px",
        overflow: "hidden",
      }}
    >
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
            top: "12%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(90vw, 900px)",
            height: "min(70vh, 620px)",
            background: isIvory
              ? "radial-gradient(ellipse at center, rgba(157,78,221,0.1) 0%, transparent 68%)"
              : "radial-gradient(ellipse at center, rgba(157,78,221,0.16) 0%, transparent 68%)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "8%",
            right: "-5%",
            width: "42vw",
            height: "42vw",
            maxWidth: 480,
            maxHeight: 480,
            background: isIvory
              ? "radial-gradient(circle, rgba(123,47,190,0.08) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(123,47,190,0.14) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1320,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: isDesktop ? 90 : 56,
          }}
        >
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 18px",
                borderRadius: 999,
                background: isIvory
                  ? "rgba(157,78,221,0.08)"
                  : "rgba(157,78,221,0.14)",
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
          </motion.div>

          <motion.h2
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(2.4rem, 6vw, 4.8rem)",
              lineHeight: 1.05,
              marginTop: 26,
              marginBottom: 22,
              color: "var(--belvo-text-1)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
            }}
          >
            Everything Your
            <span style={{ color: ACCENT }}> Business Needs</span>
          </motion.h2>

          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            style={{
              maxWidth: 720,
              margin: "0 auto",
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(0.95rem, 2vw, 1.05rem)",
              lineHeight: 1.8,
              color: "var(--belvo-text-2)",
            }}
          >
            From branding and SEO to software development and performance
            marketing, we provide complete digital solutions that help
            businesses grow faster.
          </motion.p>
        </div>

        {/* Progress rail — sticky between columns on desktop */}
        {isDesktop && (
          <div
            aria-hidden
            style={{
              position: "sticky",
              top: "50%",
              height: 0,
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                right: 556,
                transform: "translateY(-50%)",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {SERVICE_ITEMS.map((_, index) => (
                <motion.div
                  key={index}
                  animate={{
                    height: index === activeService ? 28 : 8,
                    opacity: index === activeService ? 1 : 0.35,
                    background:
                      index === activeService
                        ? ACCENT
                        : isIvory
                          ? "rgba(157,78,221,0.25)"
                          : "rgba(157,78,221,0.35)",
                  }}
                  transition={textTransition}
                  style={{
                    width: 3,
                    borderRadius: 999,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* One row per service: text left, image right */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {SERVICE_ITEMS.map((service, index) => {
            const active = index === activeService;

            return (
              <div
                key={service.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: isDesktop ? "minmax(0, 1fr) 520px" : "1fr",
                  gap: isDesktop ? 90 : 0,
                  minHeight: isDesktop ? "80vh" : "auto",
                  alignItems: "center",
                  paddingBottom: isDesktop ? 0 : 72,
                }}
              >
                {/* Left — service text */}
                <div
                  ref={(el) => {
                    serviceRefs.current[index] = el;
                  }}
                  data-index={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    paddingRight: isDesktop ? 24 : 0,
                  }}
                >
                  <motion.span
                    animate={{ opacity: active ? 1 : FADE_OPACITY }}
                    transition={textTransition}
                    style={{
                      color: ACCENT,
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 700,
                      letterSpacing: "0.2em",
                      fontSize: "0.78rem",
                      marginBottom: 16,
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </motion.span>

                  <motion.h3
                    animate={{ opacity: active ? 1 : FADE_OPACITY }}
                    transition={textTransition}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "clamp(2rem, 4vw, 4.2rem)",
                      lineHeight: 1.06,
                      margin: 0,
                      color: "var(--belvo-text-1)",
                      fontWeight: 900,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {service.title}
                  </motion.h3>

                  <motion.p
                    animate={{ opacity: active ? 1 : FADE_OPACITY * 1.15 }}
                    transition={textTransition}
                    style={{
                      marginTop: 24,
                      maxWidth: 520,
                      fontFamily: "'Inter', sans-serif",
                      color: "var(--belvo-text-2)",
                      lineHeight: 1.85,
                      fontSize: "clamp(0.95rem, 1.8vw, 1.05rem)",
                    }}
                  >
                    {service.desc}
                  </motion.p>

                  <motion.div
                    animate={{ opacity: active ? 1 : FADE_OPACITY }}
                    transition={textTransition}
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 10,
                      marginTop: 30,
                    }}
                  >
                    {service.keywords.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          padding: "8px 16px",
                          borderRadius: 999,
                          fontFamily: "'Inter', sans-serif",
                          background: isIvory
                            ? "rgba(157,78,221,0.08)"
                            : "rgba(157,78,221,0.12)",
                          color: ACCENT,
                          border: "1px solid rgba(157,78,221,0.25)",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </motion.div>
                </div>

                {/* Right — this service's own image */}
                <div
                  style={{
                    position: isDesktop ? "sticky" : "relative",
                    top: isDesktop ? STICKY_TOP : undefined,
                    alignSelf: isDesktop ? "start" : "stretch",
                    marginTop: isDesktop ? 0 : 28,
                  }}
                >
                  <ServiceImageCard
                    service={service}
                    index={index}
                    active={active}
                    isIvory={isIvory}
                    isDesktop={isDesktop}
                    imageTransition={imageTransition}
                    textTransition={textTransition}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
