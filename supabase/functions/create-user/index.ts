import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Creating user with service role client');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
    })

    const { email, password, role } = await req.json()
    console.log('Received request to create user:', { email, role });

    // Create user
    const { data: userData, error: createUserError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (createUserError) {
      console.error('Error creating user:', createUserError);
      throw createUserError
    }

    console.log('User created successfully:', userData.user.id);

    // Assign role
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userData.user.id,
        role: role,
      })

    if (roleError) {
      console.error('Error assigning role:', roleError);
      throw roleError
    }

    console.log('Role assigned successfully');

    return new Response(
      JSON.stringify({ user: userData.user }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in create-user function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})