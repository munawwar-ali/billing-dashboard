import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const NODES = [
  { x: 40, label: "Org" },
  { x: 180, label: "API" },
  { x: 320, label: "Track" },
  { x: 460, label: "Engine" },
  { x: 600, label: "Inv" },
];

const CHECKLIST = [
  "Distributed Event Ingestion",
  "Real-time Usage Aggregation",
  "Automated Ledger Reconciliation",
];

export default function WorkflowBanner() {
  return (
    <section className="relative overflow-hidden bg-[var(--lp-navy)] px-6 py-24 text-white">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="font-display text-4xl font-semibold sm:text-5xl">
            From Request to Invoice
          </h2>
          <p className="mt-5 max-w-lg text-white/60">
            Our high-concurrency ingestion pipeline processes millions of
            events per second, mapping every byte of usage to a billable
            entity without missing a cent.
          </p>
          <ul className="mt-8 space-y-4">
            {CHECKLIST.map((text, i) => (
              <motion.li
                key={text}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <CheckCircle2 className="text-[#A855F7]" size={20} />
                <span>{text}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* SVG node-flow diagram — lightweight stand-in for the Three.js particle scene */}
        <div className="hidden lg:block">
          <svg viewBox="0 0 640 200" className="w-full opacity-90">
            <line
              x1="40"
              y1="100"
              x2="600"
              y2="100"
              stroke="#8B5CF6"
              strokeOpacity="0.25"
              strokeWidth="2"
            />
            {NODES.map((node, i) => (
              <motion.circle
                key={node.label}
                cx={node.x}
                cy="100"
                r="10"
                fill="#7C3AED"
                animate={{ cy: [100, 90, 100] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut",
                }}
              />
            ))}
            {/* traveling particles */}
            {[0, 1, 2].map((i) => (
              <motion.circle
                key={i}
                r="5"
                fill="#C4B5FD"
                animate={{ cx: [40, 600], cy: [100, 90, 100, 90, 100] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  delay: i * 1.1,
                  ease: "linear",
                }}
              />
            ))}
          </svg>

          <div className="mt-6 max-w-xs rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <p className="font-mono text-xs uppercase tracking-widest text-[#C4B5FD]">
              Live Pipeline
            </p>
            <p className="font-display mt-1 text-2xl font-semibold">
              Active Flux
            </p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="lp-shimmer h-full w-[70%] rounded-full bg-[#A855F7]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
