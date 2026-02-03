-- Comprehensive fix for all storage buckets and tables used in the admin panel
-- Optimized for custom JWT-based authentication
-- This script uses safe DROP/CREATE commands

-- =====================================================
-- 1. Create/Update Storage Buckets
-- =====================================================

-- Create carousel-media bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'carousel-media', 
  'carousel-media', 
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/ogg']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/ogg'];

-- Create product-features bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-features', 
  'product-features', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

-- Create blog-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images', 
  'blog-images', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

-- =====================================================
-- 2. Clean Up and Create Storage Policies
-- =====================================================

-- We use a DO block to safely drop policies without knowing exact names if they match patterns
DO $$
BEGIN
    -- Drop Carousel Media policies
    EXECUTE (SELECT string_agg('DROP POLICY IF EXISTS ' || quote_ident(policyname) || ' ON storage.objects', '; ')
             FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND (policyname ILIKE '%carousel%media%' OR policyname ILIKE '%Carousel Media%'));
    
    -- Drop Product Features policies
    EXECUTE (SELECT string_agg('DROP POLICY IF EXISTS ' || quote_ident(policyname) || ' ON storage.objects', '; ')
             FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND (policyname ILIKE '%product%features%' OR policyname ILIKE '%Product Features%'));
             
    -- Drop Blog Images policies
    EXECUTE (SELECT string_agg('DROP POLICY IF EXISTS ' || quote_ident(policyname) || ' ON storage.objects', '; ')
             FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND (policyname ILIKE '%blog%images%' OR policyname ILIKE '%Blog Images%'));
EXCEPTION WHEN OTHERS THEN
    NULL; -- Ignore errors during mass drop
END $$;

-- Policies for carousel-media
CREATE POLICY "Permissive Select Carousel Media" ON storage.objects FOR SELECT USING (bucket_id = 'carousel-media');
CREATE POLICY "Permissive Insert Carousel Media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'carousel-media');
CREATE POLICY "Permissive Update Carousel Media" ON storage.objects FOR UPDATE USING (bucket_id = 'carousel-media') WITH CHECK (bucket_id = 'carousel-media');
CREATE POLICY "Permissive Delete Carousel Media" ON storage.objects FOR DELETE USING (bucket_id = 'carousel-media');

-- Policies for product-features
CREATE POLICY "Permissive Select Product Features" ON storage.objects FOR SELECT USING (bucket_id = 'product-features');
CREATE POLICY "Permissive Insert Product Features" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-features');
CREATE POLICY "Permissive Update Product Features" ON storage.objects FOR UPDATE USING (bucket_id = 'product-features') WITH CHECK (bucket_id = 'product-features');
CREATE POLICY "Permissive Delete Product Features" ON storage.objects FOR DELETE USING (bucket_id = 'product-features');

-- Policies for blog-images
CREATE POLICY "Permissive Select Blog Images" ON storage.objects FOR SELECT USING (bucket_id = 'blog-images');
CREATE POLICY "Permissive Insert Blog Images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'blog-images');
CREATE POLICY "Permissive Update Blog Images" ON storage.objects FOR UPDATE USING (bucket_id = 'blog-images') WITH CHECK (bucket_id = 'blog-images');
CREATE POLICY "Permissive Delete Blog Images" ON storage.objects FOR DELETE USING (bucket_id = 'blog-images');

-- =====================================================
-- 3. Table RLS Policies (Permissive for Custom Auth)
-- =====================================================

-- Fix carousel_items policies
DROP POLICY IF EXISTS "carousel_items_select" ON public.carousel_items;
DROP POLICY IF EXISTS "carousel_items_insert" ON public.carousel_items;
DROP POLICY IF EXISTS "carousel_items_update" ON public.carousel_items;
DROP POLICY IF EXISTS "carousel_items_delete" ON public.carousel_items;

CREATE POLICY "carousel_items_select" ON public.carousel_items FOR SELECT USING (true);
CREATE POLICY "carousel_items_insert" ON public.carousel_items FOR INSERT WITH CHECK (true);
CREATE POLICY "carousel_items_update" ON public.carousel_items FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "carousel_items_delete" ON public.carousel_items FOR DELETE USING (true);

-- Fix product_features policies
DROP POLICY IF EXISTS "product_features_select" ON public.product_features;
DROP POLICY IF EXISTS "product_features_insert" ON public.product_features;
DROP POLICY IF EXISTS "product_features_update" ON public.product_features;
DROP POLICY IF EXISTS "product_features_delete" ON public.product_features;

CREATE POLICY "product_features_select" ON public.product_features FOR SELECT USING (true);
CREATE POLICY "product_features_insert" ON public.product_features FOR INSERT WITH CHECK (true);
CREATE POLICY "product_features_update" ON public.product_features FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "product_features_delete" ON public.product_features FOR DELETE USING (true);

-- Fix blogs policies
DROP POLICY IF EXISTS "Public can view active blogs" ON blogs;
DROP POLICY IF EXISTS "Allow all operations" ON blogs;
DROP POLICY IF EXISTS "Public can view blogs" ON blogs;
DROP POLICY IF EXISTS "Manage blogs" ON blogs;

CREATE POLICY "Public can view blogs" ON blogs FOR SELECT USING (true);
CREATE POLICY "Manage blogs" ON blogs FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- 4. Verification
-- =====================================================
SELECT id, name, public FROM storage.buckets;
