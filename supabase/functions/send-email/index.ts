import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return jsonResponse({ error: 'Unauthorized: missing authorization header' }, 401)
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return jsonResponse({ error: 'Unauthorized: invalid session' }, 401)
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      return jsonResponse(
        { error: 'Email service is not configured. Set RESEND_API_KEY in Supabase Edge Function secrets.' },
        500
      )
    }

    const { to, subject, body, replyTo, senderName, attachments } = await req.json()

    if (!to || !subject || !body) {
      return jsonResponse({ error: 'Missing required fields: to, subject, and body' }, 400)
    }

    const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') || 'onboarding@resend.dev'
    const displayName = (senderName || user.user_metadata?.full_name || 'Application Tracker').replace(/[<>]/g, '')

    const payload: Record<string, unknown> = {
      from: `${displayName} <${fromEmail}>`,
      to: [to],
      subject,
      text: body,
      reply_to: replyTo || user.email,
    }

    if (Array.isArray(attachments) && attachments.length > 0) {
      payload.attachments = attachments.map((att: { filename: string; content: string }) => ({
        filename: att.filename,
        content: att.content,
      }))
    }

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const resendData = await resendRes.json()
    if (!resendRes.ok) {
      return jsonResponse(
        { error: resendData?.message || 'Failed to send email via Resend' },
        resendRes.status
      )
    }

    return jsonResponse({ success: true, id: resendData.id }, 200)
  } catch (err) {
    return jsonResponse({ error: err instanceof Error ? err.message : 'Unexpected server error' }, 500)
  }
})
