import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zqlchnhpfdwmqdpmdntc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxbGNobmhwZmR3bXFkcG1kbnRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM2MDU2MDAsImV4cCI6MjAxOTE4MTYwMH0.0FzEZHf1-NgQD8_BrGxEv9RKkMFJEgalfUYJZLCjB8k';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'supabase.auth.token',
  }
});

// Add error logging for debugging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event);
  if (session) {
    console.log('Session user ID:', session.user?.id);
    console.log('Session token:', session.access_token);
  } else {
    console.log('No active session');
  }
});

// Test connection and auth state
const testConnection = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    console.error('No active session found');
    return;
  }

  const { error } = await supabase
    .from('lab_scripts')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Supabase connection test failed:', error);
  } else {
    console.log('Supabase connection test successful');
  }
};

testConnection();