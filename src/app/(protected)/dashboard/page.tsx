import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { CircularProgress } from '@/components/ui/Progress/Circle';
import { LinearProgress } from '@/components/ui/Progress/Linear';
import Link from 'next/link';
import { TrendingDown, Lightbulb, ArrowRight, Droplet, Plus, Sun, Sunrise, Sunset, Moon } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();

  const { data: goal } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!goal) redirect('/onboarding');

  const today = new Date().toISOString().split('T')[0];

  const { data: meals } = await supabase
    .from('meals')
    .select(`
      id, meal_type, created_at,
      meal_items (
        id, food_id, name, kcal, protein_g, carbs_g, fat_g, quantity
      )
    `)
    .eq('user_id', user.id)
    .eq('logged_date', today);

  let totalKcal = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  meals?.forEach((meal: any) => {
    meal.meal_items.forEach((item: any) => {
      totalKcal += item.kcal || 0;
      totalProtein += item.protein_g || 0;
      totalCarbs += item.carbs_g || 0;
      totalFat += item.fat_g || 0;
    });
  });

  const remaining = Math.max(0, (goal.target_kcal || 0) - totalKcal);
  const kcalPercent = goal.target_kcal ? Math.min(100, (totalKcal / goal.target_kcal) * 100) : 0;
  
  const proteinPercent = goal.target_protein_g ? Math.min(100, (totalProtein / goal.target_protein_g) * 100) : 0;
  const carbsPercent = goal.target_carbs_g ? Math.min(100, (totalCarbs / goal.target_carbs_g) * 100) : 0;
  const fatPercent = goal.target_fat_g ? Math.min(100, (totalFat / goal.target_fat_g) * 100) : 0;

  return (
    <div className="space-y-7 animate-in fade-in duration-500">
      
      {/* ROW 1: HERO CALORIE & MACRO DISTRIBUTION */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Calorie Ring Hero Card (Span 5) */}
        <Card className="col-span-12 lg:col-span-5 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold text-[var(--color-outline)] uppercase tracking-wider block">Daily Energy</span>
              <h2 className="font-heading text-xl font-bold text-[var(--color-on-surface)]">Calorie Budget</h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-[var(--color-surface-container)] text-[var(--color-primary)] text-xs font-semibold flex items-center gap-1">
              <TrendingDown size={16} />
              {goal.goal_type === 'lose' ? 'Weight Loss' : 'Maintaining'}
            </span>
          </div>
          
          <div className="flex flex-col items-center justify-center my-2">
            <div className="relative w-52 h-52 flex items-center justify-center">
              <CircularProgress 
                value={kcalPercent}
                max={100}
                size={208} 
                strokeWidth={12} 
                color="var(--color-primary)" 
                trackColor="var(--color-surface-container-high)" 
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-heading text-3xl font-extrabold tracking-tight">{Math.round(totalKcal)}</span>
                <span className="text-xs text-[var(--color-outline)] font-medium">/ {goal.target_kcal} kcal</span>
                <span className="mt-1 px-2.5 py-0.5 rounded-full bg-[rgba(34,160,107,0.15)] text-[var(--color-primary)] text-[11px] font-bold">
                  {Math.round(remaining)} kcal left
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[var(--color-outline-variant)]/30 mt-4">
            <div className="bg-[var(--color-surface-container-low)] rounded-2xl p-3 text-center">
              <span className="text-xs text-[var(--color-outline)] font-medium block">Consumed</span>
              <span className="font-heading text-base font-bold">{Math.round(totalKcal)} kcal</span>
            </div>
            <div className="bg-[var(--color-surface-container-low)] rounded-2xl p-3 text-center">
              <span className="text-xs text-[var(--color-outline)] font-medium block">Burned (Active)</span>
              <span className="font-heading text-base font-bold text-[var(--color-secondary-container)]">+0 kcal</span>
            </div>
          </div>
        </Card>

        {/* Macro Distribution Bento Cards (Span 7) */}
        <Card className="col-span-12 lg:col-span-7 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="text-xs font-bold text-[var(--color-outline)] uppercase tracking-wider block">Macronutrients</span>
              <h2 className="font-heading text-xl font-bold text-[var(--color-on-surface)]">Target Distribution</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
            {/* Protein */}
            <div className="bg-[#F0F6FF] border border-[#adc6ff]/40 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-[#0058be]">Protein</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#0058be]/10 text-[#0058be]">{Math.round(proteinPercent)}%</span>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-heading text-2xl font-extrabold text-[var(--color-on-surface)]">{Math.round(totalProtein)}</span>
                  <span className="text-sm text-[var(--color-outline)] font-medium">/ {goal.target_protein_g}g</span>
                </div>
                <span className="text-xs text-[var(--color-outline)] block">{Math.max(0, goal.target_protein_g - Math.round(totalProtein))}g remaining</span>
              </div>
              <div className="w-full bg-[#0058be]/20 rounded-full h-2.5 mt-4 overflow-hidden">
                <div className="bg-[#0058be] h-2.5 rounded-full transition-all duration-1000" style={{ width: `${proteinPercent}%` }}></div>
              </div>
            </div>
            
            {/* Carbs */}
            <div className="bg-[#FFF6F0] border border-[#ffb68d]/50 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-[#fe893c]">Carbs</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#fe893c]/15 text-[#fe893c]">{Math.round(carbsPercent)}%</span>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-heading text-2xl font-extrabold text-[var(--color-on-surface)]">{Math.round(totalCarbs)}</span>
                  <span className="text-sm text-[var(--color-outline)] font-medium">/ {goal.target_carbs_g}g</span>
                </div>
                <span className="text-xs text-[var(--color-outline)] block">{Math.max(0, goal.target_carbs_g - Math.round(totalCarbs))}g remaining</span>
              </div>
              <div className="w-full bg-[#fe893c]/20 rounded-full h-2.5 mt-4 overflow-hidden">
                <div className="bg-[#fe893c] h-2.5 rounded-full transition-all duration-1000" style={{ width: `${carbsPercent}%` }}></div>
              </div>
            </div>
            
            {/* Fat */}
            <div className="bg-[#FAF5FF] border border-purple-200 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-purple-700">Fat</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">{Math.round(fatPercent)}%</span>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-heading text-2xl font-extrabold text-[var(--color-on-surface)]">{Math.round(totalFat)}</span>
                  <span className="text-sm text-[var(--color-outline)] font-medium">/ {goal.target_fat_g}g</span>
                </div>
                <span className="text-xs text-[var(--color-outline)] block">{Math.max(0, goal.target_fat_g - Math.round(totalFat))}g remaining</span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2.5 mt-4 overflow-hidden">
                <div className="bg-purple-600 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${fatPercent}%` }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* ROW 2: MEALS TIMELINE & HEALTH TRACKERS */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Meals Timeline (Span 7) */}
        <div className="col-span-12 lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[var(--color-outline)] uppercase tracking-wider block">Nutrition Journal</span>
              <h2 className="font-heading text-2xl font-bold text-[var(--color-on-surface)]">Today's Meals</h2>
            </div>
          </div>

          {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => {
            const currentMeals = meals?.filter((m: any) => m.meal_type === mealType) || [];
            const mealKcal = currentMeals.reduce((acc: number, m: any) => {
              return acc + m.meal_items.reduce((sum: number, item: any) => sum + (item.kcal || 0), 0);
            }, 0);

            let Icon = Sunrise;
            let bgColor = "bg-amber-100 text-amber-700";
            if (mealType === 'lunch') { Icon = Sun; bgColor = "bg-orange-100 text-[var(--color-secondary-container)]"; }
            if (mealType === 'snack') { Icon = Plus; bgColor = "bg-teal-100 text-teal-700"; }
            if (mealType === 'dinner') { Icon = Moon; bgColor = "bg-indigo-100 text-indigo-700"; }

            return (
              <Card key={mealType} className="p-5">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--color-outline-variant)]/30">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bgColor}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-heading text-base font-bold text-[var(--color-on-surface)] capitalize">{mealType}</h3>
                      <span className="text-sm text-[var(--color-outline)]">{currentMeals.length > 0 ? 'Logged' : 'No items'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-heading text-base font-bold text-[var(--color-on-surface)]">
                      {Math.round(mealKcal)} <span className="text-sm font-normal text-[var(--color-outline)]">kcal</span>
                    </span>
                    <Link href="/add-meal" className="text-[var(--color-primary)] hover:bg-[var(--color-surface-container)] p-1 rounded-full transition-colors">
                      <Plus size={20} />
                    </Link>
                  </div>
                </div>

                {currentMeals.length > 0 && (
                  <div className="mt-4 flex flex-col gap-2">
                    {currentMeals.map((m: any) => (
                      <div key={m.id} className="flex flex-col gap-2">
                        {m.meal_items.map((item: any) => (
                          <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl bg-[var(--color-surface-container-low)]/50">
                            <div>
                              <h4 className="text-sm font-semibold text-[var(--color-on-surface)]">{item.name}</h4>
                              <p className="text-xs text-[var(--color-outline)] mt-0.5">{item.protein_g}g Protein · {item.carbs_g}g Carbs · {item.fat_g}g Fat</p>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-bold text-[var(--color-on-surface)] block">{Math.round(item.kcal)} kcal</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* RIGHT COLUMN: AI Advice (Span 5) */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          <section className="bg-gradient-to-br from-[rgba(0,134,86,0.08)] to-[var(--color-surface-container-low)] rounded-3xl p-6 border border-[rgba(0,134,86,0.15)] relative overflow-hidden">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <Lightbulb size={22} />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-heading text-sm font-bold text-[var(--color-primary)]">NutriLens Smart Insight</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--color-surface-container-lowest)] text-[var(--color-outline)]">Live</span>
                </div>
                <p className="text-sm text-[var(--color-on-surface)] leading-relaxed">
                  {proteinPercent < 50 ? (
                    <>You are <strong>short on protein</strong>. Try incorporating paneer, chicken, or eggs into your next meal to optimize muscle recovery.</>
                  ) : kcalPercent > 90 ? (
                    <>You are <strong>close to your calorie limit</strong>. Focus on water and light snacks like cucumber or carrots for the rest of the day.</>
                  ) : (
                    <>You're <strong>on track</strong>! Keep up the good work and stay hydrated.</>
                  )}
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <Link href="/add-meal" className="text-sm font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1">
                    <span>Log your next meal</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Water Hydration Card Placeholder */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0058be]/10 text-[#0058be] flex items-center justify-center">
                  <Droplet size={20} />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-[var(--color-on-surface)]">Hydration Tracker</h3>
                  <span className="text-xs text-[var(--color-outline)]">Daily Goal: 2,500 ml</span>
                </div>
              </div>
              <span className="font-heading text-xl font-bold text-[#0058be]">0 <span className="text-xs text-[var(--color-outline)] font-normal">ml</span></span>
            </div>
            <div className="flex items-center justify-center py-4 text-[var(--color-on-surface-variant)] text-sm italic">
              Water tracking coming soon
            </div>
          </Card>
        </div>
      </div>
      
    </div>
  );
}
