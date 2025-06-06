
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { paymentId } = await req.json();

    if (!paymentId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Payment ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const piApiKey = Deno.env.get('PI_API_KEY');
    if (!piApiKey) {
      console.error('PI_API_KEY not found in environment variables');
      return new Response(
        JSON.stringify({ success: false, error: 'Server configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Approving payment: ${paymentId}`);

    // Call Pi Network API to approve payment
    const piResponse = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Key ${piApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const piData = await piResponse.json();

    if (!piResponse.ok) {
      console.error('Pi API approval failed:', piData);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Payment approval failed',
          details: piData 
        }),
        { 
          status: piResponse.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Payment approved successfully:', paymentId);

    return new Response(
      JSON.stringify({ success: true, data: piData }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in pi-approve-payment:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error',
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
