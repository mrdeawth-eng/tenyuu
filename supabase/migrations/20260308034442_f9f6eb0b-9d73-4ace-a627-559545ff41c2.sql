
-- Create fridge_ingredients table
CREATE TABLE public.fridge_ingredients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 1,
  unit TEXT NOT NULL DEFAULT 'piece',
  expiration_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fridge_ingredients ENABLE ROW LEVEL SECURITY;

-- Users can only see their own ingredients
CREATE POLICY "Users can view own ingredients"
  ON public.fridge_ingredients FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own ingredients
CREATE POLICY "Users can insert own ingredients"
  ON public.fridge_ingredients FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own ingredients
CREATE POLICY "Users can update own ingredients"
  ON public.fridge_ingredients FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own ingredients
CREATE POLICY "Users can delete own ingredients"
  ON public.fridge_ingredients FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
