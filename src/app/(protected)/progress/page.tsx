import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import ProgressCharts from './components/ProgressCharts';

export default async function ProgressPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Fetch weight logs for the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: weightLogs } = await supabase
    .from('weight_logs')
    .select('weight_kg, logged_at')
    .eq('user_id', user.id)
    .gte('logged_at', thirtyDaysAgo.toISOString())
    .order('logged_at', { ascending: true });

  const { data: goals } = await supabase
    .from('goals')
    .select('target_weight_kg')
    .eq('user_id', user.id)
    .single();

  return (
    <div className="flex flex-col h-full max-w-[600px] mx-auto p-4 md:p-8 overflow-y-auto pb-24">
      <header className="mb-6">
        <h1 className="font-heading text-2xl font-bold">Your Progress</h1>
        <p className="text-[var(--color-on-surface-variant)] text-sm">Track your journey over time</p>
      </header>

      <ProgressCharts 
        weightLogs={weightLogs || []} 
        targetWeight={goals?.target_weight_kg || null} 
      />
    </div>
  );
}
