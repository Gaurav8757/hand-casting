create table customer_visits (
  id uuid default gen_random_uuid() primary key,
  page_visited text,
  user_agent text,
  ip_address text,
  browser text,
  os text,
  device_type text,
  device_name text,
  created_at timestamp default now()
);
