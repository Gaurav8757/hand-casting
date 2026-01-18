-- =====================================================
-- Migration: Create Product Features Table
-- Description: Sets up product_features table for
--              dynamic product showcase management
-- =====================================================

-- Create product_features table
CREATE TABLE IF NOT EXISTS public.product_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  detailed_description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.product_features ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS Policies for product_features table
-- =====================================================

-- Allow public SELECT (so features display on frontend)
CREATE POLICY "product_features_select" 
  ON public.product_features 
  FOR SELECT 
  USING (is_active = true);

-- Allow ALL to INSERT (admin auth handled via JWT)
CREATE POLICY "product_features_insert" 
  ON public.product_features 
  FOR INSERT 
  WITH CHECK (true);

-- Allow ALL to UPDATE (admin auth handled via JWT)
CREATE POLICY "product_features_update" 
  ON public.product_features 
  FOR UPDATE 
  USING (true)
  WITH CHECK (true);

-- Allow ALL to DELETE (admin auth handled via JWT)
CREATE POLICY "product_features_delete" 
  ON public.product_features 
  FOR DELETE 
  USING (true);

-- =====================================================
-- Storage Bucket Policies for product-features
-- =====================================================

-- Allow ALL users to upload files (admin auth handled in app)
CREATE POLICY "product_features_storage_insert"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'product-features');

-- Allow public read access
CREATE POLICY "product_features_storage_select"
ON storage.objects
FOR SELECT
USING (bucket_id = 'product-features');

-- Allow ALL users to update files
CREATE POLICY "product_features_storage_update"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'product-features')
WITH CHECK (bucket_id = 'product-features');

-- Allow ALL users to delete files
CREATE POLICY "product_features_storage_delete"
ON storage.objects
FOR DELETE
USING (bucket_id = 'product-features');

-- =====================================================
-- Indexes for Performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_product_features_display_order 
  ON public.product_features(display_order ASC);

CREATE INDEX IF NOT EXISTS idx_product_features_is_active 
  ON public.product_features(is_active);

CREATE INDEX IF NOT EXISTS idx_product_features_created_at 
  ON public.product_features(created_at DESC);

-- =====================================================
-- Update Trigger for updated_at timestamp
-- =====================================================

CREATE TRIGGER update_product_features_updated_at 
  BEFORE UPDATE ON public.product_features 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Seed Data - Migrate existing hardcoded features
-- =====================================================

INSERT INTO public.product_features (title, description, detailed_description, display_order, is_active) VALUES
('1800g Molding Powder', 'Create detailed, professional-quality molds', 'Create detailed, professional-quality molds with our premium kit. Perfect for capturing every detail of your hands.', 1, true),
('Casting Stone', 'Mix to create beautiful, lasting sculptures', 'High-quality casting stone that creates durable, beautiful sculptures. Easy to mix and work with.', 2, true),
('Premium Tools', 'Precision sticks and detailing instruments', 'Professional-grade tools for perfect results. Includes precision sticks and detailing instruments.', 3, true),
('Bucket & Gloves', 'Everything needed for clean casting', 'Complete set of protective gloves and mixing bucket. Keep your workspace clean and safe.', 4, true),
('Sandpaper & Finishers', 'Polish and refine your final sculpture', 'Professional finishing tools to polish and perfect your sculpture. Achieve a smooth, gallery-quality finish.', 5, true),
('Wooden Base', 'Display-ready with optional personalized engraving', 'Beautiful wooden display base included. Optional personalized engraving available for a special touch.', 6, true);

-- =====================================================
-- Verification Queries
-- =====================================================

-- Check if table exists and has data
-- SELECT * FROM public.product_features ORDER BY display_order;

-- Check RLS policies
-- SELECT * FROM pg_policies WHERE tablename = 'product_features';

-- Check storage policies
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%product_features%';
