-- Quick diagnostic queries to check carousel setup
-- Run these in Supabase SQL Editor to verify everything is configured correctly

-- 1. Check if carousel_items table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'carousel_items'
) AS table_exists;

-- 2. Check if RLS is enabled on carousel_items
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'carousel_items';

-- 3. Check all RLS policies on carousel_items
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'carousel_items';

-- 4. Check storage policies for carousel-media bucket
SELECT 
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%carousel_media%';

-- 5. Check if carousel-media bucket exists
SELECT * FROM storage.buckets WHERE name = 'carousel-media';

-- 6. Test if current user can insert (run this while authenticated)
-- This will fail if RLS policies aren't set up correctly
INSERT INTO public.carousel_items (src, alt, slug, media_type)
VALUES ('test.jpg', 'Test Image', '/test', 'image')
RETURNING *;

-- 7. Clean up test insert (if step 6 succeeded)
DELETE FROM public.carousel_items WHERE alt = 'Test Image';
