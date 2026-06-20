import { getSupabaseServerClient } from './_lib/supabase.js'

const demoTickets = [
  { code: 'TK-210', title: 'اتصال پیامک بعد از پرداخت', priority: 'بالا', state: 'open' },
  { code: 'TK-214', title: 'بهینه سازی گزارش فروش', priority: 'متوسط', state: 'reviewing' },
  { code: 'TK-219', title: 'دسترسی نقش مدیر محتوا', priority: 'پایین', state: 'planned' },
]

export default function handler(request, response) {
  const supabase = getSupabaseServerClient()

  if (request.method === 'GET') {
    if (!supabase) {
      response.status(200).json({ mode: 'demo', tickets: demoTickets })
      return
    }

    supabase
      .from('portal_tickets')
      .select('id,code,title,priority,state,created_at')
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (error) {
          response.status(500).json({ error: 'database_error', message: error.message })
          return
        }
        response.status(200).json({ mode: 'supabase', tickets: data || [] })
      })
    return
  }

  if (request.method === 'POST') {
    const body = request.body || {}
    const title = String(body.title || '').trim()
    const priority = String(body.priority || 'متوسط').trim()

    if (!title) {
      response.status(400).json({ error: 'validation_error', message: 'title is required' })
      return
    }

    if (!supabase) {
      response.status(202).json({ mode: 'demo', ticket: { code: `TK-${Date.now().toString().slice(-3)}`, title, priority, state: 'open' } })
      return
    }

    supabase
      .from('portal_tickets')
      .insert({ code: `TK-${Date.now().toString().slice(-4)}`, title, priority, state: 'open' })
      .select('id,code,title,priority,state')
      .single()
      .then(({ data, error }) => {
        if (error) {
          response.status(500).json({ error: 'database_error', message: error.message })
          return
        }
        response.status(201).json({ mode: 'supabase', ticket: data })
      })
    return
  }

  response.setHeader('Allow', 'GET, POST')
  response.status(405).json({ error: 'method_not_allowed' })
}
