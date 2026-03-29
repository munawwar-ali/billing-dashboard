'use client';

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { register } from '@/utils/api';
import { saveAuth, getAuth } from '@/utils/auth';
import {
  Activity, Eye, EyeOff, ArrowRight,
  Check, X, Building2, Mail, Lock, User
} from 'lucide-react';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ── Password strength analyzer ─────────────────────────────────────────────
function getPasswordStrength(password) {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const passed = Object.values(checks).filter(Boolean).length;
  const labels = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const colors = ['', '#f43f5e', '#f97316', '#f59e0b', '#10b981', '#6366f1'];
  return { checks, passed, label: labels[passed], color: colors[passed] };
}

function PasswordStrengthBar({ password }) {
  if (!password) return null;
  const { checks, passed, label, color } = getPasswordStrength(password);

  const requirements = [
    { key: 'length', text: 'At least 8 characters' },
    { key: 'uppercase', text: 'One uppercase letter' },
    { key: 'number', text: 'One number' },
    { key: 'special', text: 'One special character' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-3 space-y-3"
    >
      {/* Bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="flex-1 h-full rounded-full"
              animate={{ backgroundColor: i < passed ? color : '#1e2738' }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            />
          ))}
        </div>
        <span className="text-[11px] font-semibold shrink-0" style={{ color: color || '#475569' }}>
          {label || 'Enter password'}
        </span>
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-2 gap-1.5">
        {requirements.map(({ key, text }) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={cn(
              'w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 transition-all duration-200',
              checks[key] ? 'bg-emerald-500/20' : 'bg-slate-800'
            )}>
              {checks[key]
                ? <Check className="w-2 h-2 text-emerald-400" />
                : <X className="w-2 h-2 text-slate-600" />
              }
            </div>
            <span className={cn(
              'text-[11px] transition-colors duration-200',
              checks[key] ? 'text-slate-400' : 'text-slate-600'
            )}>
              {text}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Floating label input ───────────────────────────────────────────────────
function FloatingInput({ id, name, type = 'text', value, onChange, label, error, icon: Icon, children }) {
  const [focused, setFocused] = useState(false);
  const isLifted = focused || value.length > 0;

  return (
    <div className="relative">
      <div className={cn(
        'relative rounded-lg border bg-slate-900/60 transition-all duration-200',
        focused ? 'border-indigo-500 ring-1 ring-indigo-500/40' : 'border-border-subtle',
        error ? '!border-rose-500/70 ring-1 ring-rose-500/20' : ''
      )}>
        {Icon && (
          <div className={cn(
            'absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200',
            focused ? 'text-indigo-400' : 'text-slate-600'
          )}>
            <Icon className="w-4 h-4" />
          </div>
        )}
        <label
          htmlFor={id}
          className={cn(
            'absolute transition-all duration-200 pointer-events-none font-medium',
            Icon ? 'left-10' : 'left-4',
            isLifted
              ? 'top-2 text-[10px] text-indigo-400 tracking-wide uppercase'
              : 'top-1/2 -translate-y-1/2 text-sm text-slate-500'
          )}
        >
          {label}
        </label>
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete="off"
          className={cn(
            'w-full bg-transparent pt-6 pb-2.5 text-sm text-white outline-none font-medium',
            Icon ? 'pl-10 pr-4' : 'px-4',
            children ? 'pr-10' : ''
          )}
        />
        {children && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{children}</div>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs text-rose-400 mt-1.5 ml-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Brand panel (right side for register) ─────────────────────────────────
function BrandPanel() {
  const steps = [
    { num: '01', title: 'Create your account', desc: 'Register with your company email and set a secure password.' },
    { num: '02', title: 'Set up your tenant', desc: 'Your organization workspace is automatically provisioned.' },
    { num: '03', title: 'Start tracking', desc: 'Monitor API usage, billing, and invoices from day one.' },
  ];

  return (
    <div className="hidden lg:flex lg:w-1/2 relative bg-[#050a14] flex-col justify-between p-12 overflow-hidden">

      {/* Background orbs */}
      <motion.div
        animate={{ x: [0, -25, 0], y: [0, 30, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-60px] right-[-60px] w-[420px] h-[420px] rounded-full bg-violet-600/15 blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -25, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="absolute bottom-[-80px] left-[-40px] w-[380px] h-[380px] rounded-full bg-indigo-600/20 blur-[90px] pointer-events-none"
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-16">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/10">
            <Activity className="w-6 h-6 text-indigo-400" />
          </div>
          <span className="text-xl font-black text-white tracking-tight">NexaBill</span>
        </div>

        {/* Headline */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-white leading-tight tracking-tight mb-4">
            Get started in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
              minutes.
            </span>
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm">
            Join hundreds of teams using NexaBill to manage their SaaS billing. No credit card required.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-7 relative">
          {/* Connector line */}
          <div className="absolute left-[18px] top-8 bottom-8 w-px bg-gradient-to-b from-indigo-500/40 via-violet-500/20 to-transparent" />

          {steps.map(({ num, title, desc }, i) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.14 }}
              className="flex items-start gap-5"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center shrink-0">
                <span className="text-[11px] font-black text-indigo-400 font-mono">{num}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-200 mb-0.5">{title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonial */}
      <div className="relative z-10">
        <div className="p-5 rounded-xl bg-slate-800/40 border border-border-subtle">
          <div className="flex gap-0.5 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-sm text-slate-400 italic leading-relaxed mb-3">
            "NexaBill cut our billing overhead by 70%. The multi-tenant isolation is exactly what we needed."
          </p>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
              S
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-300">Sarah Chen</p>
              <p className="text-[10px] text-slate-600">CTO, Streamline Labs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  PAGE COMPONENT
// ══════════════════════════════════════════════════════════════════════════
export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tenantName: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const auth = getAuth();
    if (auth?.token) navigate('/dashboard', { replace: true });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.tenantName.trim()) errs.tenantName = 'Company name is required';
    if (!formData.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Enter a valid email';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!agreed) errs.terms = 'You must agree to the terms';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setLoading(true);
    try {
      const response = await register(formData);
      const { token, user, tenant } = response.data.data;
      saveAuth(token, user, tenant);
      toast.success('Account created! Welcome to NexaBill 🎉');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setErrors({ form: msg });
      setShake(true);
      setTimeout(() => setShake(false), 500);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen flex bg-[#080d1a]">
      {/* Left: Brand Panel */}
      <BrandPanel />

      {/* Right: Register Form */}
      <div className="flex-1 lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-20 py-12 relative overflow-y-auto">

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="font-black text-white text-lg">NexaBill</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-black text-white tracking-tight mb-2">Create your account</h2>
            <p className="text-slate-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Sign in instead
              </Link>
            </p>
          </div>

          {/* Form error banner */}
          <AnimatePresence>
            {errors.form && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                className="mb-5 px-4 py-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                {errors.form}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <FloatingInput
              id="tenantName"
              name="tenantName"
              label="Company / Organization name"
              value={formData.tenantName}
              onChange={handleChange}
              error={errors.tenantName}
              icon={Building2}
            />

            <FloatingInput
              id="email"
              name="email"
              type="email"
              label="Work email address"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={Mail}
            />

            <div>
              <FloatingInput
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                label="Create a password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                icon={Lock}
              >
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-500 hover:text-slate-300 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </FloatingInput>

              {/* Strength bar */}
              <AnimatePresence>
                {formData.password && <PasswordStrengthBar password={formData.password} />}
              </AnimatePresence>
            </div>

            {/* Terms checkbox */}
            <div className="pt-1">
              <label className={cn(
                'flex items-start gap-3 cursor-pointer p-3 rounded-lg border transition-all',
                agreed ? 'border-indigo-500/40 bg-indigo-500/5' : 'border-border-subtle bg-transparent',
                errors.terms ? 'border-rose-500/40' : ''
              )}>
                <div className="mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => {
                      setAgreed(e.target.checked);
                      if (errors.terms) setErrors((p) => ({ ...p, terms: '' }));
                    }}
                    className="sr-only"
                  />
                  <div className={cn(
                    'w-4 h-4 rounded border-2 flex items-center justify-center transition-all',
                    agreed ? 'bg-indigo-500 border-indigo-500' : 'border-slate-600 bg-slate-800'
                  )}>
                    {agreed && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                </div>
                <span className="text-sm text-slate-400 leading-relaxed">
                  I agree to NexaBill's{' '}
                  <span className="text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors">Terms of Service</span>
                  {' '}and{' '}
                  <span className="text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors">Privacy Policy</span>
                </span>
              </label>
              <AnimatePresence>
                {errors.terms && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-xs text-rose-400 mt-1.5 ml-1"
                  >
                    {errors.terms}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-bold text-sm text-white transition-all',
                'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/25',
                loading && 'opacity-70 cursor-not-allowed'
              )}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating account…
                </>
              ) : (
                <>
                  Create account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Social signup */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border-subtle" />
            <span className="text-xs text-slate-600 font-medium">OR SIGN UP WITH</span>
            <div className="flex-1 h-px bg-border-subtle" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              {
                name: 'Google',
                icon: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                ),
              },
              {
                name: 'GitHub',
                icon: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                ),
              },
            ].map(({ name, icon }) => (
              <button
                key={name}
                type="button"
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-border-subtle bg-slate-800/40 hover:bg-slate-800 text-sm text-slate-300 font-medium transition-all"
              >
                {icon}
                {name}
              </button>
            ))}
          </div>

          <p className="text-center text-xs text-slate-600 mt-8">
            Free forever on the Starter plan. No credit card required.
          </p>
        </motion.div>
      </div>
    </div>
  );
}