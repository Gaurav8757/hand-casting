-- =====================================================
-- Migration: Fix Carousel Items RLS for Custom Auth
-- Description: Updates RLS policies to work with custom
--              JWT-based admin authentication system
-- =====================================================

-- The app uses custom JWT authentication (admin_users table)
-- instead of Supabase Auth, so we need to adjust RLS policies
-- to allow operations without requiring Supabase Auth sessions.

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "carousel_items_select" ON public.carousel_items;
DROP POLICY IF EXISTS "carousel_items_insert" ON public.carousel_items;
DROP POLICY IF EXISTS "carousel_items_update" ON public.carousel_items;
DROP POLICY IF EXISTS "carousel_items_delete" ON public.carousel_items;

-- =====================================================
-- Updated RLS Policies for carousel_items table
-- =====================================================

-- Allow public SELECT (so carousel displays on frontend)
CREATE POLICY "carousel_items_select" 
  ON public.carousel_items 
  FOR SELECT 
  USING (true);

-- Allow ALL users to INSERT (admin auth is handled via JWT in app layer)
CREATE POLICY "carousel_items_insert" 
  ON public.carousel_items 
  FOR INSERT 
  WITH CHECK (true);

-- Allow ALL users to UPDATE (admin auth is handled via JWT in app layer)
CREATE POLICY "carousel_items_update" 
  ON public.carousel_items 
  FOR UPDATE 
  USING (true)
  WITH CHECK (true);

-- Allow ALL users to DELETE (admin auth is handled via JWT in app layer)
CREATE POLICY "carousel_items_delete" 
  ON public.carousel_items 
  FOR DELETE 
  USING (true);

-- =====================================================
-- Storage Bucket Policies for carousel-media
-- =====================================================

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "carousel_media_insert" ON storage.objects;
DROP POLICY IF EXISTS "carousel_media_select" ON storage.objects;
DROP POLICY IF EXISTS "carousel_media_update" ON storage.objects;
DROP POLICY IF EXISTS "carousel_media_delete" ON storage.objects;

-- Allow ALL users to upload files (admin auth handled in app)
CREATE POLICY "carousel_media_insert"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'carousel-media');

-- Allow public read access (SELECT)
CREATE POLICY "carousel_media_select"
ON storage.objects
FOR SELECT
USING (bucket_id = 'carousel-media');

-- Allow ALL users to update files (admin auth handled in app)
CREATE POLICY "carousel_media_update"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'carousel-media')
WITH CHECK (bucket_id = 'carousel-media');

-- Allow ALL users to delete files (admin auth handled in app)
CREATE POLICY "carousel_media_delete"
ON storage.objects
FOR DELETE
USING (bucket_id = 'carousel-media');

-- =====================================================
-- Verification Queries
-- =====================================================

-- Check RLS policies
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'carousel_items';

-- Check storage policies
SELECT 
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%carousel_media%';
