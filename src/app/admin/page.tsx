import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowLeft, Check, X, ShieldAlert } from 'lucide-react';

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  // Fetch admin metrics from RPC
  const { data: metrics } = await supabase.rpc('get_admin_metrics');
  
  // Fetch pending foods for verification
  const { data: pendingFoods } = await supabase
    .from('foods')
    .select('*')
    .eq('verification', 'pending')
    .order('created_at', { ascending: false })
    .limit(10);

  return (
    <div className="flex-1 w-full max-w-[800px] mx-auto p-4 md:p-8 flex flex-col h-full overflow-y-auto">
      <header className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/settings" className="p-2 rounded-full hover:bg-[var(--color-surface-dim)] transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="font-heading text-2xl font-bold text-[var(--color-tertiary)] flex items-center gap-2">
              <ShieldAlert size={24} /> Admin Portal
            </h1>
            <p className="text-[var(--color-on-surface-variant)] text-sm">System metrics and moderation</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="p-4 flex flex-col gap-1 border-t-4 border-[var(--color-tertiary)]">
          <span className="text-xs font-bold text-[var(--color-on-surface-variant)] uppercase">Total Users</span>
          <span className="font-heading text-3xl font-bold">{metrics?.total_users || 0}</span>
        </Card>
        <Card className="p-4 flex flex-col gap-1 border-t-4 border-[var(--color-primary)]">
          <span className="text-xs font-bold text-[var(--color-on-surface-variant)] uppercase">Meals Logged</span>
          <span className="font-heading text-3xl font-bold">{metrics?.total_meals_logged || 0}</span>
        </Card>
        <Card className="p-4 flex flex-col gap-1 border-t-4 border-[var(--color-secondary)]">
          <span className="text-xs font-bold text-[var(--color-on-surface-variant)] uppercase">AI Scans (24h)</span>
          <span className="font-heading text-3xl font-bold">{metrics?.ai_scans_today || 0}</span>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-bold text-lg">Verification Queue</h2>
        <Card className="p-0 overflow-hidden">
          {(!pendingFoods || pendingFoods.length === 0) ? (
            <div className="p-8 text-center text-[var(--color-on-surface-variant)]">
              No foods pending verification.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-surface-dim)] text-xs uppercase tracking-wider text-[var(--color-on-surface-variant)]">
                  <th className="p-4 font-bold">Food Name</th>
                  <th className="p-4 font-bold">Macros (P/C/F)</th>
                  <th className="p-4 font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingFoods.map((food: any) => (
                  <tr key={food.id} className="border-t border-[var(--color-outline-variant)]">
                    <td className="p-4">
                      <div className="font-bold">{food.name}</div>
                      <div className="text-xs text-[var(--color-on-surface-variant)]">{food.serving_label} ({food.kcal} kcal)</div>
                    </td>
                    <td className="p-4 text-sm font-bold text-[var(--color-on-surface-variant)]">
                      {food.protein_g} / {food.carbs_g} / {food.fat_g}
                    </td>
                    <td className="p-4 flex gap-2">
                      <button className="w-8 h-8 rounded-full bg-[rgba(34,160,107,0.1)] text-[var(--color-primary)] flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                        <Check size={16} />
                      </button>
                      <button className="w-8 h-8 rounded-full bg-[rgba(255,138,61,0.1)] text-[var(--color-error)] flex items-center justify-center hover:bg-[var(--color-error)] hover:text-white transition-colors">
                        <X size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
        
        <p className="text-xs text-[var(--color-outline)] text-center mt-2">
          Note: Admins cannot view personal user health data (meals, weight, photos).
        </p>
      </div>
    </div>
  );
}
