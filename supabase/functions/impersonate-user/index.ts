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
    
    if (!targetUserId) {
      throw new Error('Target user ID is required')
    }

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

    // Get target user details
    console.log('Getting target user details...');
    const { data: targetUser, error: targetUserError } = await supabase.auth.admin.getUserById(targetUserId);
    if (targetUserError) {
      console.error('Error getting target user:', targetUserError);
      throw targetUserError;
    }

    if (!targetUser?.user?.email) {
      throw new Error('Target user email not found');
    }

    // Verify admin role
    console.log('Verifying admin role...');
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

    // Get the request URL and origin
    const requestUrl = new URL(req.url);
    const origin = requestUrl.origin;
    console.log('Request origin:', origin);

    // Generate sign-in link for impersonation
    console.log('Generating sign-in link...');
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: targetUser.user.email,
      options: {
        redirectTo: `${origin}/dashboard`,
        data: {
          impersonated: true,
          impersonator: user.id,
          targetUserId: targetUserId
        }
      }
    })

    if (error) {
      console.error('Error generating link:', error);
      throw error;
    }

    console.log('Magic link generated successfully');
    return new Response(
      JSON.stringify({ data }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in impersonate-user function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})