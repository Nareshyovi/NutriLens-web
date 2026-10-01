'use server'

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function saveOnboarding(data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Not authenticated' };

  // Calculate BMR using Mifflin-St Jeor Equation
  // Men: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
  // Women: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
  
  const age = data.age ? parseInt(data.age) : 30;
  const height = data.height ? parseFloat(data.height) : 170;
  const weight = data.weight ? parseFloat(data.weight) : 70;
  
  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  bmr = data.sex === 'male' ? bmr + 5 : bmr - 161;

  // TDEE multipliers
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };
  
  const tdee = bmr * (activityMultipliers[data.activity_level] || 1.2);

  // Target calories based on goal
  let target = tdee;
  if (data.goal === 'lose') target -= 500;
  if (data.goal === 'gain') target += 300;

  target = Math.max(1200, Math.round(target)); // Minimum 1200 kcal

  // Macros: 30% protein, 45% carbs, 25% fat
  const protein_g = Math.round((target * 0.3) / 4);
  const carbs_g = Math.round((target * 0.45) / 4);
  const fat_g = Math.round((target * 0.25) / 9);

  // 1. Update Profile
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      sex: data.sex,
      height_cm: height,
      activity_level: data.activity_level,
      dietary_tags: data.dietary_tags || [],
    })
    .eq('id', user.id);

  if (profileError) return { error: profileError.message };

  // 2. Insert Goal
  const { error: goalError } = await supabase
    .from('goals')
    .insert({
      user_id: user.id,
      goal_type: data.goal,
      calorie_target: target,
      protein_g,
      carbs_g,
      fat_g,
      water_ml: 2500, // default 2.5L
      target_weight_kg: data.target_weight ? parseFloat(data.target_weight) : weight,
    });

  if (goalError) return { error: goalError.message };

  // 3. Initial Weight Log
  await supabase
    .from('weight_logs')
    .insert({
      user_id: user.id,
      weight_kg: weight,
    });

  redirect('/dashboard');
}
