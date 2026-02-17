import 'bootstrap/dist/css/bootstrap.min.css';

export const metadata = {
  title: 'Billing API Dashboard',
  description: 'Multi-tenant SaaS billing dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}