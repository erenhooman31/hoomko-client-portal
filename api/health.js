import { databaseMode } from './_lib/supabase.js'

export default function handler(_request, response) {
  response.status(200).json({
    service: 'hoomko-client-portal',
    status: 'ok',
    database: databaseMode(),
    stack: ['React', 'Vite', 'Vercel Functions', 'Supabase-ready Postgres/Auth/Storage'],
    capabilities: ['ticket-api', 'milestone-approval', 'delivery-handoff', 'role-based-demo'],
  })
}
