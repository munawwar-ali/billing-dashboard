import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useAnimationControls } from "framer-motion";
import {
  Building2,
  Mail,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { register } from "../../utils/api"; // adjust path if your utils/api.js lives elsewhere
import BillFlowIcon from "../icons/BillFlowIcon";

const STRENGTH_LABELS = ["Too Short", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = [
  "var(--lp-border)",
  "var(--auth-error)",
  "var(--auth-warn)",
  "var(--auth-cyan)",
  "var(--lp-accent)",
];

function calcStrength(value) {
  let strength = 0;
  if (value.length > 5) strength++;
  if (/[A-Z]/.test(value)) strength++;
  if (/[0-9]/.test(value)) strength++;
  if (/[^A-Za-z0-9]/.test(value)) strength++;
  return strength;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    orgName: "",
    email: "",
    password: "",
    confirmPassword: "",
    tos: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const strength = calcStrength(form.password);
  const emailError =
    emailTouched && form.email.length > 0 && !EMAIL_REGEX.test(form.email);
  const matchError =
    form.confirmPassword.length > 0 && form.confirmPassword !== form.password;

  const emailControls = useAnimationControls();
  const confirmControls = useAnimationControls();

  useEffect(() => {
    if (emailError) {
      emailControls.start({ x: [0, -6, 6, -6, 6, 0], transition: { duration: 0.4 } });
    }
  }, [emailError]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (matchError) {
      confirmControls.start({ x: [0, -6, 6, -6, 6, 0], transition: { duration: 0.4 } });
    }
  }, [matchError]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = (field) => (e) => {
    const value = field === "tos" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError || matchError || status === "loading") return;

    setStatus("loading");
    setErrorMsg("");

    try {
      // NOTE: adjust these field names to match what your backend's
      // POST /api/auth/register actually expects (README says it creates
      // a tenant + admin user — your payload shape may use
      // `organizationName` instead of `orgName`, `name` instead of
      // firstName/lastName, etc.)
      const response = await register({
        firstName: form.firstName,
        lastName: form.lastName,
        organizationName: form.orgName,
        email: form.email,
        password: form.password,
      });

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
          "Something went wrong. Please try again."
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
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--lp-accent)]">
              <BillFlowIcon size={22} className="text-white" />
            </div>
            <span className="font-display text-xl font-semibold text-[var(--lp-accent-dark)]">
              BillFlow
            </span>
          </div>
          <h2 className="font-display text-3xl font-semibold text-[var(--lp-ink)]">
            Create your account
          </h2>
          <p className="mt-2 text-[var(--lp-body)]">
            Step into the future of automated billing.
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
          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name">
              <input
                className="auth-input w-full rounded-lg border border-[var(--lp-border)] px-4 py-3 focus:border-[var(--lp-accent)] focus:outline-none"
                placeholder="Jane"
                required
                value={form.firstName}
                onChange={update("firstName")}
              />
            </Field>
            <Field label="Last Name">
              <input
                className="auth-input w-full rounded-lg border border-[var(--lp-border)] px-4 py-3 focus:border-[var(--lp-accent)] focus:outline-none"
                placeholder="Doe"
                required
                value={form.lastName}
                onChange={update("lastName")}
              />
            </Field>
          </div>

          <Field label="Organization Name">
            <IconInput
              icon={Building2}
              placeholder="Acme Corp"
              required
              value={form.orgName}
              onChange={update("orgName")}
            />
          </Field>

          <Field label="Work Email">
            <motion.div animate={emailControls}>
              <IconInput
                icon={Mail}
                type="email"
                placeholder="jane@company.com"
                required
                value={form.email}
                onChange={update("email")}
                onBlur={() => setEmailTouched(true)}
                error={emailError}
              />
            </motion.div>
            {emailError && (
              <p className="mt-1 text-xs font-medium text-[var(--auth-error)]">
                Please enter a valid work email.
              </p>
            )}
          </Field>

          <Field label="Password">
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

            <div className="mt-2 space-y-2">
              <div className="flex h-1 w-full gap-1 overflow-hidden rounded-full bg-[var(--lp-bg-alt)]">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="h-full flex-1 rounded-full"
                    initial={false}
                    animate={{
                      backgroundColor:
                        i < strength ? STRENGTH_COLORS[strength] : "var(--lp-border)",
                    }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
              <div
                className="font-mono text-[11px] font-semibold uppercase tracking-wider"
                style={{
                  color: strength < 3 ? "var(--auth-error)" : "var(--lp-accent)",
                }}
              >
                {form.password.length > 0
                  ? `Security Strength: ${STRENGTH_LABELS[strength]}`
                  : "Security Strength: None"}
              </div>
            </div>
          </Field>

          <Field label="Confirm Password">
            <motion.div animate={confirmControls}>
              <IconInput
                icon={KeyRound}
                type="password"
                placeholder="••••••••"
                required
                value={form.confirmPassword}
                onChange={update("confirmPassword")}
                error={matchError}
              />
            </motion.div>
            {matchError && (
              <p className="mt-1 text-xs font-medium text-[var(--auth-error)]">
                Passwords do not match.
              </p>
            )}
          </Field>

          <div className="flex items-start gap-3 py-2">
            <input
              type="checkbox"
              required
              checked={form.tos}
              onChange={update("tos")}
              className="mt-1 h-4 w-4 rounded border-[var(--lp-border)] text-[var(--lp-accent)] focus:ring-[var(--lp-accent)]/20"
            />
            <label className="text-[13px] leading-tight text-[var(--lp-body)]">
              By creating an account, you agree to our{" "}
              <a href="#" className="font-medium text-[var(--lp-accent)] hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="font-medium text-[var(--lp-accent)] hover:underline">
                Privacy Policy
              </a>
              .
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
                <span>Start My Free Trial</span>
                <ArrowRight size={18} />
              </>
            )}
            {status === "loading" && (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Validating...</span>
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

        <div className="mt-8 border-t border-[var(--lp-border)] pt-8 text-center">
          <p className="text-sm text-[var(--lp-body)]">
            Already have an account?{" "}
            <a href="/login" className="font-bold text-[var(--lp-accent)] hover:underline">
              Log In
            </a>
          </p>
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

function IconInput({ icon: Icon, error, ...props }) {
  return (
    <div className="relative">
      <Icon
        size={18}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--lp-body)]"
      />
      <input
        {...props}
        className={`auth-input w-full rounded-lg border py-3 pl-10 pr-4 focus:outline-none ${
          error
            ? "border-[var(--auth-error)]"
            : "border-[var(--lp-border)] focus:border-[var(--lp-accent)]"
        }`}
      />
    </div>
  );
}
