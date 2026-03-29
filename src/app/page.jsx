import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Search, Filter, Plus, MoreHorizontal, 
  CheckCircle2, XCircle, X, ChevronRight, FileDown,
  Trash2, Mail
} from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import Navbar from '../components/Navbar';
import ProtectedRoute from '../components/ProtectedRoute';

// Dummy data for the management page
const MOCK_TENANTS = [
  { id: '1', name: 'Acme Corp', plan: 'Enterprise', usage: 850000, limit: 1000000, status: 'active', createdAt: '2023-10-15' },
  { id: '2', name: 'Global Tech', plan: 'Pro', usage: 95000, limit: 100000, status: 'active', createdAt: '2023-11-02' },
  { id: '3', name: 'Stark Industries', plan: 'Enterprise', usage: 2000000, limit: 5000000, status: 'active', createdAt: '2024-01-20' },
  { id: '4', name: 'Wayne Enterprises', plan: 'Starter', usage: 12000, limit: 10000, status: 'suspended', createdAt: '2024-02-14' },
  { id: '5', name: 'Oscorp', plan: 'Pro', usage: 45000, limit: 100000, status: 'active', createdAt: '2024-03-01' },
];

export default function TenantManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [selectedTenants, setSelectedTenants] = useState([]);
  
  const toggleSelectAll = (e) => {
    if (e.target.checked) setSelectedTenants(MOCK_TENANTS.map(t => t.id));
    else setSelectedTenants([]);
  };

  const toggleSelect = (id) => {
    if (selectedTenants.includes(id)) setSelectedTenants(selectedTenants.filter(t => t !== id));
    else setSelectedTenants([...selectedTenants, id]);
  };

  const filteredTenants = MOCK_TENANTS.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <Navbar />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-400" />
            Tenants
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage organizations, usage limits, and billing plans.</p>
        </div>
        <button 
          onClick={() => setIsSlideOverOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" /> Add Tenant
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-slate-850 border border-border-subtle rounded-t-lg p-4 flex flex-col sm:flex-row gap-4 justify-between items-center relative overflow-hidden">
        
        {/* Bulk Actions overlay (slides in if items selected) */}
        <AnimatePresence>
          {selectedTenants.length > 0 && (
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="absolute inset-0 bg-indigo-900/40 backdrop-blur-sm border-b border-indigo-500/30 flex items-center justify-between px-6 z-10"
            >
              <span className="text-indigo-200 font-medium text-sm">
                <span className="text-white font-bold">{selectedTenants.length}</span> tenants selected
              </span>
              <div className="flex gap-2">
                <button className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors">
                  <Mail className="w-3.5 h-3.5" /> Email
                </button>
                <button className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors">
                  <FileDown className="w-3.5 h-3.5" /> Export
                </button>
                <button className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 w-full sm:max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text"
            placeholder="Search tenants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-navy-900 border border-border-subtle rounded-md pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none bg-navy-900 border border-border-subtle hover:bg-slate-800 text-slate-300 px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-slate-850 border-x border-b border-border-subtle rounded-b-lg overflow-x-auto shadow-xl">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-navy-900/50 text-slate-400 border-b border-border-subtle">
            <tr>
              <th className="px-5 py-3 font-medium w-10">
                <input 
                  type="checkbox" 
                  checked={selectedTenants.length === MOCK_TENANTS.length}
                  onChange={toggleSelectAll}
                  className="rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500/50 focus:ring-offset-navy-900"
                />
              </th>
              <th className="px-5 py-3 font-medium">Organization</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Plan</th>
              <th className="px-5 py-3 font-medium w-64">API Usage (Month)</th>
              <th className="px-5 py-3 font-medium text-right">Created</th>
              <th className="px-5 py-3 font-medium w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {filteredTenants.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-5 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                      <Search className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-slate-300 font-medium">No tenants found</p>
                      <p className="text-xs mt-1">Try adjusting your search query.</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              filteredTenants.map((item, i) => {
                const isSelected = selectedTenants.includes(item.id);
                const usagePercent = Math.min((item.usage / item.limit) * 100, 100);
                const isNearingLimit = usagePercent > 85;
                const isOverLimit = usagePercent >= 100;
                
                return (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={item.id} 
                    className={`hover:bg-slate-800/50 transition-colors ${isSelected ? 'bg-indigo-500/5' : ''}`}
                  >
                    <td className="px-5 py-4">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => toggleSelect(item.id)}
                        className="rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500/50 focus:ring-offset-navy-900"
                      />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                          {item.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-200">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {item.status === 'active' ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <XCircle className="w-3.5 h-3.5" /> Suspended
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-block px-2 py-1 rounded bg-slate-800 text-xs font-medium text-slate-300 border border-border-subtle">
                        {item.plan}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="w-full">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-slate-400 font-mono">{item.usage.toLocaleString()} / {item.limit.toLocaleString()}</span>
                          <span className={`${isOverLimit ? 'text-rose-400' : isNearingLimit ? 'text-amber-400' : 'text-slate-400'} font-medium`}>
                            {Math.round(usagePercent)}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-navy-900 rounded-full overflow-hidden border border-border-subtle">
                          <div 
                            className={`h-full rounded-full ${isOverLimit ? 'bg-rose-500' : isNearingLimit ? 'bg-amber-400' : 'bg-indigo-500'}`}
                            style={{ width: `${usagePercent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right text-slate-400 font-mono text-xs">
                      {item.createdAt}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Menu as="div" className="relative inline-block text-left">
                        <Menu.Button className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </Menu.Button>
                        <Transition
                          as={React.Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-slate-800 border border-border-subtle shadow-xl focus:outline-none z-20">
                            <div className="p-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <button className={`${active ? 'bg-slate-700 text-white' : 'text-slate-300'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                                    View details
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button className={`${active ? 'bg-slate-700 text-white' : 'text-slate-300'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                                    Edit settings
                                  </button>
                                )}
                              </Menu.Item>
                              <div className="h-px bg-border-subtle my-1" />
                              <Menu.Item>
                                {({ active }) => (
                                  <button className={`${active ? 'bg-rose-500/20 text-rose-400' : 'text-rose-500'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                                    Suspend tenant
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Tenant Slide-over Panel */}
      <AnimatePresence>
        {isSlideOverOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSlideOverOpen(false)}
              className="fixed inset-0 bg-navy-900/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 max-w-md w-full bg-slate-850 border-l border-border-subtle shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
                <h2 className="text-lg font-semibold text-white">Add New Tenant</h2>
                <button 
                  onClick={() => setIsSlideOverOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <h3 className="text-sm border-b border-border-subtle pb-2 mb-4 font-semibold text-indigo-400">1. Organization Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">Company Name</label>
                      <input type="text" className="w-full bg-navy-900 border border-border-subtle rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="e.g. Acme Corp" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">Admin Email</label>
                      <input type="email" className="w-full bg-navy-900 border border-border-subtle rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="admin@acme.com" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm border-b border-border-subtle pb-2 mb-4 font-semibold text-indigo-400 mt-8">2. Subscription Plan</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {['Starter', 'Pro', 'Enterprise', 'Custom'].map((plan) => (
                      <div key={plan} className="border border-border-subtle bg-navy-900 hover:border-indigo-500 cursor-pointer rounded-lg p-3 transition-colors">
                        <div className="font-medium text-slate-200">{plan}</div>
                        <div className="text-xs text-slate-500 mt-1">Select</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-border-subtle bg-slate-900 flex justify-end gap-3">
                <button 
                  onClick={() => setIsSlideOverOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-md text-white text-sm font-medium flex items-center gap-2 shadow-lg shadow-indigo-500/20">
                  Create Tenant <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ProtectedRoute>
  );
}