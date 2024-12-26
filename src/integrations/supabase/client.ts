import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zqlchnhpfdwmqdpmdntc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxbGNobmhwZmR3bXFkcG1kbnRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwMDI3NjIsImV4cCI6MjA1MDU3ODc2Mn0.-RZXscmcGaEDgQRDekitg8TGse4zvyiDTM-9fMAgor0";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Add a listener for auth state changes to help with debugging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth event:', event);
  console.log('Session state:', session ? 'Logged in' : 'Logged out');
});

// Test connection function
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('patients').select('count');
    if (error) throw error;
    console.log('Supabase connection test successful');
    return true;
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return false;
  }
};