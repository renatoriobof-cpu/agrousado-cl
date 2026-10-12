
create table if not exists tractores (
  id uuid default gen_random_uuid() primary key,
  marca text not null,
  modelo text not null,
  anio int not null,
  horas int not null,
  valor bigint not null,
  documentacion boolean default false,
  telefono text not null,
  ciudad text not null,
  calle text,
  descripcion text,
  checkin boolean default false,
  youtube_url text,
  fotos text[] default '{}',
  estado text default 'pendiente' check (estado in ('pendiente','aprobado','baja')),
  created_at timestamp default now()
);
alter table tractores enable row level security;
drop policy if exists "public read aprobados" on tractores;
create policy "public read aprobados" on tractores for select using (estado = 'aprobado');
drop policy if exists "public insert" on tractores;
create policy "public insert" on tractores for insert with check (true);
drop policy if exists "admin todo" on tractores;
create policy "admin todo" on tractores for all using (true) with check (true);
