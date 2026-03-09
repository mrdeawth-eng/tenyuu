-- Create recipe_reviews table for storing user reviews
CREATE TABLE public.recipe_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.recipe_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view reviews"
ON public.recipe_reviews
FOR SELECT
USING (true);

CREATE POLICY "Users can create reviews"
ON public.recipe_reviews
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
ON public.recipe_reviews
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
ON public.recipe_reviews
FOR DELETE
USING (auth.uid() = user_id);

-- Add video_url column to recipes table for cooking videos
ALTER TABLE public.recipes ADD COLUMN IF NOT EXISTS video_url TEXT;