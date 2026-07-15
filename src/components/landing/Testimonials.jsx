import { motion } from "framer-motion";
import { Star, StarHalf } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "BillFlow saved us months of engineering time. We switched from a custom internal solution and revenue tracking is finally accurate.",
    name: "Sarah Chen",
    role: "CTO @ NexusPay",
    stars: 5,
    initials: "SC",
  },
  {
    quote:
      "The multi-tenant support is second to none. Managing 500+ B2B clients with separate billing cycles was a nightmare before BillFlow.",
    name: "Marc Dupont",
    role: "Founder @ DataCore",
    stars: 4.5,
    initials: "MD",
  },
  {
    quote:
      "Best developer experience for billing I've encountered. The docs are incredible and the CLI makes testing usage scenarios a breeze.",
    name: "Alex Rivera",
    role: "VP Engineering @ CloudForge",
    stars: 5,
    initials: "AR",
  },
];

function Stars({ count }) {
  const full = Math.floor(count);
  const half = count % 1 !== 0;
  return (
    <div className="mb-4 flex gap-1 text-[var(--lp-accent)]">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={i} size={16} fill="currentColor" />
      ))}
      {half && <StarHalf size={16} fill="currentColor" />}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="mb-16 text-center font-display text-4xl font-semibold text-[var(--lp-ink)] sm:text-5xl">
          Built by founders for founders
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              className="rounded-3xl border border-[var(--lp-border)] bg-[var(--lp-bg-alt)] p-8 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.05)]"
            >
              <Stars count={t.stars} />
              <p className="mb-8 italic text-[var(--lp-ink)]">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--lp-accent)]/15 font-mono text-sm font-semibold text-[var(--lp-accent-dark)]">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--lp-ink)]">{t.name}</p>
                  <p className="text-xs text-[var(--lp-body)]">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
