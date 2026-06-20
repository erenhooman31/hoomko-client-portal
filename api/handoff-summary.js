const milestones = ['discovery', 'architecture', 'implementation', 'delivery']

export default function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    response.status(405).json({ error: 'method_not_allowed' })
    return
  }

  response.status(200).json({
    generatedAt: new Date().toISOString(),
    project: 'client-portal-demo',
    acceptedMilestones: milestones,
    openTickets: 2,
    files: ['requirements.pdf', 'api-map.doc', 'handoff-guide.pdf'],
    handoffStatus: 'ready-for-client-review',
  })
}
