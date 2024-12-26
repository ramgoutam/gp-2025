import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://zqlchnhpfdwmqdpmdntc.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxbGNobmhwZmR3bXFkcG1kbnRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwMDI3NjIsImV4cCI6MjA1MDU3ODc2Mn0.-RZXscmcGaEDgQRDekitg8TGse4zvyiDTM-9fMAgor0";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase URL or Anon Key');
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Add listener for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth event:', event);
  console.log('Session state:', session);
});

// Test connection function
export const testConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.from('lab_scripts').select('count');
    if (error) {
      console.error('Supabase connection error:', error);
      throw error;
    }
    console.log('Supabase connection successful:', data);
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
};

// Test the connection immediately
testConnection().then(isConnected => {
  if (!isConnected) {
    console.error('Failed to connect to Supabase');
  }
});