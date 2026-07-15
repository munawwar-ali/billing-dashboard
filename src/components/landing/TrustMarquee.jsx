import { Boxes, RefreshCw, Infinity as InfinityIcon, Zap, ShieldCheck } from "lucide-react";

const LOGOS = [
  { name: "LOGICORE", Icon: Boxes },
  { name: "VORTEX", Icon: RefreshCw },
  { name: "INFINITI", Icon: InfinityIcon },
  { name: "METERED", Icon: Zap },
  { name: "AUTHBLOCK", Icon: ShieldCheck },
];

function LogoRow({ ariaHidden = false }) {
  return (
    <div className="flex shrink-0 items-center gap-16 pr-16" aria-hidden={ariaHidden}>
      {LOGOS.map(({ name, Icon }) => (
        <div
          key={name}
          className="flex items-center gap-2 text-[var(--lp-ink)]/50 grayscale transition-all hover:text-[var(--lp-ink)] hover:grayscale-0"
        >
          <Icon size={26} strokeWidth={1.75} />
          <span className="font-display text-xl font-semibold tracking-tight">
            {name}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function TrustMarquee() {
  return (
    <section className="border-y border-[var(--lp-border)] bg-white py-14">
      <p className="mx-auto mb-8 max-w-[1200px] px-6 text-center font-mono text-xs uppercase tracking-[0.2em] text-[var(--lp-body)]">
        Trusted by modern SaaS teams worldwide
      </p>
      <div className="flex overflow-hidden">
        <div className="lp-marquee-track flex">
          <LogoRow />
          <LogoRow ariaHidden />
        </div>
      </div>
    </section>
  );
}
