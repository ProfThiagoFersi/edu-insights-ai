-- ROLES ENUM
create type public.app_role as enum ('diretor', 'vice_diretor', 'coordenador', 'supervisor');

-- PROFILES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null default '',
  escola_nome text not null default '',
  cargo text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update to authenticated using (auth.uid() = id);

-- USER ROLES
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users can view own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- TIMESTAMP TRIGGER
create or replace function public.update_updated_at_column()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

create trigger update_profiles_updated_at before update on public.profiles
for each row execute function public.update_updated_at_column();

-- NEW USER HANDLER
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nome, escola_nome, cargo)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nome', ''),
    coalesce(new.raw_user_meta_data ->> 'escola_nome', ''),
    coalesce(new.raw_user_meta_data ->> 'cargo', '')
  );
  insert into public.user_roles (user_id, role)
  values (new.id, coalesce((new.raw_user_meta_data ->> 'cargo')::app_role, 'coordenador'))
  on conflict do nothing;
  return new;
end; $$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- TURMAS
create table public.turmas (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade not null,
  nome text not null,
  serie text not null default '',
  turno text not null default 'Manhã',
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.turmas to authenticated;
grant all on public.turmas to service_role;
alter table public.turmas enable row level security;
create policy "Users manage own turmas" on public.turmas for all to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- ALUNOS
create table public.alunos (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade not null,
  turma_id uuid references public.turmas(id) on delete set null,
  nome text not null,
  turma_nome text not null default '',
  frequencia numeric not null default 100,
  media numeric not null default 0,
  status text not null default 'regular',
  responsavel text not null default '',
  telefone text not null default '',
  motivo_risco text not null default '',
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.alunos to authenticated;
grant all on public.alunos to service_role;
alter table public.alunos enable row level security;
create policy "Users manage own alunos" on public.alunos for all to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create index idx_alunos_owner on public.alunos(owner_id);
create index idx_turmas_owner on public.turmas(owner_id);