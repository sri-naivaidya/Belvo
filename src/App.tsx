import { Switch, Route, Redirect, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import LoadingScreen from "@/components/LoadingScreen";
import { isAuthenticated as isInternAuthenticated } from "@/lib/intern-auth";
import { isAuthenticated } from "@/lib/admin-api";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import ChatBot from "@/components/ChatBot";
import CursorFollower from "@/components/CursorFollower";
import GrainOverlay from "@/components/GrainOverlay";
import React, { useState, lazy, Suspense } from "react";

const NotFound = lazy(() => import("@/pages/not-found"));
const Home = lazy(() => import("@/pages/Home"));
const Careers = lazy(() => import("@/pages/Careers"));
const Blogs = lazy(() => import("@/pages/Blogs"));
const About = lazy(() => import("@/sections/About"));
const ComingSoon = lazy(() => import("@/pages/ComingSoon"));
const Services = lazy(() => import("@/pages/Services"));
const Events = lazy(() => import("@/pages/Events"));
const EventRegistration = lazy(() => import("@/pages/EventRegistration"));
const Works = lazy(() => import("@/pages/works"));
const Tools = lazy(() => import("@/pages/Tools"));
const ToolRegister = lazy(() => import("@/pages/ToolRegister"));
const AdminLogin = lazy(() => import("@/pages/admin/Login"));
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const InternLogin = lazy(() => import("@/pages/intern/Login"));
const InternDashboard = lazy(() => import("@/pages/intern/Dashboard"));
const InternChecklist = lazy(() => import("@/pages/intern/Checklist"));
const ClientComingSoon = lazy(() => import("@/pages/client/ClientComingSoon"));
const DemoOne = lazy(() => import("@/pages/DemoOne"));
const NotesPDFs = lazy(() => import("@/pages/NotesPDFs"));
const LLMs = lazy(() => import("@/pages/LLMs"));
const Videos = lazy(() => import("@/pages/Videos"));
const TeamStoryPage = lazy(() => import("@/pages/TeamStoryPage"));

const queryClient = new QueryClient();

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.22, ease: "easeIn" as const } },
};

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

function Router() {
  const [location] = useLocation();

  if (location.startsWith("/admin")) {
    return (
      <div
        style={{ background: "var(--belvo-bg)", minHeight: "100dvh", color: "var(--belvo-text-1)" }}
      >
        <Switch>
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin">
            {isAuthenticated() ? <AdminDashboard /> : <Redirect to="/admin/login" />}
          </Route>
        </Switch>
      </div>
    );
  }

  if (location.startsWith("/intern")) {
    return (
      <div
        style={{ background: "#0a0a0f", minHeight: "100dvh", color: "var(--belvo-text-1)" }}
      >
        <Switch>
          <Route path="/intern/login" component={InternLogin} />
          <Route path="/intern/checklist" component={InternChecklist} />
          <Route path="/intern">
            {isInternAuthenticated() ? <InternDashboard /> : <Redirect to="/intern/login" />}
          </Route>
        </Switch>
      </div>
    );
  }

  if (location.startsWith("/client")) {
    return (
      <div
        style={{ background: "#0a0a0f", minHeight: "100dvh", color: "var(--belvo-text-1)" }}
      >
        <Switch>
          <Route path="/client" component={ClientComingSoon} />
        </Switch>
      </div>
    );
  }

  return (
    <div
      className="min-h-[100dvh] flex flex-col"
      style={{ color: "#1a1a1a" }}
    >
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <AnimatedPage key={location}>
            <Suspense fallback={
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                minHeight: "60vh", color: "var(--belvo-text-2)",
                fontFamily: "'Inter', sans-serif", fontSize: "0.85rem",
                letterSpacing: "0.1em", textTransform: "uppercase",
              }}>
                Loading...
              </div>
            }>
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/about" component={About} />
                <Route path="/careers" component={Careers} />
                <Route path="/blogs" component={Blogs} />
                <Route path="/services" component={Services} />
                <Route path="/works" component={Works} />
                <Route path="/tools" component={Tools} />
                <Route path="/tools/register" component={ToolRegister} />
                <Route path="/event-register/:id" component={EventRegistration} />
                <Route path="/events" component={Events} />
                <Route path="/contact">
                  <ComingSoon title="Contact Us" />
                </Route>
                <Route path="/demo" component={DemoOne} />
                <Route path="/notes-pdfs" component={NotesPDFs} />
                <Route path="/llms" component={LLMs} />
                <Route path="/lms" component={LLMs} />
                <Route path="/videos" component={Videos} />
                <Route path="/team-story" component={TeamStoryPage} />
                <Route path="/resources" component={Blogs} />
                <Route component={NotFound} />
              </Switch>
            </Suspense>
          </AnimatedPage>
        </AnimatePresence>
      </main>
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ThemeProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <ScrollToTop />
            <ChatBot />
            <CursorFollower />
            <GrainOverlay opacity={0.02} blend="overlay" />
            <Toaster />
          </ThemeProvider>
        </TooltipProvider>
      </QueryClientProvider>
      <AnimatePresence>
        {showSplash && (
          <LoadingScreen key="splash" onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
