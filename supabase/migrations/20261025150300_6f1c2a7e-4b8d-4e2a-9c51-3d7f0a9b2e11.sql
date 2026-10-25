create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price_cents integer not null check (price_cents >= 0),
  image_path text,
  in_stock boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'paid', 'shipped', 'cancelled')),
  total_cents integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  quantity integer not null check (quantity > 0),
  unit_price_cents integer not null
);

create index orders_user_id_idx on public.orders(user_id);
create index order_items_order_id_idx on public.order_items(order_id);
create index order_items_product_id_idx on public.order_items(product_id);

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Profiles are readable by their owner" on public.profiles for select using ((select auth.uid()) = id);
create policy "Profiles are editable by their owner" on public.profiles for update using ((select auth.uid()) = id);
create policy "Products are readable by everyone" on public.products for select using (true);
create policy "Orders are readable by their owner" on public.orders for select using ((select auth.uid()) = user_id);
create policy "Orders are created by their owner" on public.orders for insert with check ((select auth.uid()) = user_id);
create policy "Order items are readable by the order's owner" on public.order_items for select
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = (select auth.uid())));
create policy "Order items are created by the order's owner" on public.order_items for insert
  with check (exists (select 1 from public.orders o where o.id = order_id and o.user_id = (select auth.uid())));

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name) values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true);
create policy "Product images are readable by everyone" on storage.objects for select using (bucket_id = 'product-images');
