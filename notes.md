# Supabase Setup for Authentication

Run the following SQL queries in your Supabase SQL Editor to set up the user profiles and link posts to users.

````sql
-- 1. Create a public profiles table (links to auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS) on profiles
alter table public.profiles enable row level security;

-- 3. Create policies for profiles
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- 4. Add user_id foreign key to posts table (if not exists)
alter table public.posts
add column if not exists user_id uuid references auth.users(id);

-- 5. AUTOMATICALLY CREATE PROFILE ON SIGNUP (Crucial Step)
-- Run this to ensure profiles are created when users sign up via the app.

-- Create the function
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

-- Create the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. POSTS TABLE POLICIES (IMPORTANT - Fixes dashboard blank issue)
-- Run these to allow proper access to posts.

-- Enable RLS on posts if not already enabled
alter table public.posts enable row level security;

-- Drop old restrictive policy if it exists
drop policy if exists "Public posts are viewable by everyone." on posts;

-- Create a flexible policy that allows:
-- 1. Authenticated users (logged in) to view ALL posts
-- 2. Anonymous users to view only public posts
create policy "Posts viewable based on auth status."
  on posts for select
  using (
    auth.role() = 'authenticated' OR is_public = true
  );

-- Allow authenticated users to insert posts
create policy "Users can insert their own posts."
  on posts for insert
  with check ( auth.uid() = user_id );

-- Allow users to update their own posts
create policy "Users can update own posts."
  on posts for update
  using ( auth.uid() = user_id );

-- Allow users to delete their own posts
create policy "Users can delete own posts."
  on posts for delete
# Supabase Setup for Authentication

Run the following SQL queries in your Supabase SQL Editor to set up the user profiles and link posts to users.

```sql
-- 1. Create a public profiles table (links to auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS) on profiles
alter table public.profiles enable row level security;

-- 3. Create policies for profiles
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- 4. Add user_id foreign key to posts table (if not exists)
alter table public.posts
add column if not exists user_id uuid references auth.users(id);

-- 5. AUTOMATICALLY CREATE PROFILE ON SIGNUP (Crucial Step)
-- Run this to ensure profiles are created when users sign up via the app.

-- Create the function
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

-- Create the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. POSTS TABLE POLICIES (IMPORTANT - Fixes dashboard blank issue)
-- Run these to allow proper access to posts.

-- Enable RLS on posts if not already enabled
alter table public.posts enable row level security;

-- Drop old restrictive policy if it exists
drop policy if exists "Public posts are viewable by everyone." on posts;

-- Create a flexible policy that allows:
-- 1. Authenticated users (logged in) to view ALL posts
-- 2. Anonymous users to view only public posts
create policy "Posts viewable based on auth status."
  on posts for select
  using (
    auth.role() = 'authenticated' OR is_public = true
  );

-- Allow authenticated users to insert posts
create policy "Users can insert their own posts."
  on posts for insert
  with check ( auth.uid() = user_id );

-- Allow users to update their own posts
create policy "Users can update own posts."
  on posts for update
  using ( auth.uid() = user_id );

-- Allow users to delete their own posts
create policy "Users can delete own posts."
  on posts for delete
  using ( auth.uid() = user_id );
````

## Troubleshooting

### Dashboard shows no posts

If your dashboard at `/dashboard` is blank:

1. Make sure you ran the SQL above, especially section 6 (POSTS TABLE POLICIES)
2. The policy allows authenticated users to see ALL posts
3. Check browser console for errors

### Posts.jsx shows "No projects found" (FRONT PAGE BLANK)

If the home page shows no posts even after logout:

**Most likely cause**: Your posts are not marked as public!

**Quick Fix** - Run this SQL to make all posts public:

```sql
update public.posts set is_public = true;
```

**Alternative** - If you want to allow anonymous users to see all posts (not recommended):

```sql
-- Drop the existing policy
drop policy if exists "Posts viewable based on auth status." on posts;

-- Create a permissive policy (allows everyone to see all posts)
create policy "Posts viewable by everyone."
  on posts for select
  using ( true );
```

### Old posts show "Unknown Author"

If posts created before adding authentication show "Unknown Author":

**Fix** - Update old posts to link them to your user account:

```sql
-- First, get your user ID (run this and copy the ID)
select id, email from auth.users;

-- Then update posts with your user ID (replace 'YOUR-USER-ID-HERE')
update public.posts
set user_id = 'YOUR-USER-ID-HERE'
where user_id is null;
```

### Profile update fails

If updating profile in Settings fails:

1. Make sure you added the `bio` column: `alter table public.profiles add column if not exists bio text;`
2. Check RLS policies allow users to update their own profile

### Trigger already exists error

If you get "trigger already exists" error:

```sql
-- Drop the existing trigger first
drop trigger if exists on_auth_user_created on auth.users;

-- Then create it again (run the trigger creation SQL from section 5)
```
