-- NutriLens Initial Schema

-- Enums
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE user_tier AS ENUM ('free', 'pro');
CREATE TYPE goal_type AS ENUM ('lose', 'maintain', 'gain');
CREATE TYPE meal_type AS ENUM ('breakfast', 'lunch', 'dinner', 'snack');
CREATE TYPE meal_source AS ENUM ('describe', 'photo', 'search', 'barcode');
CREATE TYPE food_verification AS ENUM ('ai_lab', 'community', 'pending');

-- Profiles
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    timezone TEXT DEFAULT 'UTC',
    sex TEXT,
    birth_date DATE,
    height_cm NUMERIC,
    activity_level TEXT,
    dietary_tags TEXT[],
    cuisine_tags TEXT[],
    allergies TEXT[],
    role user_role DEFAULT 'user',
    tier user_tier DEFAULT 'free',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Goals
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    goal_type goal_type,
    calorie_target NUMERIC,
    protein_g NUMERIC,
    carbs_g NUMERIC,
    fat_g NUMERIC,
    water_ml NUMERIC,
    target_weight_kg NUMERIC,
    effective_from TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own goals" ON goals FOR ALL USING (auth.uid() = user_id);

-- Meals
CREATE TABLE meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    logged_at TIMESTAMPTZ DEFAULT NOW(),
    meal_type meal_type,
    source meal_source,
    photo_path TEXT,
    ai_confidence NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own meals" ON meals FOR ALL USING (auth.uid() = user_id);

-- Foods
CREATE TABLE foods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT,
    serving_label TEXT,
    serving_g NUMERIC,
    kcal NUMERIC,
    protein_g NUMERIC,
    carbs_g NUMERIC,
    fat_g NUMERIC,
    verification food_verification DEFAULT 'pending',
    region TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view foods" ON foods FOR SELECT USING (true);
CREATE POLICY "Only admins can modify foods" ON foods FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Meal Items
CREATE TABLE meal_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meal_id UUID REFERENCES meals(id) ON DELETE CASCADE,
    food_id UUID REFERENCES foods(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    portion_label TEXT,
    grams NUMERIC,
    kcal NUMERIC,
    protein_g NUMERIC,
    carbs_g NUMERIC,
    fat_g NUMERIC,
    fiber_g NUMERIC,
    sodium_mg NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE meal_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own meal items" ON meal_items FOR ALL USING (
    EXISTS (SELECT 1 FROM meals WHERE meals.id = meal_items.meal_id AND meals.user_id = auth.uid())
);

-- Water Logs
CREATE TABLE water_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    amount_ml NUMERIC,
    logged_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE water_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own water logs" ON water_logs FOR ALL USING (auth.uid() = user_id);

-- Weight Logs
CREATE TABLE weight_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    weight_kg NUMERIC,
    logged_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own weight logs" ON weight_logs FOR ALL USING (auth.uid() = user_id);

-- Activity Logs
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    kcal_burned NUMERIC,
    logged_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own activity logs" ON activity_logs FOR ALL USING (auth.uid() = user_id);

-- Favorites
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    food_id UUID REFERENCES foods(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, food_id)
);
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own favorites" ON favorites FOR ALL USING (auth.uid() = user_id);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT,
    body TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);

-- AI Scans
CREATE TABLE ai_scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    input_type TEXT,
    status TEXT,
    latency_ms INT,
    error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE ai_scans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own ai scans" ON ai_scans FOR ALL USING (auth.uid() = user_id);

-- Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT,
    target TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can view audit logs" ON audit_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Trigger for new user
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Admin Views & Functions (Security Definer)
CREATE OR REPLACE FUNCTION get_admin_metrics()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_users', (SELECT count(*) FROM profiles),
        'total_meals_logged', (SELECT count(*) FROM meals),
        'ai_scans_today', (SELECT count(*) FROM ai_scans WHERE created_at > now() - interval '24 hours')
    ) INTO result;
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
