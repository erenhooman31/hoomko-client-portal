import { getSupabaseServerClient } from './_lib/supabase.js'

const milestones = ['discovery', 'architecture', 'implementation', 'delivery']

export default function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    response.status(405).json({ error: 'method_not_allowed' })
    return
  }

  const supabase = getSupabaseServerClient()

  if (supabase) {
    supabase
      .from('portal_projects')
      .select('id,name,status,portal_milestones(title,status),portal_tickets(id,state),portal_files(title,path)')
      .limit(1)
      .single()
      .then(({ data, error }) => {
        if (error) {
          response.status(500).json({ error: 'database_error', message: error.message })
          return
        }
        response.status(200).json({
          mode: 'supabase',
          generatedAt: new Date().toISOString(),
          project: data?.name || 'client-portal',
          acceptedMilestones: (data?.portal_milestones || []).filter((item) => item.status === 'accepted').map((item) => item.title),
          openTickets: (data?.portal_tickets || []).filter((ticket) => ticket.state !== 'closed').length,
          files: (data?.portal_files || []).map((file) => file.title),
          handoffStatus: data?.status || 'ready-for-client-review',
        })
      })
    return
  }

  response.status(200).json({
    mode: 'demo',
    generatedAt: new Date().toISOString(),
    project: 'client-portal-demo',
    acceptedMilestones: milestones,
    openTickets: 2,
    files: ['requirements.pdf', 'api-map.doc', 'handoff-guide.pdf'],
    handoffStatus: 'ready-for-client-review',
  })
}
