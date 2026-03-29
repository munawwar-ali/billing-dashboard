'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, animate } from 'framer-motion';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getUsage, getUsageHistory } from '@/utils/api';
import {
  Activity, TrendingUp, TrendingDown, AlertTriangle,
  Download, RefreshCw, Zap, Clock, AlertCircle, CheckCircle2,
  BarChart3, Calendar, ArrowUpRight
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import toast from 'react-hot-toast';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ── Animated counter hook ──────────────────────────────────────────────────
function useCountUp(target, duration = 1.4) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(0, target, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return controls.stop;
  }, [target, duration]);
  return display;
}

// ── SVG Arc Gauge ──────────────────────────────────────────────────────────
function ArcGauge({ percentage = 0 }) {
  const size = 280;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius; // half circle arc
  const cx = size / 2;
  const cy = size / 2 + 20;

  const isWarning = percentage > 80;
  const isDanger = percentage > 95;

  const accentColor = isDanger
    ? '#f43f5e'
    : isWarning
    ? '#f59e0b'
    : '#6366f1';

  const glowColor = isDanger
    ? 'rgba(244,63,94,0.4)'
    : isWarning
    ? 'rgba(245,158,11,0.4)'
    : 'rgba(99,102,241,0.4)';

  // Spring-animated offset
  const rawOffset = useMotionValue(circumference);
  const springOffset = useSpring(rawOffset, { stiffness: 60, damping: 18 });

  useEffect(() => {
    const target = circumference - (percentage / 100) * circumference;
    rawOffset.set(target);
  }, [percentage, circumference, rawOffset]);

  const displayPct = useCountUp(percentage);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size / 2 + 60 }}>
      <svg width={size} height={size / 2 + 40} viewBox={`0 0 ${size} ${size / 2 + 40}`}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track */}
        <path
          d={`M ${strokeWidth / 2} ${cy} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${cy}`}
          fill="none"
          stroke="#1e2738"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Progress */}
        <motion.path
          d={`M ${strokeWidth / 2} ${cy} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${cy}`}
          fill="none"
          stroke={accentColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: springOffset }}
          filter="url(#glow)"
        />

        {/* Tick marks */}
        {[0, 25, 50, 75, 100].map((tick) => {
          const angle = Math.PI - (tick / 100) * Math.PI;
          const x1 = cx + (radius - strokeWidth / 2 - 4) * Math.cos(angle);
          const y1 = cy - (radius - strokeWidth / 2 - 4) * Math.sin(angle);
          const x2 = cx + (radius + strokeWidth / 2 + 2) * Math.cos(angle);
          const y2 = cy - (radius + strokeWidth / 2 + 2) * Math.sin(angle);
          return (
            <line key={tick} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#2d3748" strokeWidth="1.5" strokeLinecap="round" />
          );
        })}
      </svg>

      {/* Center text */}
      <div className="absolute bottom-2 flex flex-col items-center">
        <motion.span
          className="text-5xl font-black font-mono leading-none"
          style={{ color: accentColor, textShadow: `0 0 20px ${glowColor}` }}
        >
          {displayPct}%
        </motion.span>
        <span className="text-slate-400 text-sm mt-1 font-medium">of monthly limit used</span>
        {isWarning && !isDanger && (
          <span className="mt-2 flex items-center gap-1 text-amber-400 text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" /> Approaching limit
          </span>
        )}
        {isDanger && (
          <span className="mt-2 flex items-center gap-1 text-rose-400 text-xs font-semibold">
            <AlertCircle className="w-3.5 h-3.5" /> Critical — upgrade now
          </span>
        )}
      </div>
    </div>
  );
}

