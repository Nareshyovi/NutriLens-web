import { createClient } from '@/utils/supabase/server';
import { Card } from '@/components/ui/Card';

export default async function DiaryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const { data: meals } = await supabase
    .from('meals')
    .select(`
      id, logged_at, meal_type,
      meal_items ( id, name, portion_label, grams, kcal, protein_g, carbs_g, fat_g )
    `)
    .eq('user_id', user?.id)
    .gte('logged_at', startOfDay.toISOString())
    .order('logged_at', { ascending: true });

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
  
  return (
    <div className="flex flex-col h-full max-w-[600px] mx-auto p-4 md:p-8 overflow-y-auto pb-24">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="font-heading text-2xl font-bold">Food Diary</h1>
        <div className="text-[var(--color-on-surface-variant)] text-sm font-bold bg-[rgba(34,160,107,0.1)] px-3 py-1 rounded-full text-[var(--color-primary)]">
          Today
        </div>
      </header>
      
      <div className="flex flex-col gap-6">
        {mealTypes.map(type => {
          const typeMeals = meals?.filter(m => m.meal_type === type) || [];
          let totalKcal = 0;
          typeMeals.forEach(m => m.meal_items.forEach((item: any) => totalKcal += item.kcal || 0));

          return (
            <Card key={type} className="flex flex-col gap-4 p-5">
              <div className="flex justify-between items-center border-b border-[var(--color-outline-variant)] pb-3">
                <h2 className="font-bold capitalize text-lg text-[var(--color-primary)]">{type}</h2>
                <div className="font-heading font-bold text-[var(--color-secondary)]">{totalKcal} kcal</div>
              </div>

              {typeMeals.length === 0 ? (
                <div className="text-sm text-[var(--color-outline)] py-2 text-center">No foods logged</div>
              ) : (
                <div className="flex flex-col gap-3">
                  {typeMeals.map(meal => (
                    meal.meal_items.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center bg-[var(--color-surface)] p-3 rounded-xl border border-[var(--color-outline-variant)]">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{item.name}</span>
                          <span className="text-xs text-[var(--color-on-surface-variant)]">{item.portion_label || `${item.grams}g`}</span>
                        </div>
                        <div className="font-bold font-heading">{item.kcal}</div>
                      </div>
                    ))
                  ))}
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  );
}
