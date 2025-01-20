import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { email, password, role, userId, action, firstName, lastName, phone } = await req.json()
    console.log('Received request with data:', { email, role, firstName, lastName, phone, action });

    if (action === 'delete' && userId) {
      console.log('Deleting user:', userId);
      const { error: deleteError } = await supabaseClient.auth.admin.deleteUser(userId)
      
      if (deleteError) {
        console.error('Error deleting user:', deleteError);
        throw deleteError;
      }

      return new Response(
        JSON.stringify({ message: 'User deleted successfully' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
    }

    // Validate required fields
    if (!email || !password || !role || !firstName || !lastName || !phone) {
      console.error('Missing required fields:', { email, role, firstName, lastName, phone });
      return new Response(
        JSON.stringify({ 
          error: 'All fields are required: email, password, role, firstName, lastName, phone' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }

    console.log('Creating user with email:', email);

    // Create user with metadata
    const { data: userData, error: createError } = await supabaseClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        firstName,
        lastName,
        phone
      }
    })

    if (createError) {
      console.error('Error creating user:', createError);
      return new Response(
        JSON.stringify({ error: createError.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }

    if (!userData.user) {
      console.error('No user data returned after creation');
      return new Response(
        JSON.stringify({ error: 'User creation failed - no user data returned' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      )
    }

    console.log('User created successfully, updating role data:', { 
      user_id: userData.user.id, 
      role,
      first_name: firstName,
      last_name: lastName,
      phone
    });

    // Update the existing user role instead of inserting a new one
    const { error: roleError } = await supabaseClient
      .from('user_roles')
      .update({
        role,
        first_name: firstName,
        last_name: lastName,
        phone
      })
      .eq('user_id', userData.user.id)

    if (roleError) {
      console.error('Error updating user role:', roleError);
      // If role update fails, delete the created user
      await supabaseClient.auth.admin.deleteUser(userData.user.id);
      return new Response(
        JSON.stringify({ error: roleError.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }

    console.log('User role updated successfully');

    return new Response(
      JSON.stringify({ 
        message: 'User created successfully', 
        user: userData.user 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error in create-user function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})