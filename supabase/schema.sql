create extension if not exists pgcrypto;

create table if not exists public.portal_organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.portal_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid references public.portal_organizations(id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('client', 'project_manager', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.portal_projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.portal_organizations(id) on delete cascade,
  name text not null,
  type text not null,
  budget text not null,
  status text not null,
  progress integer not null default 0 check (progress between 0 and 100),
  created_at timestamptz not null default now()
);

create table if not exists public.portal_tickets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.portal_projects(id) on delete cascade,
  code text not null unique,
  title text not null,
  priority text not null,
  state text not null check (state in ('open', 'reviewing', 'planned', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.portal_ticket_replies (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid references public.portal_tickets(id) on delete cascade,
  author_role text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.portal_milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.portal_projects(id) on delete cascade,
  title text not null,
  status text not null check (status in ('pending', 'accepted')),
  sort_order integer not null,
  created_at timestamptz not null default now()
);

create table if not exists public.portal_invoices (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.portal_projects(id) on delete cascade,
  code text not null unique,
  title text not null,
  amount numeric(12, 0) not null check (amount >= 0),
  state text not null check (state in ('paid', 'pending', 'planned')),
  created_at timestamptz not null default now()
);

create table if not exists public.portal_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.portal_projects(id) on delete cascade,
  title text not null,
  path text not null,
  mime_type text not null,
  size_bytes integer not null default 0 check (size_bytes >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  product text not null,
  name text not null,
  contact text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists portal_profiles_organization_idx on public.portal_profiles (organization_id);
create index if not exists portal_projects_organization_idx on public.portal_projects (organization_id);
create index if not exists portal_tickets_project_state_idx on public.portal_tickets (project_id, state);
create index if not exists portal_ticket_replies_ticket_created_idx on public.portal_ticket_replies (ticket_id, created_at desc);
create index if not exists portal_milestones_project_order_idx on public.portal_milestones (project_id, sort_order);
create index if not exists portal_invoices_project_state_idx on public.portal_invoices (project_id, state);
create index if not exists portal_files_project_idx on public.portal_files (project_id);
create index if not exists contact_requests_product_created_idx on public.contact_requests (product, created_at desc);

alter table public.portal_organizations enable row level security;
alter table public.portal_profiles enable row level security;
alter table public.portal_projects enable row level security;
alter table public.portal_tickets enable row level security;
alter table public.portal_ticket_replies enable row level security;
alter table public.portal_milestones enable row level security;
alter table public.portal_invoices enable row level security;
alter table public.portal_files enable row level security;
alter table public.contact_requests enable row level security;

create policy "profiles see own organization" on public.portal_profiles
  for select to authenticated using (id = auth.uid());

create policy "members read projects" on public.portal_projects
  for select to authenticated using (
    organization_id in (select organization_id from public.portal_profiles where id = auth.uid())
  );

create policy "members read tickets" on public.portal_tickets
  for select to authenticated using (
    project_id in (
      select p.id from public.portal_projects p
      join public.portal_profiles pr on pr.organization_id = p.organization_id
      where pr.id = auth.uid()
    )
  );

create policy "members read ticket replies" on public.portal_ticket_replies
  for select to authenticated using (
    ticket_id in (
      select t.id from public.portal_tickets t
      join public.portal_projects p on p.id = t.project_id
      join public.portal_profiles pr on pr.organization_id = p.organization_id
      where pr.id = auth.uid()
    )
  );

create policy "members read milestones" on public.portal_milestones
  for select to authenticated using (
    project_id in (
      select p.id from public.portal_projects p
      join public.portal_profiles pr on pr.organization_id = p.organization_id
      where pr.id = auth.uid()
    )
  );

create policy "members read invoices" on public.portal_invoices
  for select to authenticated using (
    project_id in (
      select p.id from public.portal_projects p
      join public.portal_profiles pr on pr.organization_id = p.organization_id
      where pr.id = auth.uid()
    )
  );

create policy "members read files" on public.portal_files
  for select to authenticated using (
    project_id in (
      select p.id from public.portal_projects p
      join public.portal_profiles pr on pr.organization_id = p.organization_id
      where pr.id = auth.uid()
    )
  );

create policy "authenticated can manage contact requests" on public.contact_requests
  for all to authenticated using (true) with check (true);
