-- Create gallery items table for admin uploads
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  rating NUMERIC(3,1) DEFAULT 5.0,
  customer_name TEXT,
  customer_review TEXT,
  display_on_landing BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create customer ratings/reviews table
CREATE TABLE IF NOT EXISTS public.customer_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  display_on_landing BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_ratings ENABLE ROW LEVEL SECURITY;

-- Policies for gallery_items
CREATE POLICY "gallery_items_select" 
  ON public.gallery_items FOR SELECT 
  USING (true);

CREATE POLICY "gallery_items_insert" 
  ON public.gallery_items FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "gallery_items_update" 
  ON public.gallery_items FOR UPDATE 
  USING (true);

CREATE POLICY "gallery_items_delete" 
  ON public.gallery_items FOR DELETE 
  USING (true);

-- Policies for customer_ratings
CREATE POLICY "customer_ratings_select" 
  ON public.customer_ratings FOR SELECT 
  USING (true);

CREATE POLICY "customer_ratings_insert" 
  ON public.customer_ratings FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "customer_ratings_update" 
  ON public.customer_ratings FOR UPDATE 
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_gallery_items_category 
  ON public.gallery_items(category);

CREATE INDEX IF NOT EXISTS idx_gallery_items_display 
  ON public.gallery_items(display_on_landing);

CREATE INDEX IF NOT EXISTS idx_customer_ratings_display 
  ON public.customer_ratings(display_on_landing);
