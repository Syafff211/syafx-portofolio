# Muhammad Syafiq Portfolio — Supabase Ready

React + TypeScript portfolio with Supabase Auth, PostgreSQL, Storage and RLS-ready CMS.

## 1. Install

```bash
npm install
```

## 2. Configure Supabase

Create `.env.local`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
```

Never put a `service_role` key in the frontend.

## 3. Database

Open Supabase Dashboard → SQL Editor and run:

`supabase/schema.sql`

## 4. Create the admin account

In Supabase Dashboard → Authentication → Users, create the admin email/password.

Copy that user's UUID, then run in SQL Editor:

```sql
insert into public.admin_users(user_id)
values ('YOUR-AUTH-USER-UUID');
```

Only users in `admin_users` can perform CMS CRUD operations.

## 5. Run

```bash
npm run dev
```

## 6. Production

Deploy to Vercel and add the same two `VITE_` environment variables in Project Settings.

The public site reads published/active content from Supabase. Contact form submissions are stored in `messages`. Admin changes are immediately reflected after the public page reloads.
