export default function handler(_request, response) {
  response.status(200).json({
    service: 'hoomko-client-portal',
    status: 'ok',
    stack: ['React', 'Vite', 'Vercel Functions'],
    capabilities: ['ticket-api', 'milestone-approval', 'delivery-handoff'],
  })
}
