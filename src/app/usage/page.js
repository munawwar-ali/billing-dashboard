'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getUsage, getUsageHistory } from '@/utils/api';

export default function UsagePage() {
  const [usage, setUsage] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usageRes, historyRes] = await Promise.all([
        getUsage(),
        getUsageHistory(),
      ]);

      setUsage(usageRes.data.data);
      setHistory(historyRes.data.data.history);
    } catch (error) {
      console.error('Error fetching usage data:', error);
    } finally {
      setLoading(false);
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

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="container mt-4">
        <h1 className="mb-4">API Usage</h1>

        {/* Current Usage */}
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Current Month ({usage?.month})</h5>
            
            <div className="row mt-3">
              <div className="col-md-3 mb-3">
                <div className="text-center">
                  <h2 className="text-primary">{usage?.used?.toLocaleString()}</h2>
                  <p className="text-muted mb-0">API Calls Used</p>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="text-center">
                  <h2 className="text-success">{usage?.remaining?.toLocaleString()}</h2>
                  <p className="text-muted mb-0">Calls Remaining</p>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="text-center">
                  <h2 className="text-info">{usage?.limit?.toLocaleString()}</h2>
                  <p className="text-muted mb-0">Monthly Limit</p>
                </div>
              </div>

              <div className="col-md-3 mb-3">
                <div className="text-center">
                  <h2 className={usage?.percentageUsed > 80 ? 'text-danger' : 'text-primary'}>
                    {usage?.percentageUsed}%
                  </h2>
                  <p className="text-muted mb-0">Usage Percentage</p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="progress" style={{ height: '25px' }}>
                <div
                  className={`progress-bar ${usage?.percentageUsed > 80 ? 'bg-danger' : 'bg-success'}`}
                  role="progressbar"
                  style={{ width: `${usage?.percentageUsed}%` }}
                >
                  {usage?.percentageUsed}%
                </div>
              </div>
            </div>

            {usage?.percentageUsed > 80 && (
              <div className="alert alert-warning mt-3 mb-0">
                <strong>Warning:</strong> You've used {usage?.percentageUsed}% of your monthly quota.
              </div>
            )}
          </div>
        </div>

        {/* Usage History */}
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Usage History</h5>
            
            {history.length === 0 ? (
              <p className="text-muted">No usage history available yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>API Calls</th>
                      <th>Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item, index) => (
                      <tr key={index}>
                        <td>{item.month}</td>
                        <td>{item.apiCallCount?.toLocaleString()}</td>
                        <td>{new Date(item.lastUpdated).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}