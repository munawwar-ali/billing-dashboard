'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getInvoices, calculateInvoice } from '@/utils/api';
import { getAuth } from '@/utils/auth';

export default function BillingPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await getInvoices();
      setInvoices(response.data.data.invoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInvoice = async () => {
    setGenerating(true);
    setMessage('');

    try {
      await calculateInvoice();
      setMessage('Invoice generated successfully!');
      
      // Refresh invoices
      await fetchInvoices();
    } catch (error) {
      if (error.response?.status === 403) {
        setMessage('Only admins can generate invoices.');
      } else if (error.response?.status === 400) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Failed to generate invoice.');
      }
    } finally {
      setGenerating(false);
    }
  };

  const auth = getAuth();
  const isAdmin = auth.user?.role === 'admin';

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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Billing & Invoices</h1>
          
          {isAdmin && (
            <button
              className="btn btn-primary"
              onClick={handleGenerateInvoice}
              disabled={generating}
            >
              {generating ? 'Generating...' : 'Generate Invoice'}
            </button>
          )}
        </div>

        {message && (
          <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>
            {message}
          </div>
        )}

        {/* Pricing Tiers */}
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Pricing Tiers</h5>
            <div className="row mt-3">
              <div className="col-md-4">
                <div className="card border-success">
                  <div className="card-body text-center">
                    <h6 className="text-success">Tier 1: Free</h6>
                    <p className="mb-0">0 - 10,000 calls</p>
                    <h4 className="text-success">$0</h4>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card border-primary">
                  <div className="card-body text-center">
                    <h6 className="text-primary">Tier 2: Standard</h6>
                    <p className="mb-0">10,001 - 100,000 calls</p>
                    <h4 className="text-primary">$0.001 / call</h4>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card border-warning">
                  <div className="card-body text-center">
                    <h6 className="text-warning">Tier 3: Premium</h6>
                    <p className="mb-0">100,000+ calls</p>
                    <h4 className="text-warning">$0.0005 / call</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoices List */}
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Invoice History</h5>
            
            {invoices.length === 0 ? (
              <p className="text-muted">No invoices generated yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>API Calls</th>
                      <th>Amount Due</th>
                      <th>Status</th>
                      <th>Invoice ID</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td>{invoice.month}</td>
                        <td>{invoice.totalCalls?.toLocaleString()}</td>
                        <td>${invoice.amountDue?.toFixed(2)}</td>
                        <td>
                          <span className={`badge bg-${invoice.status === 'paid' ? 'success' : invoice.status === 'pending' ? 'warning' : 'danger'}`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td>
                          <code>{invoice.stripeInvoiceId}</code>
                        </td>
                        <td>{new Date(invoice.createdAt).toLocaleDateString()}</td>
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