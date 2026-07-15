import "../../styles/auth.css";

import BrandPanel from "../../components/auth/BrandPanel";
import LoginForm from "../../components/auth/LoginForm";

export default function Login() {
  return (
    <main className="auth flex min-h-screen flex-col md:flex-row">
      <BrandPanel
        headline="Scale your SaaS billing without the headache."
        subtext="Automated tax compliance, usage-based metering, and smart collections in one powerful dashboard."
        testimonial={{
          quote:
            "BillFlow reduced our manual billing hours by 90%. It's the most robust infrastructure we've ever integrated.",
          name: "Sarah Jenkins",
          role: "CFO at CloudScale",
        }}
      />
      <LoginForm />
    </main>
  );
}
