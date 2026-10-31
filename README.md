# 💼 AppTracker — Modern Job Application Tracker

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20Database-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?logo=react-query&logoColor=white)](https://tanstack.com/query)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A fast, intuitive, and feature-rich job application management platform designed to help job seekers organize their pipeline, track interview stages, visualize analytics, and land their dream jobs without spreadsheet clutter.

---

## ✨ Features

### 📋 Multi-View Application Management
- **Kanban Board**: Drag-and-drop job cards across customizable stages (`Wishlist`, `Applied`, `Interviewing`, `Offer`, `Rejected`) powered by `@hello-pangea/dnd`.
- **Table View**: High-density spreadsheet-like table with sorting, search, column filters, and quick status changes.
- **Calendar View**: Visual monthly schedule showing upcoming interview rounds, application deadlines, and follow-ups.
- **Timeline View**: Chronological audit trail showing past and scheduled events across all applications.

### 📊 Deep Analytics & Metrics
- **Interactive Charts**: Application progression, status distribution, and timeline trends powered by **Recharts**.
- **Real-Time KPIs**: Quick overview bar displaying total jobs, active interviews, response rates, and offers.

### 🎯 Interview Preparation & Follow-Up
- **Interview Scheduler**: Add interview rounds with stage name, date, time, interviewer info, and direct meeting links (Google Meet, Zoom, Teams).
- **Checklist**: Built-in checklist for preparation tasks (research, resume tailoring, portfolio prep, thank-you notes).
- **Email Composer**: In-app draft email composer for quick outreach and follow-ups.
- **Offer Celebrations**: Confetti celebrations (`canvas-confetti`) when an offer is accepted!

### 🔐 Supabase Authentication & Real-time Persistence
- **Secure Auth**: Email/password authentication and one-click Google OAuth sign-in.
- **Row-Level Security (RLS)**: Applications, interview schedules, recruiter contacts, and activity logs are strictly scoped to the authenticated user.
- **Smooth UX Transitions**: Skeleton loaders and smooth Framer Motion transitions prevent layout shifting during session and data hydration.

### 💾 Backup, Export & Demo Data
- **JSON Export / Import**: Download a full JSON backup of your application data or migrate data between accounts.
- **Demo Data Generator**: 1-click mock data seeder to test and explore the app instantly.

### 🎨 Polished Design & Accessibility
- **Dark & Light Mode**: Seamless theme switching with persistent user preference stored via **Zustand**.
- **Mobile-Responsive**: Dedicated mobile bottom sheet and status tabs optimized for touch screens.
- **Tailwind CSS v4 & Lucide Icons**: Modern typography with Geist Variable font and sleek iconography.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Core** | [React 19](https://react.dev/), [Vite](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), `@tailwindcss/typography` |
| **Icons & Typography** | [Lucide React](https://lucide.dev/), [@tabler/icons-react](https://tabler.io/icons), [Geist Variable](https://fontsource.org/fonts/geist) |
| **State & Data Fetching** | [TanStack React Query v5](https://tanstack.com/query), [Zustand](https://github.com/pmndrs/zustand) |
| **Animations & DnD** | [Framer Motion](https://www.framer.com/motion/), [@hello-pangea/dnd](https://github.com/hello-pangea/dnd), `canvas-confetti` |
| **Charts** | [Recharts](https://recharts.org/) |
| **Backend & Auth** | [Supabase](https://supabase.com/) (PostgreSQL, Auth, RLS) |
| **Linting & Quality** | [Oxlint](https://oxc.rs/) |

---

## 📁 Project Structure

```text
src/
├── components/
│   ├── layout/            # Shell chrome: Sidebar, TopBar, ControlsBar, LogoutModal, Skeleton
│   └── ui/                # Centralized, reusable primitive UI components (Button, Input, Card, etc.)
├── data/                  # Static definitions and initial mock dataset
├── features/
│   ├── analytics/         # Analytics charts, metric hooks, and summary bars
│   ├── auth/              # Supabase Auth modal, OAuth hooks, context, and guards
│   └── jobs/              # Job views (Kanban, Table, Calendar, Timeline), drawers, modals & API
├── lib/                   # Supabase client, query client, layout constants, status colors, and utils
├── pages/                 # Route pages: LandingPage, Dashboard
├── store/                 # Global UI and Theme Zustand stores
└── utils/                 # Formatters (salary, relative time, domain extractor, JSON export/import)
```

> 📌 **Component Architecture Rule**: All reusable UI primitives follow the [AGENTS.md](AGENTS.md) design system guidelines and reside under `src/components/ui/` with Tailwind class extensions using the `cn()` helper.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version `18.x` or higher recommended)
- `npm`, `pnpm`, or `yarn`
- A [Supabase](https://supabase.com/) project (free tier works great)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Application-Tracker.git
cd Application-Tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory (you can copy `.env.example`):

```bash
cp .env.example .env
```

Open `.env` and fill in your Supabase project credentials:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-publishable-key
```

---

## 🗄️ Database Setup (Supabase)

Run the following SQL in your Supabase **SQL Editor** to create the necessary tables and Row Level Security policies:

```sql
-- 1. Applications Table
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
  company text not null,
  role text not null,
  location text default '',
  employment_type text default 'full-time',
  status text default 'wishlist',
  starred boolean default false,
  date_applied date,
  salary_min numeric,
  salary_max numeric,
  salary_currency text default 'PHP',
  salary_period text default 'yearly',
  job_url text default '',
  tags text[] default array[]::text[],
  notes text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Recruiters Table
create table if not exists public.recruiters (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references public.applications(id) on delete cascade not null,
  name text default '',
  email text default '',
  linkedin text default ''
);

-- 3. Checklist Items Table
create table if not exists public.checklist_items (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references public.applications(id) on delete cascade not null,
  text text not null,
  done boolean default false
);

-- 4. Interviews Table
create table if not exists public.interviews (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references public.applications(id) on delete cascade not null,
  stage_name text default 'Interview',
  date date,
  time text default '',
  interviewer text default '',
  platform text default '',
  meeting_link text default '',
  notes text default ''
);

-- 5. Activity Logs Table
create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references public.applications(id) on delete cascade not null,
  timestamp text not null,
  action text not null,
  details text default ''
);

-- Enable Row Level Security (RLS)
alter table public.applications enable row level security;
alter table public.recruiters enable row level security;
alter table public.checklist_items enable row level security;
alter table public.interviews enable row level security;
alter table public.activity_logs enable row level security;

-- Policies: Applications
create policy "Users can manage their own applications"
  on public.applications for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Policies: Child tables linked via application_id
create policy "Users can manage their own recruiters"
  on public.recruiters for all
  using (exists (select 1 from public.applications where applications.id = recruiters.application_id and applications.user_id = auth.uid()));

create policy "Users can manage their own checklist items"
  on public.checklist_items for all
  using (exists (select 1 from public.applications where applications.id = checklist_items.application_id and applications.user_id = auth.uid()));

create policy "Users can manage their own interviews"
  on public.interviews for all
  using (exists (select 1 from public.applications where applications.id = interviews.application_id and applications.user_id = auth.uid()));

create policy "Users can manage their own activity logs"
  on public.activity_logs for all
  using (exists (select 1 from public.applications where applications.id = activity_logs.application_id and applications.user_id = auth.uid()));
```

---

## 🏃 Scripts

| Command | Action |
|---|---|
| `npm run dev` | Starts Vite development server at `http://localhost:5173` |
| `npm run build` | Builds optimized production bundle into `dist/` |
| `npm run preview` | Locally preview the production build |
| `npm run lint` | Runs `oxlint` for high-speed code linting |

---

## 🤝 Contributing

Contributions, issues, and feature suggestions are welcome!

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'feat: add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
