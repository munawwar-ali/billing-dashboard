import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { login } from "../../utils/api"; // adjust path if your utils/api.js lives elsewhere

export default function LoginForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const update = (field) => (e) => {
    const value = field === "remember" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const response = await login({ email: form.email, password: form.password });

      // Store the JWT so ProtectedRoute recognizes the session.
      // If your utils/auth.js uses a different key/function, swap this
      // line for that helper instead (e.g. setAuthToken(response.data.token)).
      const token = response?.data?.token ?? response?.token;
      if (token) localStorage.setItem("token", token);

      setStatus("success");
      setTimeout(() => navigate("/dashboard"), 700);
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err?.response?.data?.message ||
          err?.message ||
          "Invalid email or password. Please try again."
      );
    }
  };

  return (
    <section className="flex flex-1 items-center justify-center bg-white p-6 md:p-12 lg:p-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="mb-10 text-center md:text-left">
          <div className="mb-4 flex items-center justify-center gap-2 md:justify-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--lp-accent)] text-xl font-bold text-white">
              B
            </div>
            <span className="font-display text-xl font-semibold text-[var(--lp-accent-dark)]">
              BillFlow
            </span>
          </div>
          <h2 className="font-display text-3xl font-semibold text-[var(--lp-ink)]">
            Welcome back
          </h2>
          <p className="mt-2 text-[var(--lp-body)]">
            Log in to manage your automated billing.
          </p>
        </div>

        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 flex items-start gap-2 rounded-lg border border-[var(--auth-error)]/30 bg-[var(--auth-error)]/5 p-3 text-sm text-[var(--auth-error)]"
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <Field label="Email Address">
            <IconInput
              icon={Mail}
              type="email"
              placeholder="name@company.com"
              required
              value={form.email}
              onChange={update("email")}
            />
          </Field>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-mono text-[11px] uppercase tracking-wide text-[var(--lp-body)]">
                Password
              </label>
              <a href="#" className="text-xs font-bold text-[var(--lp-accent)] hover:underline">
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <IconInput
                icon={Lock}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={form.password}
                onChange={update("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--lp-body)] transition-colors hover:text-[var(--lp-accent)]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 py-1">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={update("remember")}
              className="h-4 w-4 rounded border-[var(--lp-border)] text-[var(--lp-accent)] focus:ring-[var(--lp-accent)]/20"
            />
            <label className="text-[13px] leading-tight text-[var(--lp-body)]">
              Remember me for 30 days
            </label>
          </div>

          <motion.button
            type="submit"
            disabled={status === "loading"}
            whileHover={status === "idle" ? { scale: 1.02 } : {}}
            whileTap={status === "idle" ? { scale: 0.98 } : {}}
            animate={{
              backgroundColor:
                status === "success" ? "var(--auth-cyan)" : "var(--lp-accent)",
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-4 font-semibold text-white shadow-lg shadow-[var(--lp-accent)]/20 disabled:cursor-not-allowed"
          >
            {status === "idle" && (
              <>
                <span>Log In</span>
                <ArrowRight size={18} />
              </>
            )}
            {status === "loading" && (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Authenticating...</span>
              </>
            )}
            {status === "success" && (
              <>
                <CheckCircle2 size={18} />
                <span>Success! Redirecting...</span>
              </>
            )}
            {status === "error" && (
              <>
                <span>Try Again</span>
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--lp-border)]" />
          </div>
          <div className="relative flex justify-center text-[10px]">
            <span className="bg-white px-3 font-bold uppercase tracking-widest text-[var(--lp-body)]">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 rounded-lg border border-[var(--lp-border)] py-3 transition-colors hover:bg-[var(--lp-bg-alt)]">
            <GoogleIcon />
            <span className="text-sm font-semibold text-[var(--lp-ink)]">Google</span>
          </button>
          <button className="flex items-center justify-center gap-2 rounded-lg border border-[var(--lp-border)] py-3 transition-colors hover:bg-[var(--lp-bg-alt)]">
            <GitHubIcon />
            <span className="text-sm font-semibold text-[var(--lp-ink)]">GitHub</span>
          </button>
        </div>

        <div className="mt-8 border-t border-[var(--lp-border)] pt-8 text-center">
          <p className="text-sm text-[var(--lp-body)]">
            Don&apos;t have an account?{" "}
            <a href="/register" className="font-bold text-[var(--lp-accent)] hover:underline">
              Sign Up
            </a>
          </p>
        </div>

        <div className="mt-6 flex justify-center gap-6 text-[11px] font-semibold uppercase tracking-widest text-[var(--lp-body)]/70">
          <a href="#" className="transition-colors hover:text-[var(--lp-accent)]">Privacy</a>
          <a href="#" className="transition-colors hover:text-[var(--lp-accent)]">Terms</a>
          <a href="#" className="transition-colors hover:text-[var(--lp-accent)]">Help</a>
        </div>
      </motion.div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="font-mono text-[11px] uppercase tracking-wide text-[var(--lp-body)]">
        {label}
      </label>
      {children}
    </div>
  );
}

function IconInput({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon
        size={18}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--lp-body)]"
      />
      <input
        {...props}
        className="auth-input w-full rounded-lg border border-[var(--lp-border)] py-3 pl-10 pr-10 focus:border-[var(--lp-accent)] focus:outline-none"
      />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className="h-5 w-5 fill-[var(--lp-ink)]" viewBox="0 0 24 24">
      <path d="M12 1.27a11 11 0 00-3.48 21.46c.55.1.75-.24.75-.53v-1.87c-3.06.66-3.7-1.47-3.7-1.47-.5-1.27-1.21-1.61-1.21-1.61-1-.68.08-.67.08-.67 1.1.08 1.68 1.13 1.68 1.13.98 1.68 2.58 1.2 3.2.92.1-.72.39-1.2.7-1.48-2.44-.28-5-1.22-5-5.42 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.9 0 0 .92-.3 3.03 1.13a10.5 10.5 0 015.5 0c2.1-1.43 3.03-1.13 3.03-1.13.6 1.5.22 2.62.11 2.9.7.77 1.13 1.75 1.13 2.95 0 4.21-2.57 5.13-5 5.41.4.34.75 1.02.75 2.06v3.05c0 .29.2.64.75.53a11 11 0 00-3.48-21.46z" />
    </svg>
  );
}
