'use client';

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { login } from '@/utils/api';
import { saveAuth, getAuth } from '@/utils/auth';
import { Activity, Eye, EyeOff, ArrowRight, Zap, Shield, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ── Floating label input ───────────────────────────────────────────────────
function FloatingInput({ id, name, type = 'text', value, onChange, label, error, children }) {
  const [focused, setFocused] = useState(false);
  const isLifted = focused || value.length > 0;

  return (
    <div className="relative">
      <div
        className={cn(
          'relative rounded-lg border bg-slate-900/60 transition-all duration-200',
          focused ? 'border-indigo-500 ring-1 ring-indigo-500/40' : 'border-border-subtle',
          error ? 'border-rose-500/70 ring-1 ring-rose-500/20' : ''
        )}
      >
        <label
          htmlFor={id}
          className={cn(
            'absolute left-4 transition-all duration-200 pointer-events-none font-medium',
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
          className="w-full bg-transparent pt-6 pb-2.5 px-4 text-sm text-white outline-none font-medium placeholder-transparent"
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

// ── Animated background orbs ───────────────────────────────────────────────
function BrandPanel() {
  const features = [
    { icon: Zap, text: 'Real-time API usage tracking across all tenants' },
    { icon: BarChart3, text: 'Automated invoice generation and billing reports' },
    { icon: Shield, text: 'Isolated tenant data with enterprise-grade security' },
  ];

  return (
    <div className="hidden lg:flex lg:w-1/2 relative bg-[#070c18] flex-col justify-between p-12 overflow-hidden">

      {/* Animated gradient orbs */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-80px] left-[-80px] w-[480px] h-[480px] rounded-full bg-indigo-600/20 blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -20, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-[-100px] right-[-60px] w-[400px] h-[400px] rounded-full bg-violet-600/15 blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, 15, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-indigo-500/8 blur-[80px] pointer-events-none"
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(to right, #6366f1 1px, transparent 1px)',
          backgroundSize: '48px 48px',
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
            Enterprise billing,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              simplified.
            </span>
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm">
            Manage multi-tenant API usage, generate invoices, and track revenue — all from one powerful dashboard.
          </p>
        </div>

        {/* Feature list */}
        <div className="space-y-5">
          {features.map(({ icon: Icon, text }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.12 }}
              className="flex items-start gap-4"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-indigo-400" />
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom badge */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/60 border border-border-subtle text-xs text-slate-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          All systems operational · 99.9% uptime SLA
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  PAGE COMPONENT
// ══════════════════════════════════════════════════════════════════════════
export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

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
    if (!formData.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Enter a valid email';
    if (!formData.password) errs.password = 'Password is required';
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
      const response = await login(formData);
      const { token, user, tenant } = response.data.data;
      saveAuth(token, user, tenant);
      toast.success(`Welcome back, ${user?.name || 'there'}!`);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials. Please try again.';
      setErrors({ form: msg });
      setShake(true);
      setTimeout(() => setShake(false), 500);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#080d1a]">
      {/* Left: Brand Panel */}
      <BrandPanel />

      {/* Right: Login Form */}
      <div className="flex-1 lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-20 py-12 relative">

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
            <h2 className="text-2xl font-black text-white tracking-tight mb-2">Sign in to your account</h2>
            <p className="text-slate-500 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Create one free
              </Link>
            </p>
          </div>

          {/* Form error */}
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
              id="email"
              name="email"
              type="email"
              label="Email address"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <FloatingInput
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            >
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-500 hover:text-slate-300 transition-colors p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </FloatingInput>

            {/* Remember me + Forgot */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border-subtle bg-slate-800 text-indigo-500 focus:ring-indigo-500/40 focus:ring-1 accent-indigo-500"
                />
                <span className="text-sm text-slate-400">Remember me</span>
              </label>
              <button type="button" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-bold text-sm text-white transition-all mt-2',
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
                  Signing in…
                </>
              ) : (
                <>
                  Sign in <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border-subtle" />
            <span className="text-xs text-slate-600 font-medium">OR CONTINUE WITH</span>
            <div className="flex-1 h-px bg-border-subtle" />
          </div>

          {/* OAuth placeholders */}
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
            By signing in, you agree to our{' '}
            <span className="text-slate-500 hover:text-slate-400 cursor-pointer transition-colors">Terms</span>{' '}
            and{' '}
            <span className="text-slate-500 hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}