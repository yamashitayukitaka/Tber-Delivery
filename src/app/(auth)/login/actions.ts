'use server'
import { createClient } from "@/utils/supabase/server";
import { redirect } from 'next/navigation';

/* -----------------------------
   Google OAuth ログイン
----------------------------- */
export async function loginWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error(error);
    return;
  }

  if (data.url) {
    redirect(data.url);
  }
}

/* -----------------------------
   Email + Password ログイン
----------------------------- */
export async function loginWithEmail(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(error);
    return { error: error.message };
  }

  redirect('/');
}

/* -----------------------------
   Email + Password 新規登録
----------------------------- */
export async function signUpWithEmail(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error(error);
    return { error: error.message };
  }

  return { success: true };
}

/* -----------------------------
   ログアウト
----------------------------- */
export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
  }

  redirect('/login');
}
