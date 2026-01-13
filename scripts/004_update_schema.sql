-- Add payment columns to customer_submissions
ALTER TABLE public.customer_submissions 
ADD COLUMN IF NOT EXISTS advance_payment NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS final_payment NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_amount NUMERIC DEFAULT 0;

-- Add IP and device columns to customer_visits
ALTER TABLE public.customer_visits
ADD COLUMN IF NOT EXISTS ip_address TEXT,
ADD COLUMN IF NOT EXISTS browser TEXT,
ADD COLUMN IF NOT EXISTS os TEXT,
ADD COLUMN IF NOT EXISTS device_type TEXT;
