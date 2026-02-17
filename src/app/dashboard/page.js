'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getTenant, getUsage, getDemoData } from '@/utils/api';
import { getAuth } from '@/utils/auth';

export default function DashboardPage() {
  const router = useRouter();
  const [tenant, setTenant] = useState(null);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testLoading, setTestLoading] = useState(false);
  const [testMessage, setTestMessage] = useState('');

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
    setTestMessage('');
    
    try {
      await getDemoData();
      setTestMessage('API call successful! Usage updated.');
      
      // Refresh usage data
      const usageRes = await getUsage();
      setUsage(usageRes.data.data);
    } catch (error) {
      if (error.response?.status === 429) {
        setTestMessage('Rate limit exceeded! Try again next month.');
      } else {
        setTestMessage('API call failed: ' + error.message);
      }
    } finally {
      setTestLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Navbar />
        <div className="container mt-5 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const auth = getAuth();

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="container mt-4">
        <h1 className="mb-4">Dashboard</h1>

        <div className="row">
          {/* Tenant Info */}
          <div className="col-md-6 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Organization</h5>
                <p className="mb-1"><strong>Name:</strong> {tenant?.name}</p>
                <p className="mb-1"><strong>Plan:</strong> <span className="badge bg-primary">{tenant?.plan}</span></p>
                <p className="mb-0"><strong>User:</strong> {auth.user?.email}</p>
              </div>
            </div>
          </div>

          {/* Usage Info */}
          <div className="col-md-6 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">API Usage ({usage?.month})</h5>
                <div className="mb-2">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Used: {usage?.used?.toLocaleString()} / {usage?.limit?.toLocaleString()}</span>
                    <span>{usage?.percentageUsed}%</span>
                  </div>
                  <div className="progress">
                    <div
                      className={`progress-bar ${usage?.percentageUsed > 80 ? 'bg-danger' : 'bg-success'}`}
                      role="progressbar"
                      style={{ width: `${usage?.percentageUsed}%` }}
                    ></div>
                  </div>
                </div>
                <p className="mb-0 text-muted">Remaining: {usage?.remaining?.toLocaleString()} calls</p>
              </div>
            </div>
          </div>
        </div>

        {/* Test API Call */}
        <div className="card mt-3">
          <div className="card-body">
            <h5 className="card-title">Test API Call</h5>
            <p className="card-text">
              Click the button below to make a test API call. This will increment your usage counter.
            </p>
            <button
              className="btn btn-primary"
              onClick={handleTestAPI}
              disabled={testLoading}
            >
              {testLoading ? 'Calling API...' : 'Make Test API Call'}
            </button>
            
            {testMessage && (
              <div className={`alert ${testMessage.includes('failed') || testMessage.includes('exceeded') ? 'alert-danger' : 'alert-success'} mt-3`}>
                {testMessage}
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="row mt-4">
          <div className="col-md-4 mb-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Usage Details</h5>
                <p className="card-text">View detailed usage statistics and history</p>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => router.push('/usage')}
                >
                  View Usage
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Billing</h5>
                <p className="card-text">Manage invoices and billing information</p>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => router.push('/billing')}
                >
                  View Billing
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">API Limit</h5>
                <p className="card-text">Monthly limit based on your plan</p>
                <h3 className="text-primary">{usage?.limit?.toLocaleString()}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}