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
    console.log('Initializing Supabase clients...');
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    // Create admin client with service role key
    const supabaseAdmin = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        }
      }
    )

    const { targetUserId } = await req.json()
    console.log('Target user ID:', targetUserId);
    
    if (!targetUserId) {
      throw new Error('Target user ID is required')
    }

    // Get the current user's session
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const supabaseClient = createClient(
      supabaseUrl,
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        },
        global: {
          headers: {
            Authorization: authHeader
          }
        }
      }
    )

    // Get current user
    console.log('Getting current user...');
    const { data: { user: currentUser }, error: currentUserError } = await supabaseClient.auth.getUser()
    if (currentUserError) throw currentUserError;
    if (!currentUser) throw new Error('No user found');

    // Get target user details using admin client
    console.log('Getting target user details...');
    const { data: targetUserData, error: targetUserError } = await supabaseAdmin.auth.admin.getUserById(targetUserId)
    if (targetUserError) throw targetUserError;
    if (!targetUserData?.user) throw new Error('Target user not found');
    if (!targetUserData.user.email) throw new Error('Target user has no email');

    // Verify admin role using admin client to avoid RLS issues
    console.log('Verifying admin role...');
    const { data: roles, error: rolesError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', currentUser.id)
      .maybeSingle()

    if (rolesError) throw rolesError;
    if (!roles || roles.role !== 'ADMIN') {
      throw new Error('Unauthorized - Admin access required')
    }

    // Create a magic link with the service role client
    console.log('Creating magic link...');
    const { data: signInData, error: signInError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: targetUserData.user.email,
      options: {
        redirectTo: `${Deno.env.get('SITE_URL') || 'http://localhost:5173'}`,
        data: {
          impersonated: true,
          impersonator: currentUser.id,
          targetUserId: targetUserId
        }
      }
    })

    if (signInError) {
      console.error('Error generating magic link:', signInError);
      throw signInError;
    }

    if (!signInData?.properties?.action_link) {
      throw new Error('No magic link generated');
    }

    console.log('Magic link generated successfully');
    return new Response(
      JSON.stringify({ 
        data: {
          properties: signInData.properties,
          magicLink: signInData.properties.action_link
        }
      }),
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