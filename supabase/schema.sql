-- Muhammad Syafiq Portfolio / Supabase schema
-- Run this in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.admin_users where user_id = auth.uid());
$$;
grant execute on function public.is_admin() to anon, authenticated;

create table if not exists public.profiles (
 id uuid primary key default gen_random_uuid(), name text not null, title text not null default 'Developer', headline text not null default '', bio text not null default '', avatar text not null default '', email text not null default '', phone text not null default '', location text not null default '', cv_url text not null default '', availability boolean not null default true, about text not null default '', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.skills (
 id uuid primary key default gen_random_uuid(), name text not null, category text not null, icon text not null default 'Code2', level integer check(level between 0 and 100), display_order integer not null default 0, published boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.projects (
 id uuid primary key default gen_random_uuid(), title text not null, slug text not null unique, thumbnail text not null default '', gallery text[] not null default '{}', description text not null default '', content text not null default '', category text not null default 'Web', technologies text[] not null default '{}', live_url text not null default '', github_url text not null default '', featured boolean not null default false, published boolean not null default true, project_date date, display_order integer not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.experiences (
 id uuid primary key default gen_random_uuid(), position text not null, company text not null, location text not null default '', start_date date not null, end_date date, current boolean not null default false, description text not null default '', technologies text[] not null default '{}', display_order integer not null default 0, published boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.education (
 id uuid primary key default gen_random_uuid(), institution text not null, degree text not null, field text not null default '', start_date date not null, end_date date, description text not null default '', logo text not null default '', display_order integer not null default 0, published boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.messages (
 id uuid primary key default gen_random_uuid(), name text not null, email text not null, subject text not null, message text not null, status text not null default 'unread' check(status in ('unread','read','replied','archived')), created_at timestamptz not null default now()
);
create table if not exists public.social_media (
 id uuid primary key default gen_random_uuid(), platform text not null, url text not null, icon text not null default 'Globe', active boolean not null default true, display_order integer not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.site_settings (
 id uuid primary key default gen_random_uuid(), site_title text not null default 'Muhammad Syafiq', site_description text not null default '', favicon text not null default '', logo text not null default '', dark_mode boolean not null default true, light_mode boolean not null default true, primary_color text not null default '#3b82f6', accent_color text not null default '#8b5cf6', meta_title text not null default 'Muhammad Syafiq — Developer', meta_description text not null default '', keywords text[] not null default '{}', og_image text not null default '', email text not null default '', whatsapp text not null default '', location text not null default '', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.skills enable row level security;
alter table public.projects enable row level security;
alter table public.experiences enable row level security;
alter table public.education enable row level security;
alter table public.messages enable row level security;
alter table public.social_media enable row level security;
alter table public.site_settings enable row level security;
alter table public.admin_users enable row level security;

-- Public read policies
create policy "public read profile" on public.profiles for select using (true);
create policy "public read published skills" on public.skills for select using (published = true or public.is_admin());
create policy "public read published projects" on public.projects for select using (published = true or public.is_admin());
create policy "public read published experience" on public.experiences for select using (published = true or public.is_admin());
create policy "public read published education" on public.education for select using (published = true or public.is_admin());
create policy "public read active social" on public.social_media for select using (active = true or public.is_admin());
create policy "public read settings" on public.site_settings for select using (true);
create policy "public submit messages" on public.messages for insert with check (true);
create policy "admins read messages" on public.messages for select using (public.is_admin());
create policy "admins update messages" on public.messages for update using (public.is_admin()) with check (public.is_admin());
create policy "admins delete messages" on public.messages for delete using (public.is_admin());

-- Admin write policies
create policy "admins manage profile" on public.profiles for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage skills" on public.skills for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage projects" on public.projects for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage experience" on public.experiences for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage education" on public.education for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage social" on public.social_media for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage settings" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());

-- Seed one profile/settings row. Replace values after running.
insert into public.profiles (name,title,headline,bio,email,phone,location,availability,about)
select 'Muhammad Syafiq','Full-Stack Developer','Building modern digital experiences with code.','Developer focused on building modern web applications.','','','Indonesia',true,'I enjoy turning ideas into useful, polished digital products.'
where not exists(select 1 from public.profiles);
insert into public.site_settings (site_title,site_description,meta_title,meta_description)
select 'Muhammad Syafiq','Personal developer portfolio','Muhammad Syafiq — Developer','Personal portfolio of Muhammad Syafiq.'
where not exists(select 1 from public.site_settings);

-- Storage bucket for avatar, projects, education logos, CV and site assets.
insert into storage.buckets (id,name,public) values ('portfolio-assets','portfolio-assets',true) on conflict (id) do nothing;
create policy "public read portfolio assets" on storage.objects for select using (bucket_id='portfolio-assets');
create policy "admins upload portfolio assets" on storage.objects for insert with check (bucket_id='portfolio-assets' and public.is_admin());
create policy "admins update portfolio assets" on storage.objects for update using (bucket_id='portfolio-assets' and public.is_admin()) with check (bucket_id='portfolio-assets' and public.is_admin());
create policy "admins delete portfolio assets" on storage.objects for delete using (bucket_id='portfolio-assets' and public.is_admin());

-- IMPORTANT: after creating your admin account in Supabase Auth, run:
-- insert into public.admin_users(user_id) values ('YOUR-AUTH-USER-UUID');
