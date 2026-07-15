import { motion } from "framer-motion";
import {
  Network,
  KeyRound,
  Activity,
  Webhook,
  CreditCard,
  FileText,
  Globe2,
  Terminal,
} from "lucide-react";

const FEATURES = [
  { Icon: Network, title: "Multi-Tenant", desc: "First-class isolation for your customers' organizations." },
  { Icon: KeyRound, title: "JWT Auth", desc: "Seamlessly integrate with your existing authentication provider." },
  { Icon: Activity, title: "Usage Tracking", desc: "High-fidelity tracking of every API call and storage unit." },
  { Icon: Webhook, title: "Webhooks", desc: "Real-time lifecycle events to keep your app in sync." },
  { Icon: CreditCard, title: "Auto-Pay", desc: "Automated collections via Stripe, Adyen, or Paddle." },
  { Icon: FileText, title: "PDF Generation", desc: "Custom branded invoices generated automatically every month." },
  { Icon: Globe2, title: "Global VAT", desc: "Automatic tax calculation based on customer location." },
  { Icon: Terminal, title: "Developer API", desc: "GraphQL and REST APIs designed for developers by developers." },
];

export default function FeatureGrid() {
  return (
    <section id="resources" className="scroll-mt-24 bg-white px-6 py-24">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="mb-16 text-center font-display text-4xl font-semibold text-[var(--lp-ink)] sm:text-5xl">
          Built for Scale
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.45, delay: (i % 4) * 0.08, ease: "easeOut" }}
              whileHover={{ y: -4, borderColor: "var(--lp-accent)" }}
              className="rounded-2xl border border-[var(--lp-border)] p-7 transition-shadow hover:shadow-[0_16px_40px_rgba(124,58,237,0.12)]"
            >
              <Icon className="mb-4 text-[var(--lp-accent)]" size={28} />
              <h4 className="font-display text-xl font-semibold text-[var(--lp-ink)]">
                {title}
              </h4>
              <p className="mt-2 text-sm text-[var(--lp-body)]">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
