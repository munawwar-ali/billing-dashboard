import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkle, ArrowRight } from "lucide-react";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[calc(100vh-4rem)] scroll-mt-24 items-center justify-center overflow-hidden px-6 py-20"
    >
      {/* Ambient background — subtle brand blobs + faint grid, no video */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[10%] top-[-10%] h-[480px] w-[480px] rounded-full bg-[#7C3AED]/15 blur-[110px]"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[8%] top-[10%] h-[420px] w-[420px] rounded-full bg-[#8B5CF6]/15 blur-[110px]"
        />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(var(--lp-border) 1px, transparent 1px), linear-gradient(90deg, var(--lp-border) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 60% 60% at 50% 30%, black, transparent)",
          }}
        />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-4xl text-center"
      >
        <motion.div
          variants={item}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--lp-border)] bg-[var(--lp-bg-alt)] px-3 py-1 text-xs font-semibold text-[var(--lp-accent-dark)]"
        >
          <Sparkle size={14} />
          Now supporting hybrid meter billing
        </motion.div>

        <motion.h1
          variants={item}
          className="font-display text-[44px] font-semibold leading-[1.08] tracking-tight text-[var(--lp-ink)] sm:text-[64px] md:text-[80px]"
        >
          Automate billing before it becomes a{" "}
          <span className="text-[var(--lp-accent)]">bottleneck.</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mx-auto mb-10 mt-6 max-w-2xl text-lg leading-relaxed text-[var(--lp-body)]"
        >
          Track API usage, manage tenants, generate invoices, and scale SaaS
          revenue from a single platform designed for massive throughput.
        </motion.p>

        <motion.div
          variants={item}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/register"
              className="flex items-center gap-2 rounded-xl bg-[var(--lp-accent)] px-8 py-4 text-sm font-semibold text-white shadow-lg hover:brightness-110"
            >
              Start Free Trial
              <ArrowRight size={16} />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <a
              href="#features"
              className="block rounded-xl border border-[var(--lp-border)] bg-white/60 px-8 py-4 text-sm font-semibold text-[var(--lp-ink)] hover:bg-white"
            >
              View Demo
            </a>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}