import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

const AVATAR_1 = new URL("../Images/testimonial_avatar_1.png", import.meta.url).href;
const AVATAR_2 = new URL("../Images/testimonial_avatar_2.png", import.meta.url).href;
const AVATAR_3 = new URL("../Images/testimonial_avatar_3.png", import.meta.url).href;
const AVATAR_4 = new URL("../Images/testimonial_avatar_4.png", import.meta.url).href;
const AVATAR_5 = new URL("../Images/WhatsApp Image 2026-06-27 at 10.18.03 PM.jpeg", import.meta.url).href;
const AVATAR_6 = new URL("../Images/WhatsApp Image 2026-06-27 at 6.42.56 PM.jpeg", import.meta.url).href;
const AVATAR_7 = new URL("../Images/WhatsApp Image 2026-06-27 at 6.44.30 PM.jpeg", import.meta.url).href;
const AVATAR_9 = new URL("../Images/ChatGPT Image Jun 27, 2026, 07_21_16 PM.png", import.meta.url).href;
const AVATAR_10 = new URL("../Images/ChatGPT Image Jun 27, 2026, 07_45_48 PM.png", import.meta.url).href;

const TESTIMONIALS = [
  { id: 1, image: AVATAR_1, name: "Sunny Jain", title: "Founder / Key Person - Ghar Soaps", text: "BELVO understood exactly what we needed before we could even articulate it. Their team moved fast, asked the right questions, and delivered a product that genuinely reflected our brand. Couldn't have asked for a better partner." },
  { id: 2, image: AVATAR_2, name: "Niharika Kunal Jhunjhunwala", title: "Founder / Key Person - ClayCo Beauty", text: "We'd worked with three agencies before BELVO. The difference was immediate: structured thinking, clear timelines, and no fluff. They treated our product like it was their own, and it showed in the final output." },
  { id: 3, image: AVATAR_3, name: "Prabhkiran Singh", title: "Founder / Key Person - Bewakoof", text: "Our conversion rates improved within the first month of the redesign. BELVO didn't just make things look good - they made them work. The team was attentive, professional, and genuinely easy to collaborate with." },
  { id: 4, image: AVATAR_4, name: "Manas Madhu", title: "Founder / Key Person - Beyond Snacks", text: "I was skeptical going in, but BELVO changed my mind quickly. They pushed back when our ideas weren't quite right, offered smarter alternatives, and the end result was miles ahead of what we initially planned." },
  { id: 5, image: AVATAR_5, name: "Mohammad Raafi Hossain", title: "Founder / Key Person - Fasset", text: "Working with BELVO felt less like hiring a vendor and more like bringing on a team that actually cared. The attention to detail was impressive, and every touchpoint - from onboarding to delivery - was handled well." },
  { id: 6, image: AVATAR_10, name: "Karan Desai", title: "Founder / Key Person - KDAK", text: "We needed a full rebrand and a digital overhaul, and BELVO delivered both without missing a beat. They understood our audience, respected our timelines, and the final outcome has genuinely elevated how people perceive us." },
  { id: 7, image: AVATAR_9, name: "Prathamesh Choudhari", title: "Founder / Key Person - GatePay", text: "BELVO brought a level of craft to our UI that we hadn't seen from any other agency. Every screen felt intentional. They didn't just execute the brief - they elevated it." },
  { id: 8, image: AVATAR_6, name: "Dr. Aman Dua", title: "Founder / Key Person - AK Clinics", text: "From architecture to deployment, BELVO's engineering team was thorough and communicative. They flagged issues before they became problems, suggested better approaches, and delivered clean, maintainable code." },
  { id: 9, image: AVATAR_7, name: "Dr. Devi Prasad Shetty", title: "Founder / Key Person - Narayana One Health", text: "We came to BELVO with a fragmented brand identity and left with something cohesive, confident, and compelling. Their strategic thinking goes far beyond aesthetics - they helped us find our voice and actually use it." },
];

type Testimonial = (typeof TESTIMONIALS)[number];

function TestimonialCard({ testimonial, index, progress }: { testimonial: Testimonial; index: number; progress: MotionValue<number> }) {
  const targetScale = Math.max(0.66, 1 - (TESTIMONIALS.length - index - 1) * 0.045);
  const scale = useTransform(progress, [index * 0.09, 1], [1, targetScale]);

  return (
    <div className="testimonial-stack-slot" style={{ zIndex: index + 1 }}>
      <motion.article className="testimonial-card" style={{ scale, top: `calc(9vh + ${index * 10}px)` }}>
        <div className="avatar-row">
          <div className="avatar-img"><img src={testimonial.image} alt={testimonial.name} /></div>
          <div><div className="author-name">{testimonial.name}</div><div className="author-title">{testimonial.title}</div></div>
        </div>
        <div className="quote-mark">&ldquo;</div>
        <div className="testimonial-text">{testimonial.text}</div>
      </motion.article>
    </div>
  );
}

