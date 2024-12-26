import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zqlchnhpfdwmqdpmdntc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxbGNobmhwZmR3bXFkcG1kbnRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwMDI3NjIsImV4cCI6MjA1MDU3ODc2Mn0.-RZXscmcGaEDgQRDekitg8TGse4zvyiDTM-9fMAgor0";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  // Add additional configuration options
  auth: {
    persistSession: true
  },
  global: {
    headers: { 'x-my-custom-header': 'my-app-name' }
  }
});

// Add error logging for fetch requests
supabase.from('lab_scripts').select('*').then(
  (response) => {
    console.log('Supabase connection test:', response);
  },
  (error) => {
    console.error('Supabase connection error:', error);
  }
);