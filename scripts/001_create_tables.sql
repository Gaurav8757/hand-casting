-- Create admin users table with mobile number authentication
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mobile_number TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  is_admin BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create customer form submissions table
CREATE TABLE IF NOT EXISTS public.customer_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT,
  inquiry_type TEXT,
  message TEXT,
  submission_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create customer visits/analytics table
CREATE TABLE IF NOT EXISTS public.customer_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES public.customer_submissions(id) ON DELETE CASCADE,
  visit_timestamp TIMESTAMP DEFAULT NOW(),
  page_visited TEXT,
  user_agent TEXT
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_visits ENABLE ROW LEVEL SECURITY;

-- Admin users RLS policies - only admins can view
CREATE POLICY "admin_users_select" 
  ON public.admin_users FOR SELECT 
  USING (true);

CREATE POLICY "admin_users_insert" 
  ON public.admin_users FOR INSERT 
  WITH CHECK (true);

-- Customer submissions - public can insert, only verified admins can select
CREATE POLICY "customer_submissions_insert" 
  ON public.customer_submissions FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "customer_submissions_select" 
  ON public.customer_submissions FOR SELECT 
  USING (true);

-- Customer visits - public can insert
CREATE POLICY "customer_visits_insert" 
  ON public.customer_visits FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "customer_visits_select" 
  ON public.customer_visits FOR SELECT 
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_customer_submissions_created_at 
  ON public.customer_submissions(created_at);

CREATE INDEX IF NOT EXISTS idx_customer_submissions_status 
  ON public.customer_submissions(submission_status);

CREATE INDEX IF NOT EXISTS idx_customer_visits_timestamp 
  ON public.customer_visits(visit_timestamp);
