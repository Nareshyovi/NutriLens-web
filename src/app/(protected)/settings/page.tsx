import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import SettingsClient from './components/SettingsClient';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  const { data: goal } = await supabase.from('goals').select('*').eq('user_id', user.id).single();

  return (
    <div className="flex flex-col h-full max-w-[600px] mx-auto p-4 md:p-8 overflow-y-auto pb-24">
      <header className="mb-6">
        <h1 className="font-heading text-2xl font-bold">Settings</h1>
      </header>
      
      <SettingsClient profile={profile} goal={goal} />
    </div>
  );
}
