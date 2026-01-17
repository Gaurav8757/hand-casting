-- Fix RLS policies for blog images storage

-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete blog images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload blog images" ON storage.objects;

-- Allow public read access to blog images
CREATE POLICY "Public can view blog images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'blog-images');

-- Allow ANYONE to upload blog images (simplified for development)
-- In production, you should authenticate users properly
CREATE POLICY "Anyone can upload blog images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'blog-images');

-- Allow ANYONE to delete blog images (simplified for development)
CREATE POLICY "Anyone can delete blog images"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'blog-images');

-- Alternative: If you want to keep it authenticated only, 
-- make sure your admin is properly authenticated
-- Uncomment these and comment out the "Anyone" policies above:

-- CREATE POLICY "Authenticated users can upload blog images"
--   ON storage.objects
--   FOR INSERT
--   WITH CHECK (bucket_id = 'blog-images' AND auth.uid() IS NOT NULL);

-- CREATE POLICY "Authenticated users can delete blog images"
--   ON storage.objects
--   FOR DELETE
--   USING (bucket_id = 'blog-images' AND auth.uid() IS NOT NULL);