export default function Testimonials() {
  const stackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { damping: 28, stiffness: 130, mass: 0.35 });

  return (
    <>
      <style>{`
        .testimonial-stack-slot { position: sticky; top: 0; height: 66vh; min-height: 460px; display: flex; justify-content: center; pointer-events: none; }
        .testimonial-card { position: relative; pointer-events: auto; width: min(92vw, 620px); min-height: 300px; padding: clamp(1.25rem, 3vw, 2rem); border-radius: 30px; background: linear-gradient(135deg, rgba(253, 248, 252, 0.98), rgba(208, 235, 255, 0.92)); border: 1px solid rgba(90, 27, 75, 0.3); box-shadow: 0 20px 56px rgba(47, 12, 41, 0.18); display: flex; flex-direction: column; text-align: left; overflow: hidden; color: var(--belvo-text-1); transform-origin: top center; }
        .testimonial-card::after { content: ""; position: absolute; inset: 0; pointer-events: none; background: radial-gradient(circle at top right, rgba(90, 27, 75, 0.24), transparent 34%); }
        .testimonial-card .avatar-row { position: relative; z-index: 1; display: flex; align-items: center; gap: 14px; margin-bottom: 1rem; }
        .testimonial-card .avatar-img { width: 66px; height: 66px; border-radius: 50%; overflow: hidden; flex-shrink: 0; border: 2px solid rgba(8, 37, 113, 0.32); box-shadow: 0 6px 18px rgba(6, 26, 94, 0.15); }
        .testimonial-card .avatar-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .testimonial-card .author-name { font-size: 1.08rem; font-weight: 800; color: #061a5e; letter-spacing: 0.01em; }
        .testimonial-card .author-title { margin-top: 3px; font-size: 0.72rem; color: rgba(6, 26, 94, 0.68); }
        .testimonial-card .quote-mark { position: relative; z-index: 1; font-size: 3.25rem; line-height: 0.8; margin: 0.35rem 0 0.3rem; font-family: Georgia, serif; color: #5a1b4b; opacity: 0.32; }
        .testimonial-card .testimonial-text { position: relative; z-index: 1; font-size: clamp(0.9rem, 1.7vw, 1.04rem); line-height: 1.62; color: rgba(6, 26, 94, 0.87); }
        @media (max-width: 768px) {
          .testimonial-stack-slot { height: 60vh; min-height: 390px; }
          .testimonial-card { width: min(90vw, 500px); min-height: 270px; border-radius: 24px; }
          .testimonial-card .avatar-img { width: 54px; height: 54px; }
          .testimonial-card .author-name { font-size: 0.95rem; }
        }
        @media (max-width: 480px) {
          .testimonial-stack-slot { height: 58vh; min-height: 350px; }
          .testimonial-card { width: 88vw; min-height: 250px; border-radius: 20px; padding: 1rem; }
          .testimonial-card .avatar-row { gap: 10px; margin-bottom: 0.75rem; }
          .testimonial-card .avatar-img { width: 46px; height: 46px; }
          .testimonial-card .author-title { font-size: 0.62rem; }
          .testimonial-card .quote-mark { font-size: 2.5rem; }
        }
      `}</style>
      <section id="testimonials" style={{ background: "var(--belvo-bg)", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, var(--belvo-border-divider), transparent)" }} />
        <div style={{ maxWidth: "1100px", width: "100%", padding: "100px 24px 30px", textAlign: "center", margin: "0 auto" }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(11, 59, 156, 0.72)", marginBottom: "14px" }}>Section 06</p>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "clamp(2rem, 5vw, 3.6rem)", lineHeight: 1.06, color: "var(--belvo-text-1)", margin: "0 0 18px", letterSpacing: "-0.01em", textTransform: "uppercase" }}>
            Client <span style={{ color: "#5a1b4b" }}>Testimonials</span>
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.97rem", lineHeight: 1.7, color: "var(--belvo-text-2)", maxWidth: "520px", margin: "0 auto" }}>
            Real words from the people we've worked with. Scroll down or press the Down arrow to reveal the client card stack.
          </p>
        </div>
        <div ref={stackRef} style={{ position: "relative", paddingBottom: "30vh" }}>
          {TESTIMONIALS.map((testimonial, index) => <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} progress={smoothProgress} />)}
        </div>
        <p style={{ position: "relative", zIndex: 12, margin: "-20vh 0 0", padding: "0 24px 46px", textAlign: "center", fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", letterSpacing: "0.08em", color: "rgba(6, 26, 94, 0.62)" }}>
          Card stack inspired by <a href="https://skiper-ui.com" target="_blank" rel="noreferrer" style={{ color: "#0b3b9c", fontWeight: 700 }}>Skiper UI</a>
        </p>
      </section>
    </>
  );
}
