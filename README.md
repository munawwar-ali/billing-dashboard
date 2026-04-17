# Multi-Tenant SaaS Billing Dashboard

A production-ready, enterprise-grade billing dashboard built with React (Vite), Tailwind CSS, and Framer Motion. The frontend for the [billing-api](https://github.com/munawwar-ali/billing-api) backend.

🔗 **Live Demo:** [https://billing-dashboard-n4j6.vercel.app](https://billing-dashboard-n4j6.vercel.app)
🔗 **API Base URL:** [https://billing-api-wyr9.onrender.com](https://billing-api-wyr9.onrender.com)

---

## Overview

This dashboard provides a complete UI for a multi-tenant SaaS billing system. Organizations can register, monitor real-time API usage, manage billing tiers, and generate invoices — all from a single, high-performance React application.

The UI is designed to MNC-grade standards, inspired by Stripe, Linear, and Vercel — featuring a deep navy + indigo design system, glassmorphism cards, Framer Motion micro-interactions, and full mobile responsiveness.

---

## ✨ Features

- **Enterprise UI/UX** — Dark navy design system with indigo accents, custom typography, and polished micro-interactions
- **Multi-Tenant Dashboard** — Tenant management with data isolation, plan badges, and usage indicators
- **Real-time API Usage** — SVG arc gauge, GitHub-style activity heatmap, endpoint breakdown table
- **Billing & Invoices** — Invoice history table with status badges (paid/pending/overdue), tier pricing cards
- **Authentication** — Split-screen login/register with floating labels, password strength meter, and shake-on-error animations
- **Protected Routes** — JWT-based route protection with automatic redirect
- **Toast Notifications** — Global success/error feedback via react-hot-toast
- **Skeleton Loaders** — Every async state has a designed skeleton — no raw spinners
- **Mobile Responsive** — Sidebar collapses to bottom nav on mobile

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 (Vite) | UI framework and build tool |
| React Router DOM v7 | Client-side routing |
| Tailwind CSS v4 | Utility-first styling |
| Framer Motion | Page transitions and micro-animations |
| Recharts | API usage charts and sparklines |
| Axios | HTTP client with interceptors |
| react-hot-toast | Toast notification system |
| Lucide React | Icon library |
| @headlessui/react | Accessible dropdown menus |
| clsx + tailwind-merge | Conditional class utilities |

---

## Project Structure

```
billing-dashboard/
├── public/
│   └── index.html                  ← Vite HTML entry point
├── src/
│   ├── app/
│   │   ├── layout.jsx              ← App root: BrowserRouter, Routes, Toaster
│   │   ├── globals.css             ← Tailwind directives + design tokens
│   │   ├── page.jsx                ← Tenant Management page
│   │   ├── dashboard/
│   │   │   └── page.jsx            ← KPI dashboard with charts
│   │   ├── usage/
│   │   │   └── page.jsx            ← API usage gauge + heatmap
│   │   ├── billing/
│   │   │   └── page.jsx            ← Invoices + pricing tiers
│   │   ├── login/
│   │   │   └── page.jsx            ← Split-screen login
│   │   └── register/
│   │       └── page.jsx            ← Split-screen register
│   ├── components/
│   │   ├── Navbar.jsx              ← Sidebar + topbar + mobile nav
│   │   └── ProtectedRoute.jsx      ← Auth guard component
│   └── utils/
│       ├── api.js                  ← Axios instance + all API functions
│       └── auth.js                 ← localStorage auth helpers
├── next.config.mjs                 ← Vite config (repurposed file)
└── package.json
```

---

## Pages

### 🔐 Login & Register
Split-screen layout with animated gradient mesh on the brand panel and a clean form on the right.
- Floating label inputs with focus glow
- Password strength meter with animated segments (Register)
- Framer Motion shake animation on failed validation
- Auto-redirect if already authenticated
- Google + GitHub OAuth placeholders

### 📊 Dashboard
Main activity overview with real-time data from the API.
- 4 KPI cards with count-up animations: Total API Calls, Active Tenants, Revenue, Usage %
- API Usage Trends line chart with time range selector (24h / 7d / 30d / 90d)
- Top Tenants by Usage horizontal bar chart
- Recent Invoices table with status badges
- "Test API Call" button to simulate usage tracking

### 🏢 Tenant Management
Full tenant directory with search, filters, and actions.
- Data table with plan badges, usage progress bars, status indicators
- Slide-over panel for tenant details
- Bulk select with action toolbar

### ⚡ API Usage
Deep-dive into API consumption metrics.
- SVG arc gauge with spring physics animation (color shifts: indigo → amber → rose)
- 4 stat cards: Total Calls, Remaining, Avg Latency, Error Rate
- Endpoint breakdown table with latency, error rate, and status dot glow
- GitHub-style 16-week activity heatmap calendar
- Historical usage table with month-over-month trend arrows

### 💳 Billing & Invoices
Invoice management and pricing tier overview.
- 3 pricing tier cards: Starter / Pro / Enterprise with hover glow effects
- Invoice history table: invoice ID, billing period, API calls, amount, status badge, download button
- Generate Invoice button (admin only)
- Empty state with icon + message

---

## Design System

| Token | Value |
|-------|-------|
| Background | `#080d1a` / `#0A0F1E` |
| Surface | `#0d1526` / `#151e2e` |
| Border | `#1E2738` |
| Primary Accent | `#6366F1` (Indigo) |
| Secondary Accent | `#8B5CF6` (Violet) |
| Success | `#10b981` (Emerald) |
| Warning | `#f59e0b` (Amber) |
| Danger | `#f43f5e` (Rose) |
| Display Font | DM Sans |
| Mono Font | JetBrains Mono |

---

## Local Setup

### Prerequisites
- Node.js 18+
- The [billing-api](https://github.com/munawwar-ali/billing-api) backend running locally

### Installation

```bash
# Clone the repo
git clone https://github.com/munawwar-ali/billing-dashboard.git
cd billing-dashboard

# Install dependencies
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:5000/api" > .env.local

# Start development server
npm run dev
```

App runs at `http://localhost:3000`

### Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## API Integration

All API calls are centralized in `src/utils/api.js` using an Axios instance with:
- **Base URL** from `VITE_API_URL` environment variable
- **Request interceptor** — automatically attaches JWT token from localStorage
- **Response interceptor** — triggers toast notifications on 500+ errors
- **Named exports** for every endpoint

| Function | Method | Endpoint |
|----------|--------|----------|
| `login(data)` | POST | `/auth/login` |
| `register(data)` | POST | `/auth/register` |
| `getTenant()` | GET | `/tenant` |
| `getUsage()` | GET | `/usage` |
| `getUsageHistory()` | GET | `/usage/history` |
| `getInvoices()` | GET | `/billing/invoices` |
| `calculateInvoice()` | POST | `/billing/calculate` |
| `getDemoData()` | GET | `/demo/data` |

---

## Migration Notes

> This project was originally built with **Next.js 15 + Bootstrap 5** and was fully migrated to **React (Vite) + Tailwind CSS v4** while keeping the existing file and folder structure intact.

Key changes made during migration:
- Replaced `next/navigation` → `react-router-dom` (`useNavigate`, `useParams`, `Link`)
- Replaced `next/link` → `<Link to="...">` from React Router
- Replaced `pages/` file-system routing → `<Routes><Route>` in `layout.jsx`
- Replaced Bootstrap 5 classes → Tailwind CSS utility classes
- Replaced `next.config.mjs` content → Vite `defineConfig`
- Added `public/index.html` as Vite entry point
- Removed `'use client'` directives (not needed in Vite React)

---

## Author

**Munawwar Ali**
Full Stack Developer
[GitHub](https://github.com/munawwar-ali)