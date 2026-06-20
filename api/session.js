import { databaseMode } from './_lib/supabase.js'

export default function handler(_request, response) {
  response.status(200).json({
    mode: databaseMode(),
    user: {
      id: 'demo-user',
      fullName: 'کاربر دمو',
      role: 'project_manager',
      permissions: ['projects:read', 'tickets:write', 'milestones:approve', 'handoff:export'],
    },
  })
}
