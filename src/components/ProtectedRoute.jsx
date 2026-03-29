import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-navy-900 flex text-slate-200">
      {/* Wrapper to assure children render next to the fixed 240px sidebar */}
      <main className="flex-1 md:ml-[240px] flex flex-col min-w-0">
        {/* We account for the 64px (h-16) topbar height by padding top */}
        <div className="flex-1 p-6 md:p-10 pt-24 md:pt-24 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}