import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import Footer from "@/sections/Footer";

const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: easeOut },
  }),
};

const sections = [
  {
    title: "Welcome to Belvo",
    content: "At Belvo, we are redefining the modern workplace for the next generation. We believe that great ideas come from collaboration, curiosity, and a culture where everyone has the opportunity to grow.\n\nOur workplace is built for Gen Z professionals who value innovation, flexibility, learning, and meaningful work.",
  },
  {
    title: "A Friendly & Inclusive Ecosystem",
    content: "Belvo is more than a workplace—it's a community.\n\nWe foster a friendly environment where every individual feels respected, heard, and empowered. Whether you're an intern, developer, designer, marketer, or leader, your ideas matter.",
  },
  {
    title: "Collaboration Without Limits",
    content: "We encourage cross-functional teamwork and open communication.\n\nEveryone gets the opportunity to:\n\n• Share ideas freely\n• Work on exciting projects\n• Learn from experienced mentors\n• Collaborate across different teams\n• Build real-world skills",
  },
  {
    title: "Growth & Career Opportunities",
    content: "Your growth is our priority.\n\nAt Belvo, you'll have opportunities to:\n\n• Learn new technologies\n• Upskill with AI tools\n• Take ownership of projects\n• Build leadership skills\n• Advance your career through continuous learning",
  },
  {
    title: "Our Digital Workspace",
    content: "We use modern tools to make work faster, smarter, and more collaborative.\n\nCommunication: Microsoft Teams, Slack, Bitrix24\n\nProductivity: Microsoft 365, Google Workspace, Notion\n\nProject Management: Asana, Trello\n\nAI-Powered Work: ChatGPT, Claude AI, Perplexity AI, Gemini, GitHub Copilot\n\nCRM & Business Operations: Salesforce",
  },
  {
    title: "AI-First Culture",
    content: "We embrace artificial intelligence to improve productivity, creativity, and problem-solving.\n\nOur teams leverage AI to:\n\n• Research faster\n• Generate ideas\n• Automate repetitive tasks\n• Write better documentation\n• Improve development workflows\n• Make smarter business decisions",
  },
  {
    title: "Why Belvo?",
    content: "• Friendly work culture\n• Gen Z–focused environment\n• Equal opportunities for everyone\n• Modern collaboration tools\n• AI-powered productivity\n• Continuous learning\n• Career growth\n• Innovation-driven mindset",
  },
];

export default function TeamStoryPage() {
  return (
    <>
      <SEO title="Team Story" description="Meet the people behind Belvo — our team's journey, culture, and the stories that define us." path="/team-story" />
      <section
        style={{
          background: "var(--belvo-bg)",
          minHeight: "100vh",
          padding: "120px 24px",
          position: "relative",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <motion.p
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.68rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "rgba(157,78,221,0.6)",
              marginBottom: 14,
            }}
          >
            Team Story
          </motion.p>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(2rem, 5vw, 3.8rem)",
              lineHeight: 1.08,
              color: "var(--belvo-text-1)",
              margin: "0 0 64px",
              letterSpacing: "-0.02em",
            }}
          >
            Belvo – The Gen Z Workplace
          </motion.h1>

          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              custom={i + 2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              style={{ marginBottom: i < sections.length - 1 ? 64 : 0 }}
            >
              <h2
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
                  color: "#9D4EDD",
                  margin: "0 0 16px",
                  letterSpacing: "-0.02em",
                }}
              >
                {section.title}
              </h2>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "1rem",
                  lineHeight: 1.8,
                  color: "var(--belvo-text-2)",
                  whiteSpace: "pre-line",
                }}
              >
                {section.content}
              </div>
            </motion.div>
          ))}

          <motion.div
            custom={sections.length + 2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={{
              marginTop: 80,
              textAlign: "center",
              padding: "48px 32px",
              background: "var(--belvo-bg-card)",
              border: "1px solid var(--belvo-border-card)",
              borderRadius: 16,
            }}
          >
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: "1.5rem",
              color: "var(--belvo-text-1)",
              margin: "0 0 8px",
            }}>
              Belvo
            </p>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "1rem",
              color: "var(--belvo-text-2)",
              margin: "0 0 4px",
            }}>
              Collaborate. Innovate. Grow Together.
            </p>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.9rem",
              color: "#9D4EDD",
              margin: 0,
            }}>
              The workplace where Gen Z builds the future.
            </p>
          </motion.div>
        </div>
      </section>
      <Footer />
    </>
  );
}