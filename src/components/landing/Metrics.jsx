import { motion } from "framer-motion";
import { useCountUp } from "../../hooks/useCountUp";

const STATS = [
  { end: 500, suffix: "K+", label: "API Requests Tracked" },
  { end: 1000, suffix: "+", label: "Invoices Generated" },
  { end: 50, suffix: "+", label: "Organizations" },
  { end: 99.9, suffix: "%", label: "Uptime SLA", decimals: 1 },
];

function StatCard({ end, suffix, label, decimals = 0, index }) {
  const { ref, display } = useCountUp(end, { decimals });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="rounded-2xl border border-[var(--lp-border)] bg-[var(--lp-bg-alt)] p-8 text-center"
    >
      <h3 className="font-mono text-4xl font-semibold text-[var(--lp-accent)]">
        {display}
        {suffix}
      </h3>
      <p className="mt-2 text-sm font-medium text-[var(--lp-body)]">{label}</p>
    </motion.div>
  );
}

export default function Metrics() {
  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-6 lg:grid-cols-4">
        {STATS.map((stat, i) => (
          <StatCard key={stat.label} index={i} {...stat} />
        ))}
      </div>
    </section>
  );
}
