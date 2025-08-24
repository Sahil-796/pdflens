"use client"

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const handleLogin: any = async () => {
  try {
  const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
            redirectTo: `http://localhost:3000/api/callback`
            }
         });

        if (error) {
            console.error('Login error:', error.message);
          }
        } catch (err) {
            
        }
}

export default function Page() {

  return (
    <div>
      <button
        onClick={handleLogin}
      >
        Login with Google
      </button>
    </div>
  );
}