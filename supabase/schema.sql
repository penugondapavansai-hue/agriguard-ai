-- ==============================================================================
-- Supabase Database Schema for Remix AgriGuard AI
-- Project: xaubecuaalodjvvaenrz
-- Apply this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/xaubecuaalodjvvaenrz/sql/new
-- ==============================================================================

-- 1. Profiles Table (Synced with Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  uid TEXT PRIMARY KEY,
  email TEXT,
  display_name TEXT NOT NULL,
  photo_url TEXT,
  role TEXT NOT NULL DEFAULT 'farmer',
  location TEXT,
  crop_specialty TEXT,
  bio TEXT,
  is_verified_agronomist BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Diagnostic Analyses Records
CREATE TABLE IF NOT EXISTS public.analyses (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.user_profiles(uid) ON DELETE SET NULL,
  analyzed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  image_quality TEXT NOT NULL DEFAULT 'good',
  plant_detected BOOLEAN NOT NULL DEFAULT TRUE,
  crop TEXT NOT NULL,
  problem TEXT NOT NULL,
  confidence INTEGER NOT NULL DEFAULT 0,
  confidence_level TEXT NOT NULL DEFAULT 'POSSIBLE',
  severity TEXT NOT NULL DEFAULT 'UNKNOWN',
  visual_symptoms JSONB NOT NULL DEFAULT '[]'::jsonb,
  possible_causes JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
  ipm JSONB NOT NULL DEFAULT '[]'::jsonb,
  prevention JSONB NOT NULL DEFAULT '[]'::jsonb,
  monitoring JSONB NOT NULL DEFAULT '[]'::jsonb,
  expert_advice TEXT NOT NULL DEFAULT '',
  is_demo BOOLEAN DEFAULT FALSE,
  user_notes TEXT,
  image_thumbnail TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Community Forum Posts
CREATE TABLE IF NOT EXISTS public.forum_posts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL DEFAULT 'farmer',
  author_location TEXT,
  crop TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'general',
  urgency TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'open',
  likes_count INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  analysis_id TEXT REFERENCES public.analyses(id) ON DELETE SET NULL,
  liked_by JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Community Forum Comments
CREATE TABLE IF NOT EXISTS public.forum_comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL DEFAULT 'farmer',
  content TEXT NOT NULL,
  likes_count INTEGER NOT NULL DEFAULT 0,
  liked_by JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_comments ENABLE ROW LEVEL SECURITY;

-- User Profiles: Anyone can view profiles, only user can update their own
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.user_profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.user_profiles FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own profile" 
  ON public.user_profiles FOR UPDATE USING (auth.uid()::text = uid);

-- Analyses: Users can view their own, anonymous guest scans are viewable by id
CREATE POLICY "Analyses are viewable by owner or public if anonymous" 
  ON public.analyses FOR SELECT USING (true);

CREATE POLICY "Anyone can insert an analysis" 
  ON public.analyses FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own analysis" 
  ON public.analyses FOR UPDATE USING (auth.uid()::text = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own analysis" 
  ON public.analyses FOR DELETE USING (auth.uid()::text = user_id OR user_id IS NULL);

-- Forum Posts: Viewable by all, insertable by authenticated users (or guests), author can update/delete
CREATE POLICY "Forum posts are viewable by everyone" 
  ON public.forum_posts FOR SELECT USING (true);

CREATE POLICY "Anyone can create a forum post" 
  ON public.forum_posts FOR INSERT WITH CHECK (true);

CREATE POLICY "Authors can update their forum post" 
  ON public.forum_posts FOR UPDATE USING (true);

CREATE POLICY "Authors can delete their forum post" 
  ON public.forum_posts FOR DELETE USING (true);

-- Forum Comments: Viewable by all, insertable by everyone
CREATE POLICY "Comments are viewable by everyone" 
  ON public.forum_comments FOR SELECT USING (true);

CREATE POLICY "Anyone can create a comment" 
  ON public.forum_comments FOR INSERT WITH CHECK (true);

CREATE POLICY "Authors can update comments" 
  ON public.forum_comments FOR UPDATE USING (true);

CREATE POLICY "Authors can delete comments" 
  ON public.forum_comments FOR DELETE USING (true);

-- ==============================================================================
-- INITIAL SEED COMMUNITY POSTS
-- ==============================================================================

INSERT INTO public.forum_posts (
  id, user_id, author_name, author_role, author_location, crop, title, description, content, category, urgency, status, likes_count, comments_count, is_pinned, image_url, created_at
) VALUES 
(
  'post_seed_1',
  'seed_farmer_1',
  'Ramesh Patel',
  'farmer',
  'Gujarat, India',
  'Cotton',
  'Severe curling and silvering underneath cotton leaves - is it Whitefly or Thrips?',
  'Noticed upward curling on my Bt-Cotton crop (approx 45 days after sowing). What IPM spray or botanical treatment is safest right now before boll formation?',
  'Noticed upward curling on my Bt-Cotton crop (approx 45 days after sowing). What IPM spray or botanical treatment is safest right now before boll formation?',
  'pest',
  'high',
  'resolved',
  14,
  2,
  TRUE,
  'https://images.unsplash.com/photo-1594488554286-9a2c3a502621?auto=format&fit=crop&w=800&q=80',
  NOW() - INTERVAL '18 hours'
),
(
  'post_seed_2',
  'seed_agronomist_1',
  'Dr. Ananya Sharma',
  'agronomist',
  'ICAR Research Station, Pune',
  'Tomato',
  'Advisory: Early Blight outbreak warning following continuous humid showers',
  'Farmers growing Solanaceous crops (Tomato, Potato, Eggplant) should monitor lower foliage closely for concentric brown ring lesions.',
  'Farmers growing Solanaceous crops (Tomato, Potato, Eggplant) should monitor lower foliage closely for concentric brown ring lesions.',
  'fungal',
  'medium',
  'open',
  28,
  3,
  TRUE,
  'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=800&q=80',
  NOW() - INTERVAL '36 hours'
)
ON CONFLICT (id) DO NOTHING;
