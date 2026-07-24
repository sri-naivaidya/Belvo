import React from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { name: "Home",     href: "/" },
  { name: "About",    href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Works",    href: "/works" },
  { name: "Events",   href: "/events" },
  { name: "Careers",  href: "/careers" },
  { name: "Resources", href: "/resources" },
];

export default function Navbar() {
  const [location, navigate] = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState("");

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    setIsOpen(false);
  }, [location]);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleBookCall = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
    navigate("/");
  };

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    if (location === href) {
      window.scrollTo(0, 0);
    } else {
      navigate(href);
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location === "/") {
      window.scrollTo(0, 0);
    } else {
      navigate("/");
    }
  };

  const navBg = scrolled
    ? "rgba(4,0,14,0.88)"
    : "var(--belvo-bg-nav)";

  const isLinkActive = (href: string) => location === href;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: navBg,
        backdropFilter: "blur(22px)",
        WebkitBackdropFilter: "blur(22px)",
        boxShadow: scrolled
          ? "0 1px 0 rgba(130,40,200,0.12), 0 4px 24px rgba(4,0,14,0.5)"
          : "none",
        transition: "background 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      <div className="max-w-[1180px] mx-auto px-4 lg:px-6 h-[68px] flex items-center justify-between">

        <Link href="/" onClick={handleLogoClick} className="flex items-center gap-2.5" data-testid="link-logo">
          <img
            src="/belvo-logo-transparent.png" alt="BELVO" className="h-8 w-auto"
            style={{ filter: "drop-shadow(0 0 4px rgba(157,78,221,0.4))" }}
          />
          <span
            className="font-semibold text-lg tracking-widest"
            style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.18em", color: "var(--belvo-text-1)" }}
          >
            BELVO
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) => {
            const isActive = isLinkActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                data-testid={`link-desktop-${link.name.toLowerCase()}`}
                className="relative group flex flex-col items-center"
              >
                <span
                  className="text-xs font-medium tracking-[0.16em] uppercase"
                  style={{
                    color: isActive ? "var(--belvo-text-1)" : "var(--belvo-text-2)",
                    transition: "color 0.2s",
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--belvo-text-1)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = isActive ? "var(--belvo-text-1)" : "var(--belvo-text-2)"; }}
                >
                  {link.name}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full"
                    style={{ background: "#7B2FBE" }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <motion.button
            onClick={handleBookCall}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            data-testid="button-desktop-contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold tracking-[0.18em] uppercase"
            style={{
              border: `1px solid var(--belvo-border-nav)`,
              borderRadius: "100px",
              color: "var(--belvo-text-1)",
              background: "transparent",
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              transition: "border-color 0.25s, background 0.25s, color 0.25s",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(130,40,200,0.8)";
              el.style.background = "rgba(130,40,200,0.12)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "var(--belvo-border-nav)";
              el.style.background = "transparent";
            }}
          >
            Book A Free Call
            <ArrowDownLeft size={15} />
          </motion.button>
        </div>

        <button
          className="lg:hidden p-2 relative z-50"
          style={{ color: "var(--belvo-text-1)" }}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          data-testid="button-mobile-menu-toggle"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isOpen ? "close" : "open"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </motion.span>
          </AnimatePresence>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="fixed inset-0 z-40 flex flex-col items-center justify-center"
              style={{ background: "var(--belvo-bg)" }}
            >
              <div className="flex flex-col items-center gap-9">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.06 + 0.04 }}
                  >
                    <Link
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      data-testid={`link-mobile-${link.name.toLowerCase()}`}
                      className="text-3xl font-light tracking-[0.2em] uppercase"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        color: isLinkActive(link.href) ? "#9D4EDD" : "var(--belvo-text-1)",
                        opacity: isLinkActive(link.href) ? 1 : 0.8,
                      }}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.58 }}
                >
                  <button
                    onClick={handleBookCall}
                    data-testid="button-mobile-contact"
                    className="inline-flex items-center gap-2 px-8 py-3 text-sm font-medium tracking-[0.18em] uppercase"
                    style={{
                      border: "1px solid rgba(130,40,200,0.7)",
                      borderRadius: "100px",
                      color: "#9D4EDD",
                      background: "transparent",
                      cursor: "pointer",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Book A Free Call <ArrowDownLeft size={15} />
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
