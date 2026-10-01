import { Wizard } from './wizard';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check if they already have a goal to skip onboarding if needed
  const { data: existingGoal } = await supabase
    .from('goals')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (existingGoal) {
    redirect('/dashboard');
  }

  return (
    <div className="flex-1 w-full max-w-[600px] mx-auto p-4 md:p-8 flex flex-col h-full overflow-y-auto">
      <header className="mb-6 text-center">
        <h1 className="font-heading text-2xl font-extrabold text-[var(--color-primary)]">Personalize Your Plan</h1>
        <p className="text-[var(--color-on-surface-variant)] text-sm">Let's set up your nutrition profile</p>
      </header>
      
      <Wizard userId={user.id} />
    </div>
  );
}
