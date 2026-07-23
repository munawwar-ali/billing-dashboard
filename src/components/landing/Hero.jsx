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
      {/* Decorative hero background — grid texture + floating 3D shapes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden bg-cover bg-center bg-no-repeat opacity-20 sm:block"
        style={{ backgroundImage: "url('/images/hero/hero-grid-bg.webp')" }}
      />

      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-[-70px] top-1/3 hidden h-40 w-40 lg:block sm:h-48 sm:w-48 md:h-64 md:w-64"
      >
        <img
          src="/images/hero/hero-abstract-img3.webp"
          alt=""
          className="h-full w-full opacity-90"
        />
      </motion.div>

      <motion.div
        animate={{ y: [0, 16, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute right-[-80px] top-16 hidden h-44 w-44 lg:block sm:h-56 sm:w-56 md:top-24 md:h-80 md:w-80"
      >
        <img
          src="/images/hero/hero-abstract-img1.webp"
          alt=""
          className="h-full w-full opacity-80"
        />
      </motion.div>

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-4 hidden h-16 w-16 -translate-x-1/2 lg:block sm:h-20 sm:w-20 md:top-0 md:h-28 md:w-28"
      >
        <img
          src="/images/hero/hero-abstract-img2.webp"
          alt=""
          className="h-full w-full opacity-80"
        />
      </motion.div>

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
