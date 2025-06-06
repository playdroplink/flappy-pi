
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
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
    const { piUserId, username, accessToken } = await req.json()

    if (!piUserId || !username) {
      return new Response(
        JSON.stringify({ error: 'Pi User ID and username are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase Admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check if user already exists in Supabase
    const { data: existingUser } = await supabaseAdmin.auth.admin.getUserById(piUserId)

    let user
    if (existingUser.user) {
      // User exists, update their metadata if needed
      const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        piUserId,
        {
          user_metadata: {
            username,
            pi_access_token: accessToken,
            last_login: new Date().toISOString()
          }
        }
      )
      
      if (updateError) {
        console.error('Error updating user:', updateError)
        return new Response(
          JSON.stringify({ error: 'Failed to update user' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      user = updatedUser.user
    } else {
      // Create new user in Supabase
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        id: piUserId,
        email: `${piUserId}@pi.network`, // Fake email using Pi user ID
        email_confirm: true,
        user_metadata: {
          username,
          pi_access_token: accessToken,
          provider: 'pi_network',
          created_at: new Date().toISOString()
        }
      })

      if (createError) {
        console.error('Error creating user:', createError)
        return new Response(
          JSON.stringify({ error: 'Failed to create user' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      user = newUser.user
    }

    // Generate access token for the user
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: `${piUserId}@pi.network`,
      options: {
        redirectTo: `${req.headers.get('origin') || 'http://localhost:3000'}/auth/callback`
      }
    })

    if (sessionError) {
      console.error('Error generating session:', sessionError)
      return new Response(
        JSON.stringify({ error: 'Failed to generate session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create a custom session for immediate use
    const { data: signInData, error: signInError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email: `${piUserId}@pi.network`
    })

    if (signInError) {
      console.error('Error signing in user:', signInError)
      return new Response(
        JSON.stringify({ error: 'Failed to sign in user' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user?.id,
          email: user?.email,
          username: user?.user_metadata?.username
        },
        session_url: sessionData.properties?.action_link
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Pi auth error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
