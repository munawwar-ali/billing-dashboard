import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const TIERS = [
  {
    name: "Starter",
    price: "$0",
    period: "/mo",
    desc: "Perfect for early-stage startups.",
    features: ["Up to 50 active tenants", "10,000 events /month", "Standard API access"],
    cta: "Choose Starter",
    to: "/register?plan=starter",
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$149",
    period: "/mo",
    desc: "Built for scaling SaaS products.",
    features: [
      "Unlimited active tenants",
      "1M events /month",
      "Advanced rate limiting",
      "Custom PDF templates",
    ],
    cta: "Choose Growth",
    to: "/register?plan=growth",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "Tailored for high-throughput apps.",
    features: [
      "Dedicated account manager",
      "Custom SLA & Uptime",
      "On-premise deployment",
      "White-label billing portal",
    ],
    cta: "Contact Sales",
    // TODO: no contact/sales page yet — swap for a real route or mailto once you have one
    to: "mailto:sales@billflow.example",
    highlighted: false,
  },
];

const COMPARISON = [
  { feature: "Usage-Based Metering", starter: true, growth: true, enterprise: true },
  { feature: "Multi-Tenant Isolation", starter: true, growth: true, enterprise: true },
  { feature: "Tiered Pricing Engine", starter: "Limited", growth: true, enterprise: true },
  { feature: "Custom Domain Invoicing", starter: false, growth: true, enterprise: true },
];

function Cell({ value }) {
  if (value === true) return <Check className="text-[var(--lp-accent)]" size={18} />;
  if (value === false) return <span className="text-[var(--lp-border)]">—</span>;
  return <span className="text-[var(--lp-body)]">{value}</span>;
}

function TierButton({ tier }) {
  const classes = `w-full block text-center rounded-xl py-3 text-sm font-semibold transition-all ${
    tier.highlighted
      ? "bg-[var(--lp-accent)] text-white shadow-md hover:brightness-110"
      : "border border-[var(--lp-border)] text-[var(--lp-ink)] hover:bg-[var(--lp-bg-alt)]"
  }`;

  if (tier.to.startsWith("mailto:")) {
    return (
      <a href={tier.to} className={classes}>
        {tier.cta}
      </a>
    );
  }
  return (
    <Link to={tier.to} className={classes}>
      {tier.cta}
    </Link>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 bg-[var(--lp-bg-alt)] px-6 py-24">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-16 text-center">
          <h2 className="font-display text-4xl font-semibold text-[var(--lp-ink)] sm:text-5xl">
            Simple pricing for complex billing
          </h2>
          <p className="mt-4 text-[var(--lp-body)]">No hidden fees. Scale with your revenue.</p>
        </div>

        <div className="mb-16 grid grid-cols-1 items-start gap-6 md:grid-cols-3">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              className={`relative flex flex-col rounded-3xl border p-8 ${
                tier.highlighted
                  ? "z-10 scale-105 border-2 border-[var(--lp-accent)] bg-white shadow-2xl shadow-[var(--lp-accent)]/10"
                  : "border-[var(--lp-border)] bg-white"
              }`}
            >
              {tier.highlighted && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[var(--lp-accent)] px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  Most Popular
                </span>
              )}
              <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-wide text-[var(--lp-accent)]">
                {tier.name}
              </p>
              <p className="font-display mb-4 text-4xl font-semibold text-[var(--lp-ink)]">
                {tier.price}
                <span className="text-base font-normal text-[var(--lp-body)]">{tier.period}</span>
              </p>
              <p className="mb-6 text-[var(--lp-body)]">{tier.desc}</p>
              <ul className="mb-8 flex-grow space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[var(--lp-ink)]">
                    <Check className="text-[var(--lp-accent)]" size={16} />
                    {f}
                  </li>
                ))}
              </ul>
              <TierButton tier={tier} />
            </motion.div>
          ))}
        </div>

        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.5 }}
          className="hidden overflow-hidden rounded-3xl border border-[var(--lp-border)] bg-white lg:block"
        >
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[var(--lp-bg-alt)]">
                <th className="p-6 text-sm font-semibold text-[var(--lp-ink)]">Features</th>
                <th className="p-6 text-sm font-semibold text-[var(--lp-ink)]">Starter</th>
                <th className="p-6 text-sm font-semibold text-[var(--lp-ink)]">Growth</th>
                <th className="p-6 text-sm font-semibold text-[var(--lp-ink)]">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--lp-border)]">
              {COMPARISON.map((row) => (
                <tr key={row.feature}>
                  <td className="p-6 text-sm text-[var(--lp-body)]">{row.feature}</td>
                  <td className="p-6"><Cell value={row.starter} /></td>
                  <td className="p-6"><Cell value={row.growth} /></td>
                  <td className="p-6"><Cell value={row.enterprise} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
