import React from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Works", href: "/works" },
  { name: "Careers", href: "/careers" },
  { name: "Blogs", href: "/blogs" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(4, 0, 14, 0.6)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div
        className="max-w-[1400px] mx-auto px-6 lg:px-10 h-[68px] flex items-center justify-between"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5" data-testid="link-logo">
          <img
            src="/belvo-logo-transparent.png"
            alt="BELVO"
            className="h-8 w-auto"
          />
          <span
            className="text-white font-semibold text-lg tracking-widest"
            style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.18em" }}
          >
            BELVO
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-9">
          {NAV_LINKS.map((link) => {
            const isActive = location === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                data-testid={`link-desktop-${link.name.toLowerCase()}`}
                className="relative group flex flex-col items-center"
              >
                <span
                  className="text-xs font-medium tracking-[0.16em] uppercase transition-colors duration-200"
                  style={{ color: isActive ? "#ffffff" : "rgba(255,255,255,0.55)" }}
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

        {/* CTA — pill button */}
        <div className="hidden lg:block">
          <Link
            href="/contact"
            data-testid="button-desktop-contact"
            className="group inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold tracking-[0.18em] uppercase transition-all duration-300"
            style={{
              border: "1px solid rgba(255,255,255,0.35)",
              borderRadius: "100px",
              color: "rgba(255,255,255,0.85)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(130,40,200,0.8)";
              (e.currentTarget as HTMLElement).style.color = "#ffffff";
              (e.currentTarget as HTMLElement).style.background = "rgba(130,40,200,0.15)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.35)";
              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)";
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            Book A Free Call
            <ArrowUpRight size={13} />
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className="lg:hidden p-2 text-white relative z-50"
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

        {/* Mobile overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 flex flex-col items-center justify-center"
              style={{ background: "rgba(4, 0, 14, 0.97)", backdropFilter: "blur(24px)" }}
            >
              <div className="flex flex-col items-center gap-9">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.07 + 0.05 }}
                  >
                    <Link
                      href={link.href}
                      data-testid={`link-mobile-${link.name.toLowerCase()}`}
                      className="text-3xl font-light tracking-[0.2em] uppercase"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        color: location === link.href ? "#9D4EDD" : "rgba(255,255,255,0.8)",
                      }}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link
                    href="/contact"
                    data-testid="button-mobile-contact"
                    className="inline-flex items-center gap-2 px-8 py-3 text-sm font-medium tracking-[0.18em] uppercase"
                    style={{
                      border: "1px solid rgba(130,40,200,0.7)",
                      borderRadius: "100px",
                      color: "#9D4EDD",
                    }}
                  >
                    Book A Free Call <ArrowUpRight size={14} />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
