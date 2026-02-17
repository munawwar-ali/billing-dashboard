import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <h1 className="display-4 mb-4">Multi-Tenant SaaS Billing API</h1>
            <p className="lead mb-4">
              A complete billing platform with usage tracking, rate limiting, and invoice generation.
            </p>
            
            <div className="row mt-5">
              <div className="col-md-4 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Multi-Tenancy</h5>
                    <p className="card-text">Complete tenant isolation with workspace management</p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Usage Tracking</h5>
                    <p className="card-text">Real-time API call tracking and quota management</p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Smart Billing</h5>
                    <p className="card-text">Tiered pricing with automated invoice generation</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Link href="/register" className="btn btn-primary btn-lg me-3">
                Get Started
              </Link>
              <Link href="/login" className="btn btn-outline-primary btn-lg">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}