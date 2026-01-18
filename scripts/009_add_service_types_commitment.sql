-- =====================================================
-- Migration: Add Service Types and Commitment to Contact Form
-- Description: Adds service_types array and commitment_accepted
--              boolean to customer_submissions table
-- =====================================================

-- Add new columns to customer_submissions table
ALTER TABLE public.customer_submissions 
ADD COLUMN IF NOT EXISTS service_types TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS commitment_accepted BOOLEAN DEFAULT false;

-- Add index for better query performance on service_types
CREATE INDEX IF NOT EXISTS idx_customer_submissions_service_types 
  ON public.customer_submissions USING GIN (service_types);

-- Add index for commitment_accepted
CREATE INDEX IF NOT EXISTS idx_customer_submissions_commitment 
  ON public.customer_submissions(commitment_accepted);

-- Verification query
-- SELECT id, name, service_types, commitment_accepted FROM public.customer_submissions LIMIT 5;
