import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Initializing Supabase client...');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get request body
    const { targetUserId } = await req.json()
    console.log('Target user ID:', targetUserId);
    
    // Verify the requesting user is an admin
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }
    
    const token = authHeader.replace('Bearer ', '')
    console.log('Verifying admin status...');
    
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError) {
      console.error('Error getting user:', userError);
      throw userError;
    }

    if (!user) {
      throw new Error('No user found');
    }

    const { data: targetUser, error: targetUserError } = await supabase.auth.admin.getUserById(targetUserId);
    if (targetUserError) {
      console.error('Error getting target user:', targetUserError);
      throw targetUserError;
    }

    if (!targetUser?.user?.email) {
      throw new Error('Target user email not found');
    }

    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (rolesError) {
      console.error('Error getting roles:', rolesError);
      throw rolesError;
    }

    if (!roles || roles.role !== 'ADMIN') {
      throw new Error('Unauthorized - Admin access required')
    }

    console.log('Generating magic link...');
    // Generate link for impersonation
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: targetUser.user.email,
      options: {
        redirectTo: `${req.headers.get('origin')}/dashboard`
      }
    })

    if (error) {
      console.error('Error generating link:', error);
      throw error;
    }

    console.log('Magic link generated successfully');
    return new Response(
      JSON.stringify({ data }),
      {Let me help you fix the "Failed to fetch" error with the impersonate-user Edge Function. Let's solve this step by step:

1. The error suggests the Edge Function is not accessible, which could be because:
   - The function hasn't been deployed
   - There's an issue with the function's configuration
   - The function is throwing an error during execution

2. Looking at the Edge Function code, I notice a few issues:
   - We're not properly using the targetUserId
   - The magic link is being generated for the admin user instead of the target user
   - We need better error handling

Let's fix the Edge Function:

<lov-code>
Let's update the Edge Function to properly handle user impersonation:

<lov-write file_path="supabase/functions/impersonate-user/index.ts">
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting impersonation process...');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get request body
    const { targetUserId } = await req.json()
    console.log('Target user ID:', targetUserId);
    
    if (!targetUserId) {
      throw new Error('Target user ID is required')
    }

    // Verify the requesting user is an admin
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError) {
      console.error('Error getting user:', userError);
      throw userError;
    }

    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user?.id)
      .single()

    if (rolesError) {
      console.error('Error getting roles:', rolesError);
      throw rolesError;
    }

    if (!roles || roles.role !== 'ADMIN') {
      throw new Error('Unauthorized - Admin access required')
    }

    // Get target user's email
    const { data: targetUser, error: targetUserError } = await supabase.auth.admin.getUserById(targetUserId)
    if (targetUserError || !targetUser?.user) {
      console.error('Error getting target user:', targetUserError);
      throw new Error('Failed to find target user')
    }

    console.log('Generating magic link for user:', targetUser.user.email);

    // Generate link for impersonation
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: targetUser.user.email,
      options: {
        redirectTo: `${req.headers.get('origin')}/dashboard`
      }
    })

    if (error) {
      console.error('Error generating link:', error);
      throw error;
    }

    console.log('Successfully generated magic link');

    return new Response(
      JSON.stringify({ data }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      },
    )
  } catch (error) {
    console.error('Impersonation error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to impersonate user'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      },
    )
  }
})