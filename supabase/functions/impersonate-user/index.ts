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
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    // Create admin client with service role key
    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
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

    // Verify admin status
    console.log('Verifying admin status...');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError) throw userError;
    if (!user) throw new Error('No user found');

    // Get target user details
    console.log('Getting target user details...');
    const { data: targetUserData, error: targetUserError } = await supabaseAdmin.auth.admin.getUserById(targetUserId)
    if (targetUserError) throw targetUserError;
    if (!targetUserData?.user) throw new Error('Target user not found');

    // Verify admin role
    console.log('Verifying admin role...');
    const { data: roles, error: rolesError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (rolesError) throw rolesError;
    if (!roles || roles.role !== 'ADMIN') {
      throw new Error('Unauthorized - Admin access required')
    }

    // Create a custom sign-in link
    console.log('Creating sign-in link...');
    const { data: signInData, error: signInError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: targetUserData.user.email!,
      options: {
        redirectTo: `${Deno.env.get('SITE_URL')}`,
        data: {
          impersonated: true,
          impersonator: user.id,
          targetUserId: targetUserId
        }
      }
    })

    if (signInError) {
      console.error('Error generating sign-in link:', signInError);
      throw signInError;
    }

    if (!signInData?.properties?.action_link) {
      throw new Error('No action link generated');
    }

    console.log('Sign-in link generated successfully');
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