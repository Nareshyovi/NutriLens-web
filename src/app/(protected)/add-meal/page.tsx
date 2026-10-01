import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import AddMealClient from './components/AddMealClient';

export default async function AddMealPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <div className="flex flex-col h-full max-w-[600px] mx-auto p-4 md:p-8 overflow-y-auto pb-24">
      <header className="mb-6">
        <h1 className="font-heading text-2xl font-bold">Add Meal</h1>
        <p className="text-[var(--color-on-surface-variant)] text-sm">How would you like to log your food?</p>
      </header>

      <AddMealClient userId={user.id} />
    </div>
  );
}
