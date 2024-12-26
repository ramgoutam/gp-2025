import { createClient } from '@supabase/supabase-js';

// Hardcode the values since we don't have access to environment variables
const supabaseUrl = "https://zqlchnhpfdwmqdpmdntc.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxbGNobmhwZmR3bXFkcG1kbnRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM2MDU2MDAsImV4cCI6MjAxOTE4MTYwMH0.0FzxCHrHKYVb5QMjmQYRc6s_7LV_UXFC0VSqE8AqCUs";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
  },
});

// Add logging for debugging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session);
});