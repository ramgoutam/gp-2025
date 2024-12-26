import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zqlchnhpfdwmqdpmdntc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxbGNobmhwZmR3bXFkcG1kbnRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM2MDU2MDAsImV4cCI6MjAxOTE4MTYwMH0.0FzEZHf1-NgQD8_BrGxEv9RKkMFJEgalfUYJZLCjB8k';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Add error logging for debugging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session?.user?.id);
});