import { motion } from "framer-motion";
import { Sparkles, Gauge, ShieldCheck } from "lucide-react";

export default function BrandPanel({
  eyebrow = "New: Billing Automation 2.0",
  headline = "Scale your enterprise billing with confidence.",
  subtext = "Join 10,000+ high-growth companies using BillFlow to automate complex revenue cycles and subscription management.",
  testimonial = null, // { quote, name, role }
}) {
  return (
    <section className="relative hidden items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--lp-accent-dark)] to-[var(--lp-accent)] p-12 md:sticky md:top-0 md:flex md:h-screen md:w-5/12 lg:w-1/2">
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[var(--auth-cyan)]/20 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-lg text-white"
      >
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur-sm">
          <Sparkles size={14} />
          <span className="font-mono text-[10px] uppercase tracking-widest">
            {eyebrow}
          </span>
        </span>

        <h1 className="font-display mb-6 text-4xl font-semibold leading-tight sm:text-[44px]">
          {headline}
        </h1>
        <p className="text-lg leading-relaxed text-white/80">{subtext}</p>

        <div className="mt-12 grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
          >
            <Gauge className="mb-4 text-white/90" size={22} />
            <h3 className="mb-1 font-semibold">Instant Setup</h3>
            <p className="text-sm text-white/60">Ready to go in under 5 minutes.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
          >
            <ShieldCheck className="mb-4 text-[var(--auth-cyan)]" size={22} />
            <h3 className="mb-1 font-semibold">Enterprise Sec</h3>
            <p className="text-sm text-white/60">SOC2 Type II compliant by default.</p>
          </motion.div>
        </div>

        {testimonial ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative z-10 mt-10 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
          >
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs font-semibold">
                {testimonial.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <div className="text-sm font-bold text-white">{testimonial.name}</div>
                <div className="text-xs uppercase tracking-widest text-white/60">
                  {testimonial.role}
                </div>
              </div>
            </div>
            <p className="text-sm italic leading-relaxed text-white/80">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 flex items-center gap-6 grayscale"
          >
            <div className="h-6 w-24 rounded bg-white/20" />
            <div className="h-6 w-24 rounded bg-white/20" />
            <div className="h-6 w-24 rounded bg-white/20" />
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
