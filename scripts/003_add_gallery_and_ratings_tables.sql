-- Create gallery_items table
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  image_url TEXT NOT NULL,
  rating DECIMAL(3, 2) DEFAULT 5.0 CHECK (rating >= 1 AND rating <= 5),
  customer_name VARCHAR(255),
  customer_review TEXT,
  display_on_landing BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('UTC'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('UTC'::text, NOW())
);

-- Create customer_ratings table
CREATE TABLE IF NOT EXISTS public.customer_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  rating DECIMAL(3, 2) NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  display_on_landing BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('UTC'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('UTC'::text, NOW())
);

-- Enable RLS
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for gallery_items
CREATE POLICY "Allow public to read gallery items" ON public.gallery_items
  FOR SELECT USING (true);

CREATE POLICY "Allow admins to manage gallery" ON public.gallery_items
  FOR ALL USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for customer_ratings
CREATE POLICY "Allow public to read ratings" ON public.customer_ratings
  FOR SELECT USING (display_on_landing = true);

CREATE POLICY "Allow anyone to insert ratings" ON public.customer_ratings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admins to manage ratings" ON public.customer_ratings
  FOR UPDATE USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow admins to delete ratings" ON public.customer_ratings
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create indexes for better performance
CREATE INDEX idx_gallery_display ON public.gallery_items(display_on_landing);
CREATE INDEX idx_ratings_display ON public.customer_ratings(display_on_landing);
CREATE INDEX idx_gallery_category ON public.gallery_items(category);
