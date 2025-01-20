import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { email, password, role, userId, action, firstName, lastName, phone } = await req.json()

    if (action === 'delete' && userId) {
      const { error: deleteError } = await supabaseClient.auth.admin.deleteUser(userId)
      
      if (deleteError) throw deleteError

      return new Response(
        JSON.stringify({ message: 'User deleted successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!email) {
      throw new Error('Email is required')
    }

    console.log('Creating user with data:', { email, role, firstName, lastName, phone });

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
      throw createError;
    }

    if (userData.user) {
      console.log('User created successfully, inserting role data:', { 
        user_id: userData.user.id, 
        role,
        first_name: firstName,
        last_name: lastName,
        phone
      });

      // Insert into user_roles table
      const { error: roleError } = await supabaseClient
        .from('user_roles')
        .insert({
          user_id: userData.user.id,
          role,
          first_name: firstName,
          last_name: lastName,
          phone
        })

      if (roleError) {
        console.error('Error inserting user role:', roleError);
        // If role insertion fails, delete the created user
        await supabaseClient.auth.admin.deleteUser(userData.user.id);
        throw roleError;
      }
    }

    return new Response(
      JSON.stringify({ message: 'User created successfully', user: userData.user }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in create-user function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})