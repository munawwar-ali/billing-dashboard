import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function FinalCTA() {
  return (
    <section id="solutions" className="scroll-mt-24 px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[40px] bg-[var(--lp-navy)] p-12 text-center md:p-24"
      >
        <div className="pointer-events-none absolute inset-0 bg-[var(--lp-accent)]/5" />
        <div className="relative z-10 mx-auto max-w-2xl">
          <h2 className="font-display text-4xl font-semibold text-white sm:text-[56px]">
            Ready to scale your SaaS revenue?
          </h2>
          <p className="mt-5 text-white/60">
            Join hundreds of high-growth companies automating their complex
            billing workflows today.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/register"
                className="block rounded-2xl bg-[var(--lp-accent)] px-10 py-5 text-sm font-semibold text-white shadow-xl shadow-[var(--lp-accent)]/20 hover:brightness-110"
              >
                Start Your Free Trial
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              {/* TODO: point this at a real Calendly/scheduling link when you have one */}
              <a
                href="mailto:hello@billflow.example?subject=Book%20a%20demo"
                className="block rounded-2xl border border-white/20 bg-white/10 px-10 py-5 text-sm font-semibold text-white backdrop-blur-md hover:bg-white/20"
              >
                Book a Demo
              </a>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