// ── GitHub-style Heatmap ───────────────────────────────────────────────────
function UsageHeatmap({ history }) {
  const today = new Date();
  const weeks = 16;
  const days = weeks * 7;

  // Build a map of date → count from history
  const countMap = {};
  history.forEach((item) => {
    if (item.month) {
      const key = item.month; // "2025-01" style
      countMap[key] = (countMap[key] || 0) + (item.apiCallCount || 0);
    }
  });

  const maxCount = Math.max(...Object.values(countMap), 1);

  const cells = Array.from({ length: days }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (days - 1 - i));
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const count = countMap[monthKey] || 0;
    const intensity = count / maxCount;
    return { date, count, intensity };
  });

  function getColor(intensity) {
    if (intensity === 0) return '#1a2235';
    if (intensity < 0.25) return '#312e81';
    if (intensity < 0.5) return '#4338ca';
    if (intensity < 0.75) return '#6366f1';
    return '#818cf8';
  }

  const months = [];
  let lastMonth = null;
  cells.forEach((cell, i) => {
    const m = cell.date.toLocaleString('default', { month: 'short' });
    if (m !== lastMonth && i % 7 === 0) {
      months.push({ label: m, col: Math.floor(i / 7) });
      lastMonth = m;
    }
  });

  return (
    <div className="overflow-x-auto pb-2">
      <div className="relative" style={{ minWidth: weeks * 16 + 40 }}>
        {/* Month labels */}
        <div className="flex mb-1 ml-8">
          {months.map((m, i) => (
            <div
              key={i}
              className="text-[10px] text-slate-500 absolute"
              style={{ left: m.col * 16 + 32 }}
            >
              {m.label}
            </div>
          ))}
        </div>

        <div className="flex gap-0.5 mt-4">
          {/* Day labels */}
          <div className="flex flex-col gap-0.5 mr-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} className="text-[10px] text-slate-600 h-[14px] flex items-center">{d}</div>
            ))}
          </div>

          {/* Grid */}
          {Array.from({ length: weeks }, (_, w) => (
            <div key={w} className="flex flex-col gap-0.5">
              {Array.from({ length: 7 }, (_, d) => {
                const cell = cells[w * 7 + d];
                return (
                  <div
                    key={d}
                    title={`${cell.date.toDateString()}: ${cell.count.toLocaleString()} calls`}
                    className="w-[14px] h-[14px] rounded-[2px] cursor-pointer transition-all hover:ring-1 hover:ring-indigo-400/50"
                    style={{ background: getColor(cell.intensity) }}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-3 ml-8">
          <span className="text-[10px] text-slate-500">Less</span>
          {[0, 0.2, 0.45, 0.7, 1].map((v, i) => (
            <div key={i} className="w-3 h-3 rounded-[2px]" style={{ background: getColor(v) }} />
          ))}
          <span className="text-[10px] text-slate-500">More</span>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton loader ────────────────────────────────────────────────────────
function Skeleton({ className }) {
  return (
    <div className={cn('animate-pulse rounded-md bg-slate-800/60', className)} />
  );
}

// ── Stat card ──────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, color, delay = 0 }) {
  const num = useCountUp(typeof value === 'number' ? value : 0);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-[#0d1526] border border-border-subtle rounded-xl p-5 flex items-start gap-4"
    >
      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', color)}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 font-medium mb-1">{label}</p>
        <p className="text-2xl font-black font-mono text-slate-100 leading-none">
          {typeof value === 'number' ? num.toLocaleString() : value}
        </p>
        {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
      </div>
    </motion.div>
  );
}

// ── Endpoint row (mock breakdown table) ───────────────────────────────────
const MOCK_ENDPOINTS = [
  { endpoint: '/api/v1/invoices', calls: 12480, latency: '48ms', errors: '0.2%', cost: '$1.24', status: 'healthy' },
  { endpoint: '/api/v1/tenants', calls: 8920, latency: '32ms', errors: '0.0%', cost: '$0.89', status: 'healthy' },
  { endpoint: '/api/v1/usage', calls: 6340, latency: '61ms', errors: '1.1%', cost: '$0.63', status: 'warning' },
  { endpoint: '/api/v1/auth/token', calls: 4210, latency: '22ms', errors: '0.0%', cost: '$0.42', status: 'healthy' },
  { endpoint: '/api/v1/billing/generate', calls: 1980, latency: '190ms', errors: '2.8%', cost: '$0.20', status: 'critical' },
];

function StatusDot({ status }) {
  const map = {
    healthy: 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]',
    warning: 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]',
    critical: 'bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.6)]',
  };
  return <span className={cn('inline-block w-2 h-2 rounded-full shrink-0', map[status])} />;
}

// ══════════════════════════════════════════════════════════════════════════
//  PAGE COMPONENT
// ══════════════════════════════════════════════════════════════════════════
export default function UsagePage() {
  const [usage, setUsage] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (showToast = false) => {
    try {
      const [usageRes, historyRes] = await Promise.all([
        getUsage(),
        getUsageHistory(),
      ]);
      setUsage(usageRes.data.data);
      setHistory(historyRes.data.data.history || []);
      if (showToast) toast.success('Usage data refreshed');
    } catch (error) {
      toast.error('Failed to load usage data');
      console.error('Usage fetch error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData(true);
  };

  const pct = usage?.percentageUsed ?? 0;

  return (
    <ProtectedRoute>
      <Navbar />

      {/* Main content offset for sidebar */}
      <main className="md:ml-[240px] min-h-screen bg-[#080d1a] text-slate-200">
        <div className="px-6 md:px-10 py-8 max-w-7xl mx-auto">

          {/* ── Page Header ── */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">API Usage</h1>
              <p className="text-slate-500 text-sm mt-1">
                Real-time consumption for <span className="text-indigo-400 font-medium">{usage?.month ?? '—'}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 border border-border-subtle rounded-lg hover:bg-slate-700 transition-all disabled:opacity-50"
              >
                <RefreshCw className={cn('w-4 h-4', refreshing && 'animate-spin')} />
                Refresh
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20 transition-all">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </motion.div>

          {/* ── Top: Gauge + Stats ── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">

            {/* Gauge Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45 }}
              className="lg:col-span-2 bg-[#0d1526] border border-border-subtle rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden"
            >
              {/* Ambient glow */}
              <div className="absolute inset-0 bg-gradient-radial from-indigo-900/10 via-transparent to-transparent pointer-events-none" />

              {loading ? (
                <div className="flex flex-col items-center gap-4">
                  <Skeleton className="w-64 h-36 rounded-full" />
                  <Skeleton className="w-24 h-8" />
                </div>
              ) : (
                <ArcGauge percentage={pct} />
              )}

              <div className="w-full mt-4 grid grid-cols-3 gap-3 text-center">
                {[
                  { label: 'Used', value: usage?.used, color: 'text-indigo-400' },
                  { label: 'Limit', value: usage?.limit, color: 'text-slate-300' },
                  { label: 'Left', value: usage?.remaining, color: 'text-emerald-400' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-slate-800/40 rounded-lg px-2 py-3 border border-border-subtle">
                    <p className={cn('text-lg font-black font-mono leading-none', color)}>
                      {loading ? '—' : (value ?? 0).toLocaleString()}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Stat Cards */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-[88px] rounded-xl" />
                ))
              ) : (
                <>
                  <StatCard
                    label="Total API Calls"
                    value={usage?.used ?? 0}
                    sub="This billing period"
                    icon={Zap}
                    color="bg-indigo-500/10 text-indigo-400"
                    delay={0.1}
                  />
                  <StatCard
                    label="Calls Remaining"
                    value={usage?.remaining ?? 0}
                    sub="Before throttling"
                    icon={CheckCircle2}
                    color="bg-emerald-500/10 text-emerald-400"
                    delay={0.15}
                  />
                  <StatCard
                    label="Avg. Latency"
                    value="58ms"
                    sub="Across all endpoints"
                    icon={Clock}
                    color="bg-sky-500/10 text-sky-400"
                    delay={0.2}
                  />
                  <StatCard
                    label="Error Rate"
                    value="0.8%"
                    sub="Last 24 hours"
                    icon={AlertTriangle}
                    color="bg-amber-500/10 text-amber-400"
                    delay={0.25}
                  />
                </>
              )}
            </div>
          </div>

          {/* ── Endpoint Breakdown Table ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-[#0d1526] border border-border-subtle rounded-2xl mb-8 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-bold text-slate-200">Endpoint Breakdown</h2>
              </div>
              <span className="text-xs text-slate-500">Last 30 days</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-subtle">
                    {['Endpoint', 'API Calls', 'Avg Latency', 'Error Rate', 'Est. Cost', 'Status'].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MOCK_ENDPOINTS.map((row, i) => (
                    <motion.tr
                      key={row.endpoint}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 * i }}
                      className="border-b border-border-subtle/50 hover:bg-slate-800/30 transition-colors group"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-indigo-300 group-hover:text-indigo-200 transition-colors">
                        {row.endpoint}
                      </td>
                      <td className="px-6 py-4 font-mono font-semibold text-slate-200">
                        {row.calls.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-300">{row.latency}</td>
                      <td className="px-6 py-4 font-mono">
                        <span className={cn(
                          'text-xs font-bold',
                          parseFloat(row.errors) === 0 ? 'text-emerald-400' :
                          parseFloat(row.errors) < 1 ? 'text-amber-400' : 'text-rose-400'
                        )}>
                          {row.errors}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-300">{row.cost}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <StatusDot status={row.status} />
                          <span className="text-xs text-slate-400 capitalize">{row.status}</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* ── Heatmap ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-[#0d1526] border border-border-subtle rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-bold text-slate-200">Usage Activity</h2>
              </div>
              <span className="text-xs text-slate-500">Last 16 weeks</span>
            </div>
            {loading ? (
              <Skeleton className="w-full h-28" />
            ) : (
              <UsageHeatmap history={history} />
            )}
          </motion.div>

          {/* ── History Table ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="bg-[#0d1526] border border-border-subtle rounded-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border-subtle flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-slate-200">Historical Usage</h2>
            </div>

            {loading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <BarChart3 className="w-10 h-10 text-slate-700 mb-3" />
                <p className="text-slate-400 font-medium">No usage history yet</p>
                <p className="text-slate-600 text-sm mt-1">Start making API calls to see data here</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border-subtle">
                      {['Month', 'API Calls', 'vs Prior Month', 'Last Updated'].map((h) => (
                        <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item, i) => {
                      const prev = history[i + 1]?.apiCallCount ?? null;
                      const delta = prev !== null ? item.apiCallCount - prev : null;
                      const isUp = delta !== null && delta > 0;
                      return (
                        <tr
                          key={i}
                          className="border-b border-border-subtle/50 hover:bg-slate-800/20 transition-colors"
                        >
                          <td className="px-6 py-4 font-mono text-slate-300 font-medium">{item.month}</td>
                          <td className="px-6 py-4 font-mono font-bold text-slate-100">
                            {item.apiCallCount?.toLocaleString() ?? '—'}
                          </td>
                          <td className="px-6 py-4">
                            {delta !== null ? (
                              <span className={cn(
                                'flex items-center gap-1 text-xs font-semibold font-mono',
                                isUp ? 'text-rose-400' : 'text-emerald-400'
                              )}>
                                {isUp
                                  ? <TrendingUp className="w-3.5 h-3.5" />
                                  : <TrendingDown className="w-3.5 h-3.5" />
                                }
                                {isUp ? '+' : ''}{delta.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-slate-600 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-slate-500 text-xs">
                            {new Date(item.lastUpdated).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric'
                            })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>

        </div>
      </main>
    </ProtectedRoute>
  );
}