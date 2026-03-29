import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './globals.css';

// Import Pages (Repurposing existing Next.js file structure)
import TenantManagement from './page';
import Dashboard from './dashboard/page';
import Billing from './billing/page';
import Usage from './usage/page';
import Login from './login/page';
import Register from './register/page';

function App() {
  return (
    <BrowserRouter>
      {/* Enterprise-grade Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#151e2e',
            color: '#e2e8f0',
            border: '1px solid #1E2738',
            fontFamily: '"DM Sans", sans-serif',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#0A0F1E' },
          },
          error: {
            iconTheme: { primary: '#f43f5e', secondary: '#0A0F1E' },
          },
        }}
      />
      <Routes>
        {/* Set Dashboard as default landing since marketing page is removed */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/tenants" element={<TenantManagement />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/usage" element={<Usage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Unified 404 Catch-all */}
        <Route path="*" element={
          <div className="min-h-screen bg-navy-900 flex flex-col items-center justify-center text-slate-200">
            <h1 className="text-6xl font-black mb-4 font-mono text-indigo-500">404</h1>
            <p className="text-slate-400 mb-8 max-w-sm text-center">The page you're looking for was either deleted or doesn't exist.</p>
            <a href="/dashboard" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-md font-medium transition-all shadow-lg shadow-indigo-500/20">
              Return to Dashboard
            </a>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

// Mount the React Application (acting as main.jsx)
const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

export default App;