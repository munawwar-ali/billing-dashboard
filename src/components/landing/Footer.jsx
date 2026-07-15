import { Globe2, Share2, Terminal } from "lucide-react";

const COLUMNS = [
  { title: "Company", links: ["About Us", "Careers", "Contact"] },
  { title: "Resources", links: ["API Docs", "Changelog", "Support"] },
  { title: "Legal", links: ["Privacy", "Terms", "GitHub"] },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--lp-border)] bg-[var(--lp-bg-alt)]">
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-10 px-6 py-16 md:grid-cols-4 lg:flex lg:justify-between">
        <div className="col-span-2 mb-8 lg:mb-0 lg:w-1/4">
          <span className="font-display block text-2xl font-semibold text-[var(--lp-ink)]">
            BillFlow
          </span>
          <p className="mt-4 max-w-xs text-sm text-[var(--lp-body)]">
            The definitive multi-tenant billing infrastructure for
            engineering-led SaaS companies.
          </p>
          <div className="mt-6 flex gap-3">
            {[Globe2, Share2, Terminal].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[var(--lp-body)] transition-colors hover:text-[var(--lp-accent)]"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="mb-4 text-sm font-semibold text-[var(--lp-ink)]">{col.title}</h4>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-[var(--lp-body)] underline-offset-4 hover:text-[var(--lp-accent)] hover:underline"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 border-t border-[var(--lp-border)] px-6 py-6 md:flex-row">
        <p className="text-xs text-[var(--lp-body)]">
          &copy; {new Date().getFullYear()} BillFlow Inc. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-xs text-[var(--lp-body)]">All Systems Operational</span>
        </div>
      </div>
    </footer>
  );
}
