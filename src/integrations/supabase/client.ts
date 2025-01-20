import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zqlchnhpfdwmqdpmdntc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxbGNobmhwZmR3bXFkcG1kbnRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU2NzQ5ODcsImV4cCI6MjAyMTI1MDk4N30.Hv6qHXGHXKtKTqJJFvQxBKFtUHXXp0lEGG8H_dGhYOY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window.localStorage,
    storageKey: 'supabase.auth.token'
  }
});