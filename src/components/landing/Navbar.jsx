import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import BillFlowIcon from "../icons/BillFlowIcon";

// href = in-page scroll target, external = react-router path
const LINKS = [
  { label: "Features", href: "#features" },
  { label: "Solutions", href: "#solutions" },
  { label: "Pricing", href: "#pricing" },
  { label: "Resources", href: "#resources" },
  { label: "Docs", href: "#" }, // no docs page yet — placeholder
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`sticky top-0 z-50 w-full border-b transition-shadow duration-300 ${
        scrolled
          ? "shadow-[0_4px_20px_rgba(15,18,34,0.06)] border-[var(--lp-border)] bg-white/75"
          : "border-transparent bg-white/40"
      } backdrop-blur-xl`}
    >
      <nav className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6 lg:px-10">
        <Link to="/" className="flex items-center gap-2 text-[var(--lp-accent-dark)]">
          <BillFlowIcon size={28} />
          <span className="font-display text-2xl font-semibold tracking-tight text-[var(--lp-ink)]">
            BillFlow
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                i === 0
                  ? "text-[var(--lp-accent)] border-b-2 border-[var(--lp-accent)] pb-1"
                  : "text-[var(--lp-body)] hover:text-[var(--lp-accent)]"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden text-sm font-medium text-[var(--lp-body)] transition-colors hover:text-[var(--lp-accent)] sm:block"
          >
            Login
          </Link>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/register"
              className="block rounded-lg bg-[var(--lp-accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:brightness-110"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </nav>
    </motion.header>
  );
}
