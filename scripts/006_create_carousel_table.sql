-- =====================================================
-- Migration: Create Carousel Items Table with RLS
-- Description: Sets up carousel_items table with proper
--              Row Level Security policies and storage
--              bucket policies for carousel-media
-- =====================================================

-- Create carousel_items table
CREATE TABLE IF NOT EXISTS public.carousel_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  src TEXT NOT NULL,
  alt TEXT NOT NULL,
  slug TEXT NOT NULL,
  media_type TEXT DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.carousel_items ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS Policies for carousel_items table
-- =====================================================

-- Allow public SELECT (so carousel displays on frontend)
CREATE POLICY "carousel_items_select" 
  ON public.carousel_items 
  FOR SELECT 
  USING (true);

-- Allow authenticated users to INSERT
CREATE POLICY "carousel_items_insert" 
  ON public.carousel_items 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to UPDATE
CREATE POLICY "carousel_items_update" 
  ON public.carousel_items 
  FOR UPDATE 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to DELETE
CREATE POLICY "carousel_items_delete" 
  ON public.carousel_items 
  FOR DELETE 
  TO authenticated
  USING (true);

-- =====================================================
-- Storage Bucket Policies for carousel-media
-- =====================================================

-- Note: The bucket 'carousel-media' should be created manually
-- in Supabase Dashboard -> Storage if it doesn't exist yet.
-- Make sure it's set as a PUBLIC bucket for read access.

-- Allow authenticated users to upload files (INSERT)
CREATE POLICY "carousel_media_insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'carousel-media');

-- Allow public read access (SELECT)
CREATE POLICY "carousel_media_select"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'carousel-media');

-- Allow authenticated users to update files
CREATE POLICY "carousel_media_update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'carousel-media')
WITH CHECK (bucket_id = 'carousel-media');

-- Allow authenticated users to delete files
CREATE POLICY "carousel_media_delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'carousel-media');

-- =====================================================
-- Indexes for Performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_carousel_items_created_at 
  ON public.carousel_items(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_carousel_items_media_type 
  ON public.carousel_items(media_type);

-- =====================================================
-- Update Trigger for updated_at timestamp
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_carousel_items_updated_at 
  BEFORE UPDATE ON public.carousel_items 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Verification Queries (Optional - for testing)
-- =====================================================

-- Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'carousel_items'
);

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'carousel_items';

-- Check storage policies
SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%carousel_media%';
