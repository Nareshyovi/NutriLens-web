'use server'

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}

export async function makeMeAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', user.id);
    
    revalidatePath('/', 'layout');
  }
}
