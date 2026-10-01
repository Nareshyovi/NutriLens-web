'use server'

import { createClient } from '@/utils/supabase/server';

export async function analyzeMeal(description: string) {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Placeholder AI response based on the text
  const isHealthy = description.toLowerCase().includes('salad') || description.toLowerCase().includes('oatmeal');
  
  const mockResult = {
    items: [
      { name: isHealthy ? 'Oatmeal' : 'Cheeseburger', grams: 250, kcal: isHealthy ? 150 : 500, protein_g: 5, carbs_g: 27, fat_g: 3 },
      { name: isHealthy ? 'Banana' : 'Fries', grams: 118, kcal: isHealthy ? 105 : 365, protein_g: 1.3, carbs_g: 27, fat_g: 17 }
    ],
    total_kcal: isHealthy ? 255 : 865,
    total_protein: isHealthy ? 6.3 : 15,
    total_carbs: isHealthy ? 54 : 63,
    total_fat: isHealthy ? 3.3 : 32,
    confidence: 0.92
  };

  return { data: mockResult, error: null };
}
