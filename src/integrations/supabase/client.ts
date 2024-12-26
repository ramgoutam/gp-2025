import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://zqlchnhpfdwmqdpmdntc.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxbGNobmhwZmR3bXFkcG1kbnRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwMDI3NjIsImV4cCI6MjA1MDU3ODc2Mn0.-RZXscmcGaEDgQRDekitg8TGse4zvyiDTM-9fMAgor0";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase configuration. Please check your environment variables.');
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
});

// Enhanced connection test function
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase
      .from('lab_scripts')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Supabase connection error:', error);
      return { success: false, error };
    }

    console.log('Supabase connection successful:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected Supabase connection error:', error);
    return { success: false, error };
  }
};

// Test the connection on module load
testSupabaseConnection();

// Add comprehensive logging for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase Auth State Change:', {
    event,
    user: session?.user?.id,
    sessionExists: !!session
  });
});