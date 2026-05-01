create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(12,2) not null default 0,
  original_price numeric(12,2),
  image text,
  category text not null default 'General',
  collection text not null default 'General',
  stock integer not null default 0,
  sku text,
  sizes text[] not null default '{}',
  status text not null default 'active' check (status in ('active','inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  role text not null default 'admin' check (role in ('admin')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_status_idx on public.products(status);
create index if not exists products_collection_idx on public.products(collection);
create index if not exists admin_users_email_idx on public.admin_users(email);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists trg_admin_users_updated_at on public.admin_users;
create trigger trg_admin_users_updated_at
before update on public.admin_users
for each row execute function public.set_updated_at();
