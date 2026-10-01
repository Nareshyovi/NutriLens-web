'use client'

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { logout, makeMeAdmin } from '../actions';
import { LogOut, User, Target, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function SettingsClient({ profile, goal }: { profile: any, goal: any }) {
  
  return (
    <div className="flex flex-col gap-6">
      
      <Card className="flex flex-col gap-4 p-5">
        <div className="flex items-center gap-2 mb-2 border-b border-[var(--color-outline-variant)] pb-3">
          <User className="text-[var(--color-primary)]" size={20} />
          <h2 className="font-bold text-lg">Profile</h2>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 rounded-full bg-[rgba(34,160,107,0.1)] flex items-center justify-center text-2xl font-bold text-[var(--color-primary)] uppercase">
              {profile?.full_name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="font-bold">{profile?.full_name || 'User'}</div>
              <div className="text-sm text-[var(--color-on-surface-variant)] capitalize">{profile?.role || 'User'} Tier: {profile?.tier || 'Free'}</div>
            </div>
          </div>
          <Input label="Full Name" defaultValue={profile?.full_name || ''} />
          
          <Button variant="secondary" className="mt-2">Update Profile</Button>
        </div>
      </Card>
      
      <Card className="flex flex-col gap-4 p-5">
        <div className="flex items-center gap-2 mb-2 border-b border-[var(--color-outline-variant)] pb-3">
          <Target className="text-[var(--color-primary)]" size={20} />
          <h2 className="font-bold text-lg">Goals & Diet</h2>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
             <div className="flex-1 bg-[rgba(34,160,107,0.05)] p-3 rounded-[12px] border border-[var(--color-outline-variant)]">
               <div className="text-xs text-[var(--color-on-surface-variant)] uppercase tracking-wider font-bold mb-1">Target</div>
               <div className="font-heading font-bold text-[var(--color-primary)]">{goal?.calorie_target || 0} kcal</div>
             </div>
             <div className="flex-1 bg-[rgba(34,160,107,0.05)] p-3 rounded-[12px] border border-[var(--color-outline-variant)]">
               <div className="text-xs text-[var(--color-on-surface-variant)] uppercase tracking-wider font-bold mb-1">Goal</div>
               <div className="font-heading font-bold text-[var(--color-primary)] capitalize">{goal?.goal_type || 'Maintain'}</div>
             </div>
          </div>
          
          <Button variant="secondary" onClick={() => window.location.href = '/onboarding'}>Recalculate Plan</Button>
        </div>
      </Card>

      {/* DEV ONLY: Admin Grant */}
      {profile?.role !== 'admin' && (
        <Card className="flex flex-col gap-4 p-5 border-dashed border-[var(--color-tertiary)] bg-[rgba(139,92,246,0.05)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-sm text-[var(--color-tertiary)] flex items-center gap-2"><ShieldAlert size={16} /> Dev Tool</h2>
              <p className="text-xs text-[var(--color-on-surface-variant)]">Grant yourself admin privileges for testing</p>
            </div>
            <form action={makeMeAdmin}>
              <Button type="submit" style={{ backgroundColor: 'var(--color-tertiary)' }} className="text-xs py-2 h-auto px-4">Make Admin</Button>
            </form>
          </div>
        </Card>
      )}

      {profile?.role === 'admin' && (
        <Card className="flex flex-col gap-4 p-5 border-[var(--color-tertiary)]">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-bold text-lg text-[var(--color-tertiary)]">Admin Area</h2>
              <p className="text-sm text-[var(--color-on-surface-variant)]">Manage platform settings</p>
            </div>
            <Link href="/admin">
              <Button style={{ backgroundColor: 'var(--color-tertiary)' }}>Dashboard</Button>
            </Link>
          </div>
        </Card>
      )}
      
      <div className="mt-4">
        <form action={logout}>
          <Button type="submit" fullWidth style={{ backgroundColor: 'var(--color-error)' }} className="shadow-none">
            <LogOut size={18} className="mr-2" /> Log Out
          </Button>
        </form>
      </div>
    </div>
  );
}
