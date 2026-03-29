import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, Activity, DollarSign, Percent, 
  ArrowUpRight, ArrowDownRight, Zap, RefreshCcw
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import Navbar from '../../components/Navbar';
import ProtectedRoute from '../../components/ProtectedRoute';
import { getTenant, getUsage, getDemoData } from '../../utils/api';
import { getAuth } from '../../utils/auth';

const mockChartData = [
  { name: 'Mon', calls: 4000 },
  { name: 'Tue', calls: 3000 },
  { name: 'Wed', calls: 2000 },
  { name: 'Thu', calls: 2780 },
  { name: 'Fri', calls: 1890 },
  { name: 'Sat', calls: 2390 },
  { name: 'Sun', calls: 3490 },
];

const mockTenantUsage = [
  { name: 'Acme Corp', calls: 850000 },
  { name: 'Global Tech', calls: 95000 },
  { name: 'Oscorp', calls: 45000 },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testLoading, setTestLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tenantRes, usageRes] = await Promise.all([
        getTenant(),
        getUsage(),
      ]);
      setTenant(tenantRes.data.data);
      setUsage(usageRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestAPI = async () => {
    setTestLoading(true);
    try {
      await getDemoData();
      const usageRes = await getUsage();
      setUsage(usageRes.data.data);
    } catch (error) {
      // Errors handled globally by interceptor toast
    } finally {
      setTestLoading(false);
    }
  };

  const auth = getAuth();

  if (loading) {
    return (
      <ProtectedRoute>
        <Navbar />
        <div className="flex flex-col gap-6 w-full animate-pulse">
          <div className="h-8 bg-slate-800 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-800 rounded-xl"></div>)}
          </div>
          <div className="h-96 bg-slate-800 rounded-xl w-full"></div>
        </div>
      </ProtectedRoute>
    );
  }

  const kpis = [
    { label: 'Total API Calls', value: usage?.used?.toLocaleString() || '0', icon: Activity, trend: '+12.5%', isUp: true },
    { label: 'Active Tenants', value: '5', icon: Building2, trend: '+2', isUp: true },
    { label: 'Revenue This Month', value: '$4,250', icon: DollarSign, trend: '-2.4%', isUp: false },
    { label: 'Usage Limit', value: `${usage?.percentageUsed || 0}%`, icon: Percent, trend: '+1.2%', isUp: true },
  ];

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard Overview</h1>
          <p className="text-slate-400 text-sm mt-1">Welcome back, {auth.user?.name || auth.user?.email}</p>
        </div>
        
        <button
          onClick={handleTestAPI}
          disabled={testLoading}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
        >
          {testLoading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          Test API Call
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={kpi.label} 
            className="bg-slate-850 border border-border-subtle rounded-xl p-5 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-indigo-500/10"></div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="w-10 h-10 rounded-lg bg-navy-900 border border-border-subtle flex items-center justify-center">
                <kpi.icon className="w-5 h-5 text-indigo-400" />
              </div>
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md ${kpi.isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                {kpi.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {kpi.trend}
              </span>
            </div>
            <div className="relative z-10">
              <h3 className="text-slate-400 text-sm font-medium">{kpi.label}</h3>
              <p className="text-2xl font-bold text-white mt-1 uppercase tracking-tight font-mono">{kpi.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-slate-850 border border-border-subtle rounded-xl p-5 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white">API Usage Trends</h2>
            <div className="flex bg-navy-900 rounded-lg p-1 border border-border-subtle">
              {['24h', '7d', '30d', '90d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${timeRange === range ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} dy={10} />
                <YAxis tickLine={false} axisLine={false} dx={-10} tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#151e2e', border: '1px solid #1E2738', borderRadius: '8px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="calls" 
                  stroke="#6366F1" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#6366F1', strokeWidth: 2, stroke: '#0A0F1E' }} 
                  activeDot={{ r: 6 }} 
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Tenants Bar Chart */}
        <div className="bg-slate-850 border border-border-subtle rounded-xl p-5 shadow-xl">
          <h2 className="text-lg font-semibold text-white mb-6">Top Tenants by Usage</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockTenantUsage} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: '#151e2e', border: '1px solid #1E2738', borderRadius: '8px' }}
                />
                <Bar dataKey="calls" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={24} animationDuration={1500} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Invoices Table */}
      <div className="mt-8 bg-slate-850 border border-border-subtle rounded-xl shadow-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border-subtle flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Recent Invoices</h2>
          <button onClick={() => navigate('/billing')} className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            View All →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-navy-900/50 text-slate-400 border-b border-border-subtle">
              <tr>
                <th className="px-6 py-3 font-medium">Invoice Number</th>
                <th className="px-6 py-3 font-medium">Organization</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {['INV-2024-001', 'INV-2024-002', 'INV-2024-003'].map((inv, i) => (
                <tr key={inv} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-slate-300">{inv}</td>
                  <td className="px-6 py-4 font-medium text-slate-200">Acme Corp</td>
                  <td className="px-6 py-4 text-slate-300">$1,250.00</td>
                  <td className="px-6 py-4 text-slate-400">Oct 1, 2024</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${i === 0 ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                      {i === 0 ? 'Overdue' : 'Paid'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
}