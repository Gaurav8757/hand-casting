-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  author TEXT DEFAULT 'Admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);

-- Create index on is_active for filtering
CREATE INDEX IF NOT EXISTS idx_blogs_is_active ON blogs(is_active);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to active blogs
CREATE POLICY "Public can view active blogs"
  ON blogs
  FOR SELECT
  USING (is_active = true);

-- Policy: Allow authenticated users to manage all blogs (for admin)
CREATE POLICY "Authenticated users can manage blogs"
  ON blogs
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow public read access to blog images
CREATE POLICY "Public can view blog images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'blog-images');

-- Policy: Allow authenticated users to upload blog images
CREATE POLICY "Authenticated users can upload blog images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

-- Policy: Allow authenticated users to delete blog images
CREATE POLICY "Authenticated users can delete blog images"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

-- Insert sample blog data
INSERT INTO blogs (title, slug, content, excerpt, featured_image, tags, is_active, author)
VALUES 
(
  'The Art of Hand Casting: A Beginner''s Guide',
  'art-of-hand-casting-beginners-guide',
  'Hand casting is a beautiful way to preserve precious moments in time. Whether you''re capturing the tiny hands of a newborn, the loving grasp of a couple, or the bond between family members, hand casting creates a lasting memory that you can cherish forever.

Getting Started:
The first step in creating your hand cast is preparation. Make sure you have a clean, comfortable workspace with all your materials ready. Our premium hand casting kit includes everything you need: skin-safe alginate powder, casting stone, mixing containers, and detailed instructions.

The Process:
1. Mix the alginate powder with water according to the instructions
2. Quickly immerse your hands in the mixture before it sets
3. Hold your position for 3-5 minutes while the mold forms
4. Carefully remove your hands from the mold
5. Pour the casting stone into the mold
6. Wait 24 hours for it to fully cure
7. Remove the cast and admire your creation!

Tips for Success:
- Work quickly but carefully when mixing the alginate
- Keep your hands still during the molding process
- Choose a meaningful pose that represents your relationship
- Consider adding decorative elements like paint or a display base

The result is a stunning, detailed sculpture that captures every line, wrinkle, and fingerprint. It''s not just art—it''s a piece of your story.',
  'Learn how to create beautiful hand casting sculptures with our comprehensive beginner''s guide. Perfect for families and couples.',
  null,
  ARRAY['tutorial', 'handcasting', 'diy', 'beginners'],
  true,
  'Sarah Henderson'
),
(
  '5 Creative Ways to Display Your Hand Cast',
  '5-creative-ways-display-hand-cast',
  'Once you''ve created your beautiful hand cast sculpture, the next question is: how do you display it? Here are five creative ideas to showcase your precious keepsake.

1. Shadow Box Display
Create a stunning shadow box with your hand cast as the centerpiece. Add photos, dried flowers from your wedding, or other meaningful mementos around it. This creates a complete story in one frame.

2. Illuminated Pedestal
Place your hand cast on a lit pedestal or display case. LED lights underneath create a museum-quality presentation that makes your sculpture the focal point of any room.

3. Garden Memorial
For outdoor enthusiasts, consider creating a weather-sealed version for your garden. It becomes a beautiful focal point among flowers and greenery, especially meaningful for memorial pieces.

4. Bookshelf Integration
Integrate your hand cast into your bookshelf display. Surround it with meaningful books, photos, and other decorative items that tell your family''s story.

5. Wall-Mounted Art
Some hand casts can be mounted directly to the wall, creating a unique 3D art piece. This works especially well for parent-child hand holds or couple poses.

Finishing Touches:
Consider painting your hand cast in colors that match your decor. Metallic finishes like bronze, silver, or gold add an elegant touch. You can also leave it natural for a classic, timeless look.

Remember, your hand cast is more than decoration—it''s a memory frozen in time. Display it somewhere you''ll see it daily and be reminded of that special moment.',
  'Discover creative and beautiful ways to display your hand casting sculpture in your home.',
  null,
  ARRAY['display', 'home-decor', 'ideas', 'handcasting'],
  true,
  'Emily Davis'
),
(
  'Why Hand Casting Makes the Perfect Gift',
  'why-hand-casting-perfect-gift',
  'Looking for a truly unique and meaningful gift? Hand casting offers something that no store-bought present can match: a personalized, handmade keepsake that captures a moment in time.

For New Parents:
There''s nothing quite like the tiny hands and feet of a newborn. They grow so fast that within months, those precious little fingers are already bigger. A hand cast preserves that fleeting moment forever. Many parents create a series of casts as their children grow, creating a beautiful timeline of development.

For Couples:
Whether it''s for a wedding, anniversary, or just because, a hand cast of a couple holding hands symbolizes their bond in a tangible way. It''s romantic, personal, and completely unique to them. Some couples even include their wedding rings in the cast for added meaning.

For Families:
Imagine a sculpture of a parent''s hand holding their child''s hand, or all family members'' hands together. These pieces become treasured family heirlooms, passed down through generations.

For Memorials:
Hand casts provide comfort during difficult times. Creating a cast with an elderly parent or grandparent gives you something physical to hold onto. Many people find the process therapeutic and the result deeply meaningful.

The Gift of Experience:
Beyond the final product, creating a hand cast together is an experience. It requires cooperation, patience, and presence. The 3-5 minutes of holding still together becomes a meditation on your relationship.

Why It''s Better Than Photos:
While photos are wonderful, hand casts offer something different. They''re three-dimensional, tactile, and capture details that cameras miss. You can run your fingers over the cast and feel the exact texture of your loved one''s skin.

Making It Extra Special:
Pair your hand casting kit with a beautiful display base, finishing paints, or a custom engraved plaque. These additions transform the cast from a craft project into a true work of art.

The Bottom Line:
In a world of mass-produced gifts, hand casting offers something rare: a completely personalized, handmade treasure that grows more meaningful with time. It''s not just a gift—it''s a memory you can hold.',
  'Discover why hand casting creates the most meaningful and personalized gifts for any occasion.',
  null,
  ARRAY['gifts', 'family', 'memories', 'handcasting'],
  true,
  'Sarah Henderson'
);
