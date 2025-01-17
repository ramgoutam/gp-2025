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
    
    const supabaseAdmin = createClient(
      supabaseUrl,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
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

    console.log('Verifying admin status...');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError) throw userError;

    if (!user) throw new Error('No user found');

    console.log('Getting target user details...');
    const { data: targetUser, error: targetUserError } = await supabaseAdmin.auth.admin.getUserById(targetUserId)
    if (targetUserError) throw targetUserError;

    if (!targetUser?.user?.email) {
      throw new Error('Target user email not found');
    }

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

    console.log('Generating sign-in link...');
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: targetUser.user.email,
      options: {
        redirectTo: `${supabaseUrl}`,
        data: {
          impersonated: true,
          impersonator: user.id,
          targetUserId: targetUserId
        }
      }
    })

    if (error) throw error;

    console.log('Magic link generated successfully');
    return new Response(
      JSON.stringify({ 
        data: {
          properties: data.properties,
          magicLink: data.properties.action_link
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