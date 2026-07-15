import { motion } from "framer-motion";
import { BarChart3, Users2, ReceiptText, Gauge } from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-10%" },
  transition: { duration: 0.55, delay, ease: "easeOut" },
});

export default function FeatureShowcase() {
  return (
    <section id="features" className="scroll-mt-24 bg-[var(--lp-bg-alt)] px-6 py-24">
      <div className="mx-auto max-w-[1200px]">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="font-display text-4xl font-semibold text-[var(--lp-ink)] sm:text-5xl">
            Everything you need to monetize usage
          </h2>
          <p className="mt-4 text-[var(--lp-body)]">
            Stop building billing features in-house. Our modular engine
            handles the complexity of tiered usage, dynamic taxes, and
            complex tenant relations.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Usage Analytics — large card */}
          <motion.div
            {...fadeUp(0)}
            className="group rounded-3xl border border-[var(--lp-border)] bg-white/70 p-8 backdrop-blur lg:col-span-2"
          >
            <BarChart3 className="mb-4 text-[var(--lp-accent)]" size={30} />
            <h3 className="font-display text-2xl font-semibold text-[var(--lp-ink)]">
              Usage Analytics
            </h3>
            <p className="mt-2 max-w-sm text-[var(--lp-body)]">
              Deep-dive into API consumption with real-time dashboards and
              predictive forecasting.
            </p>
            <div className="mt-8 aspect-[16/9] w-full overflow-hidden rounded-xl border border-[var(--lp-border)] bg-[var(--lp-navy)] transition-transform duration-500 group-hover:scale-[1.015]">
              <div className="flex h-full w-full items-end gap-2 p-6">
                {[40, 65, 35, 80, 55, 90, 60, 75].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                    className="flex-1 rounded-t-sm bg-gradient-to-t from-[#7C3AED] to-[#A855F7]"
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Tenant Management */}
          <motion.div
            {...fadeUp(0.1)}
            className="flex flex-col justify-between rounded-3xl border border-[var(--lp-border)] bg-white/70 p-8 backdrop-blur"
          >
            <div>
              <Users2 className="mb-4 text-[var(--lp-accent)]" size={30} />
              <h3 className="font-display text-2xl font-semibold text-[var(--lp-ink)]">
                Tenant Management
              </h3>
              <p className="mt-2 text-[var(--lp-body)]">
                Manage thousands of child organizations with isolated billing
                cycles and custom pricing plans.
              </p>
            </div>
            <div className="mt-8 flex -space-x-3">
              {["JD", "AS", "RK"].map((initials, i) => (
                <div
                  key={initials}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[var(--lp-accent)]/80 text-xs font-semibold text-white"
                  style={{ zIndex: 3 - i }}
                >
                  {initials}
                </div>
              ))}
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[var(--lp-ink)] text-xs font-semibold text-white">
                +12
              </div>
            </div>
          </motion.div>

          {/* Billing Engine */}
          <motion.div
            {...fadeUp(0.2)}
            className="rounded-3xl border border-[var(--lp-border)] bg-white/70 p-8 backdrop-blur"
          >
            <ReceiptText className="mb-4 text-[var(--lp-accent)]" size={30} />
            <h3 className="font-display text-2xl font-semibold text-[var(--lp-ink)]">
              Billing Engine
            </h3>
            <p className="mt-2 text-[var(--lp-body)]">
              Global tax compliance, multi-currency support, and automated
              credit note generation for every region.
            </p>
          </motion.div>

          {/* Rate Limiting */}
          <motion.div
            {...fadeUp(0.3)}
            className="flex flex-col items-center gap-8 rounded-3xl border border-[var(--lp-border)] bg-white/70 p-8 backdrop-blur md:flex-row lg:col-span-2"
          >
            <div className="md:w-1/2">
              <Gauge className="mb-4 text-[var(--lp-accent)]" size={30} />
              <h3 className="font-display text-2xl font-semibold text-[var(--lp-ink)]">
                Advanced Rate Limiting
              </h3>
              <p className="mt-2 text-[var(--lp-body)]">
                Dynamically adjust user access based on their current
                subscription tier and unpaid balances.
              </p>
            </div>
            <div className="w-full overflow-hidden rounded-xl border border-[var(--lp-border)] bg-[var(--lp-navy)] p-4 font-mono text-sm md:w-1/2">
              <div className="mb-3 flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-[#f43f5e]" />
                <div className="h-3 w-3 rounded-full bg-[#f59e0b]" />
                <div className="h-3 w-3 rounded-full bg-white/20" />
              </div>
              <p className="text-[#c4b5fd]">limit_status = check_quota(tenant_id)</p>
              <p className="text-white/60">if limit_status.exceeded:</p>
              <p className="pl-4 text-white/60">return HTTP_429_TOO_MANY_REQUESTS</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
