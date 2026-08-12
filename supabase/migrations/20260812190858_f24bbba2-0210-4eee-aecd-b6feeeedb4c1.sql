
create type public.app_role as enum ('admin','editor');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "users read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);
create policy "admins manage roles" on public.user_roles for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create or replace function public.set_updated_at() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;

create table public.site_settings (
  id boolean primary key default true check (id),
  name text not null default 'Officeline',
  tagline text not null default '',
  phone text not null default '',
  whatsapp text not null default '',
  email text not null default '',
  facebook text not null default '',
  address text not null default '',
  hours text not null default '',
  updated_at timestamptz not null default now()
);

create table public.site_texts (
  key text primary key,
  value_en text not null default '',
  value_he text not null default '',
  value_ar text not null default '',
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null default '', name_he text not null default '', name_ar text not null default '',
  description_en text not null default '', description_he text not null default '', description_ar text not null default '',
  image text not null default '',
  sort int not null default 0,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category_slug text not null default '',
  name_en text not null default '', name_he text not null default '', name_ar text not null default '',
  description_en text not null default '', description_he text not null default '', description_ar text not null default '',
  details_en text not null default '', details_he text not null default '', details_ar text not null default '',
  price numeric not null default 0,
  compare_at numeric,
  condition text not null default 'New',
  availability text not null default 'In stock',
  images text[] not null default '{}',
  specifications jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  stock int not null default 0,
  material text not null default '',
  colorways text[] not null default '{}',
  badge text,
  lead_en text not null default '', lead_he text not null default '', lead_ar text not null default '',
  sort int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null default '', name_he text not null default '', name_ar text not null default '',
  summary_en text not null default '', summary_he text not null default '', summary_ar text not null default '',
  points_en text[] not null default '{}', points_he text[] not null default '{}', points_ar text[] not null default '{}',
  sort int not null default 0,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null default '', name_he text not null default '', name_ar text not null default '',
  type text not null default '',
  location_en text not null default '', location_he text not null default '', location_ar text not null default '',
  year text not null default '',
  scope_en text not null default '', scope_he text not null default '', scope_ar text not null default '',
  metric_en text not null default '', metric_he text not null default '', metric_ar text not null default '',
  image text not null default '',
  sort int not null default 0,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

grant select on public.site_settings to anon;
grant select, insert, update, delete on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "public read site_settings" on public.site_settings for select to anon, authenticated using (true);
create policy "admins write site_settings" on public.site_settings for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger set_site_settings_updated_at before update on public.site_settings for each row execute function public.set_updated_at();

grant select on public.site_texts to anon;
grant select, insert, update, delete on public.site_texts to authenticated;
grant all on public.site_texts to service_role;
alter table public.site_texts enable row level security;
create policy "public read site_texts" on public.site_texts for select to anon, authenticated using (true);
create policy "admins write site_texts" on public.site_texts for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger set_site_texts_updated_at before update on public.site_texts for each row execute function public.set_updated_at();

grant select on public.categories to anon;
grant select, insert, update, delete on public.categories to authenticated;
grant all on public.categories to service_role;
alter table public.categories enable row level security;
create policy "public read categories" on public.categories for select to anon, authenticated using (true);
create policy "admins write categories" on public.categories for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger set_categories_updated_at before update on public.categories for each row execute function public.set_updated_at();

grant select on public.products to anon;
grant select, insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;
create policy "public read products" on public.products for select to anon, authenticated using (true);
create policy "admins write products" on public.products for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger set_products_updated_at before update on public.products for each row execute function public.set_updated_at();

grant select on public.services to anon;
grant select, insert, update, delete on public.services to authenticated;
grant all on public.services to service_role;
alter table public.services enable row level security;
create policy "public read services" on public.services for select to anon, authenticated using (true);
create policy "admins write services" on public.services for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger set_services_updated_at before update on public.services for each row execute function public.set_updated_at();

grant select on public.projects to anon;
grant select, insert, update, delete on public.projects to authenticated;
grant all on public.projects to service_role;
alter table public.projects enable row level security;
create policy "public read projects" on public.projects for select to anon, authenticated using (true);
create policy "admins write projects" on public.projects for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger set_projects_updated_at before update on public.projects for each row execute function public.set_updated_at();

insert into public.site_settings (id,name,tagline,phone,whatsapp,email,facebook,address,hours) values (true,'Officeline','Office furniture & complete workspace solutions','+972 52-905-6909','972529056909','m0529056909@gmail.com','https://facebook.com/profile.php?id=100055115784827','סימטת הבוקרים 6, 4922297','Mon–Fri, 9:00–18:00');
insert into public.site_texts (key, value_en) values ('home.hero.eyebrow','Office furniture & workspace solutions');
insert into public.site_texts (key, value_en) values ('home.hero.title','Furniture that makes an office work.');
insert into public.site_texts (key, value_en) values ('home.hero.subtitle','New and used office furniture, complete workspace projects, delivery and installation — from a single desk to an entire floor.');
insert into public.site_texts (key, value_en) values ('home.hero.cta_primary','Browse the shop');
insert into public.site_texts (key, value_en) values ('home.hero.cta_secondary','Request a quote');
insert into public.site_texts (key, value_en) values ('home.categories.eyebrow','Catalogue');
insert into public.site_texts (key, value_en) values ('home.categories.title','Shop by category');
insert into public.site_texts (key, value_en) values ('home.featured.eyebrow','Selected pieces');
insert into public.site_texts (key, value_en) values ('home.featured.title','Featured products');
insert into public.site_texts (key, value_en) values ('home.solutions.eyebrow','Complete offices');
insert into public.site_texts (key, value_en) values ('home.solutions.title','We furnish the whole office, not just the desk.');
insert into public.site_texts (key, value_en) values ('home.solutions.body','Planning, specification, procurement, delivery and installation under one contract.');
insert into public.site_texts (key, value_en) values ('home.services.eyebrow','What we do');
insert into public.site_texts (key, value_en) values ('home.services.title','Services');
insert into public.site_texts (key, value_en) values ('home.projects.eyebrow','Selected work');
insert into public.site_texts (key, value_en) values ('home.projects.title','Recent projects');
insert into public.site_texts (key, value_en) values ('home.why.eyebrow','Why us');
insert into public.site_texts (key, value_en) values ('home.why.title','Why choose us');
insert into public.site_texts (key, value_en) values ('cta.eyebrow','Start a project');
insert into public.site_texts (key, value_en) values ('cta.title','Tell us about your space.');
insert into public.site_texts (key, value_en) values ('cta.description','Share a floor plan, a headcount or a rough idea. We''ll come back within one working day with a specification and an indicative budget.');

insert into public.categories (slug,name_en,description_en,image,sort) values ('office-desks','Office Desks','Height-adjustable, bench and single desks in oak, walnut and steel.','cat-desks.jpg',0);
insert into public.categories (slug,name_en,description_en,image,sort) values ('office-chairs','Office Chairs','Ergonomic task seating engineered for eight-hour days.','cat-chairs.jpg',1);
insert into public.categories (slug,name_en,description_en,image,sort) values ('executive-furniture','Executive Furniture','Directors'' desks, credenzas and leather seating.','cat-executive.jpg',2);
insert into public.categories (slug,name_en,description_en,image,sort) values ('reception-furniture','Reception Furniture','Counters, lounge seating and first-impression pieces.','project-reception.jpg',3);
insert into public.categories (slug,name_en,description_en,image,sort) values ('storage-cabinets','Storage & Cabinets','Pedestals, lockers and acoustic storage walls.','cat-storage.jpg',4);
insert into public.categories (slug,name_en,description_en,image,sort) values ('meeting-room-furniture','Meeting Room Furniture','Conference tables, boardroom seating and AV-ready surfaces.','project-meeting.jpg',5);
insert into public.categories (slug,name_en,description_en,image,sort) values ('workstations','Workstations','Modular bench systems with screens, power and cable management.','complete-office.jpg',6);
insert into public.categories (slug,name_en,description_en,image,sort) values ('accessories','Accessories','Monitor arms, task lighting, acoustic panels and cable trays.','cat-chairs.jpg',7);
insert into public.products (slug,category_slug,name_en,description_en,details_en,price,compare_at,condition,availability,images,specifications,featured,stock,material,colorways,badge,lead_en,sort) values ('executive-office-desk','executive-furniture','Executive Office Desk','2.2m directors'' desk in walnut veneer with concealed power.','A managerial desk built for daily commercial use: 25mm walnut veneer top on a bronzed steel understructure, cable spine, two grommets and an optional matching credenza.',8900,9800,'New','Made to order',ARRAY['cat-executive.jpg','hero-office.jpg','project-meeting.jpg']::text[],'[{"label":"Dimensions","value":"220 × 90 × 75 cm"},{"label":"Top","value":"25mm walnut veneer"},{"label":"Frame","value":"Bronzed steel"},{"label":"Warranty","value":"10 years"}]'::jsonb,true,0,'Walnut veneer / bronzed steel',ARRAY['Walnut','Ebony']::text[],'Made to order','6–8 weeks',0);
insert into public.products (slug,category_slug,name_en,description_en,details_en,price,compare_at,condition,availability,images,specifications,featured,stock,material,colorways,badge,lead_en,sort) values ('height-adjustable-desk','office-desks','Height Adjustable Desk','Dual-motor sit-stand desk with a solid oak top and silent lift.','Electric dual-motor frame with three memory presets, anti-collision sensing and a 25mm solid oak top. Integrated cable tray keeps the floor clear at any height.',4290,4790,'New','In stock',ARRAY['p-adjustable-desk.jpg','cat-desks.jpg','hero-office.jpg']::text[],'[{"label":"Dimensions","value":"160 × 80 cm"},{"label":"Height range","value":"65–130 cm"},{"label":"Load","value":"120 kg"},{"label":"Warranty","value":"10 years frame"}]'::jsonb,true,24,'Solid oak / powder-coated steel',ARRAY['Natural oak','Smoked oak','Graphite']::text[],'Best seller','Ships in 3 days',1);
insert into public.products (slug,category_slug,name_en,description_en,details_en,price,compare_at,condition,availability,images,specifications,featured,stock,material,colorways,badge,lead_en,sort) values ('modern-workstation','workstations','Modern Workstation','Four-person bench with beam-routed power and modesty screens.','A shared bench system tuned for 1.4m spans. Beam-routed power, tool-free screen mounting and a footprint that scales cleanly across an open floor.',11800,NULL,'New','Made to order',ARRAY['complete-office.jpg','cat-desks.jpg','hero-office.jpg']::text[],'[{"label":"Configuration","value":"4 positions"},{"label":"Span","value":"140 cm per position"},{"label":"Power","value":"Beam-routed, 8 sockets"},{"label":"Screens","value":"PET acoustic felt"}]'::jsonb,true,0,'Laminate / steel beam frame',ARRAY['Oak / graphite','Bone / bone']::text[],NULL,'4 weeks',2);
insert into public.products (slug,category_slug,name_en,description_en,details_en,price,compare_at,condition,availability,images,specifications,featured,stock,material,colorways,badge,lead_en,sort) values ('ergonomic-office-chair','office-chairs','Ergonomic Office Chair','Weight-responsive recline, adjustable lumbar and 4D arms.','Certified for 24-hour use, with a recycled mesh back, seat-depth slider and fully disassemblable construction for end-of-life recycling.',2450,NULL,'New','In stock',ARRAY['p-ergonomic-chair.jpg','cat-chairs.jpg','hero-office.jpg']::text[],'[{"label":"Mechanism","value":"Weight-responsive synchro"},{"label":"Arms","value":"4D adjustable"},{"label":"Back","value":"Recycled mesh"},{"label":"Warranty","value":"8 years"}]'::jsonb,true,48,'Recycled mesh / cast aluminium',ARRAY['Charcoal','Bone','Clay']::text[],'Best seller','Ships in 3 days',3);
insert into public.products (slug,category_slug,name_en,description_en,details_en,price,compare_at,condition,availability,images,specifications,featured,stock,material,colorways,badge,lead_en,sort) values ('executive-office-chair','executive-furniture','Executive Office Chair','High-back leather seating with polished aluminium base.','A directors'' chair with a high back, full-grain leather upholstery, knee-tilt mechanism and a hand-polished aluminium five-star base.',3980,NULL,'New','In stock',ARRAY['cat-chairs.jpg','cat-executive.jpg']::text[],'[{"label":"Upholstery","value":"Full-grain leather"},{"label":"Mechanism","value":"Knee tilt with lock"},{"label":"Base","value":"Polished aluminium"},{"label":"Warranty","value":"5 years"}]'::jsonb,false,9,'Full-grain leather / aluminium',ARRAY['Black','Cognac']::text[],NULL,'Ships in 1 week',4);
insert into public.products (slug,category_slug,name_en,description_en,details_en,price,compare_at,condition,availability,images,specifications,featured,stock,material,colorways,badge,lead_en,sort) values ('visitor-chair','reception-furniture','Visitor Chair','Upholstered guest chair on solid oak legs, stackable pairs.','A quiet, comfortable guest chair for meeting rooms and waiting areas. Contract-grade fabric, moulded foam seat and solid oak legs with felt glides.',890,NULL,'New','In stock',ARRAY['p-visitor-chair.jpg','project-reception.jpg']::text[],'[{"label":"Dimensions","value":"56 × 58 × 78 cm"},{"label":"Frame","value":"Solid oak"},{"label":"Fabric","value":"Contract-grade, 100k rubs"},{"label":"Warranty","value":"5 years"}]'::jsonb,false,62,'Contract fabric / solid oak',ARRAY['Sand','Clay','Charcoal']::text[],'In stock','Ships in 3 days',5);
insert into public.products (slug,category_slug,name_en,description_en,details_en,price,compare_at,condition,availability,images,specifications,featured,stock,material,colorways,badge,lead_en,sort) values ('reception-desk','reception-furniture','Reception Desk','Front-of-house counter with accessible lower return.','A sculptural welcome counter in composite stone and oak veneer, with an accessible lower return, integrated lighting and full cable management.',14500,NULL,'New','Made to order',ARRAY['project-reception.jpg','hero-office.jpg']::text[],'[{"label":"Dimensions","value":"280 × 90 × 110 cm"},{"label":"Surface","value":"Composite stone"},{"label":"Lighting","value":"Integrated LED"},{"label":"Accessibility","value":"Lower return included"}]'::jsonb,true,0,'Composite stone / oak veneer',ARRAY['Bone stone','Grey stone']::text[],NULL,'8 weeks',6);
insert into public.products (slug,category_slug,name_en,description_en,details_en,price,compare_at,condition,availability,images,specifications,featured,stock,material,colorways,badge,lead_en,sort) values ('meeting-room-table','meeting-room-furniture','Meeting Room Table','3.2m conference table seating twelve, AV-ready surface.','Flush AV grommets, an under-table power rail and a plinth base that keeps the floor clear for chairs and cabling.',12900,NULL,'New','Made to order',ARRAY['project-meeting.jpg','hero-office.jpg']::text[],'[{"label":"Dimensions","value":"320 × 120 × 74 cm"},{"label":"Seats","value":"12"},{"label":"AV","value":"Flush grommets + power rail"},{"label":"Base","value":"Steel plinth"}]'::jsonb,true,0,'Oak veneer / steel plinth',ARRAY['Natural oak','Fumed oak']::text[],'New','5 weeks',7);
insert into public.products (slug,category_slug,name_en,description_en,details_en,price,compare_at,condition,availability,images,specifications,featured,stock,material,colorways,badge,lead_en,sort) values ('conference-chair','meeting-room-furniture','Conference Chair','Stackable mesh-back meeting chair with chrome frame.','Designed for boardrooms and training spaces: stacks four high, linkable side to side, with a breathable mesh back and upholstered seat.',740,NULL,'Used','In stock',ARRAY['p-conference-chair.jpg','project-meeting.jpg']::text[],'[{"label":"Stacking","value":"4 high"},{"label":"Frame","value":"Chrome steel"},{"label":"Back","value":"Mesh"},{"label":"Condition","value":"Professionally refurbished"}]'::jsonb,false,36,'Mesh / chrome steel',ARRAY['Black']::text[],NULL,'Ships in 3 days',8);
insert into public.products (slug,category_slug,name_en,description_en,details_en,price,compare_at,condition,availability,images,specifications,featured,stock,material,colorways,badge,lead_en,sort) values ('office-storage-cabinet','storage-cabinets','Office Storage Cabinet','Acoustic storage wall that divides space and cuts reverberation.','A room-dividing storage system with PET acoustic backing, adjustable shelves and lockable tambour doors.',6300,NULL,'Used','In stock',ARRAY['cat-storage.jpg','project-meeting.jpg']::text[],'[{"label":"Dimensions","value":"200 × 45 × 160 cm"},{"label":"Doors","value":"Lockable tambour"},{"label":"Acoustics","value":"PET felt backing"},{"label":"Condition","value":"Professionally refurbished"}]'::jsonb,false,7,'Laminate / PET acoustic felt',ARRAY['Bone','Clay','Graphite']::text[],NULL,'Ships in 1 week',9);
insert into public.products (slug,category_slug,name_en,description_en,details_en,price,compare_at,condition,availability,images,specifications,featured,stock,material,colorways,badge,lead_en,sort) values ('mobile-pedestal','storage-cabinets','Mobile Pedestal','Three-drawer under-desk pedestal on soft-braked castors.','Rolls under any 75cm desk. Soft-close drawers, a central lock and a cushioned top that doubles as informal seating.',690,NULL,'New','In stock',ARRAY['p-pedestal.jpg','cat-storage.jpg']::text[],'[{"label":"Dimensions","value":"42 × 60 × 60 cm"},{"label":"Drawers","value":"3, soft-close"},{"label":"Lock","value":"Central, keyed"},{"label":"Castors","value":"Soft-braked"}]'::jsonb,false,84,'Oak laminate / steel',ARRAY['Natural oak','Bone','Graphite']::text[],'In stock','Ships in 3 days',10);
insert into public.products (slug,category_slug,name_en,description_en,details_en,price,compare_at,condition,availability,images,specifications,featured,stock,material,colorways,badge,lead_en,sort) values ('filing-cabinet','storage-cabinets','Filing Cabinet','Four-drawer steel filing cabinet with anti-tilt interlock.','Full-extension runners, foolscap and A4 filing, anti-tilt interlock and a powder-coated finish that survives daily office use.',1180,NULL,'New','In stock',ARRAY['p-filing-cabinet.jpg','cat-storage.jpg']::text[],'[{"label":"Dimensions","value":"47 × 62 × 132 cm"},{"label":"Drawers","value":"4, full extension"},{"label":"Filing","value":"A4 / foolscap"},{"label":"Safety","value":"Anti-tilt interlock"}]'::jsonb,false,31,'Powder-coated steel',ARRAY['Off-white','Graphite']::text[],NULL,'Ships in 3 days',11);
insert into public.products (slug,category_slug,name_en,description_en,details_en,price,compare_at,condition,availability,images,specifications,featured,stock,material,colorways,badge,lead_en,sort) values ('dual-monitor-arm','accessories','Dual Monitor Arm','Gas-spring arm carrying two 32" displays, tool-free clamp.','Independent gas-spring articulation per screen, integrated cable routing and a clamp that fits desk tops up to 90mm.',620,NULL,'New','In stock',ARRAY['cat-chairs.jpg','cat-desks.jpg']::text[],'[{"label":"Screens","value":"2 × up to 32\""},{"label":"Load","value":"9 kg per arm"},{"label":"Mount","value":"Clamp or grommet"},{"label":"VESA","value":"75 / 100"}]'::jsonb,false,120,'Aluminium',ARRAY['Black','Silver']::text[],NULL,'Ships in 3 days',12);
insert into public.products (slug,category_slug,name_en,description_en,details_en,price,compare_at,condition,availability,images,specifications,featured,stock,material,colorways,badge,lead_en,sort) values ('single-office-desk','office-desks','Single Office Desk','Fixed-height 140cm desk with cable tray and modesty panel.','The everyday workhorse: 140 × 70cm laminate top, welded steel A-frame, under-desk cable tray and a fabric modesty panel.',1650,NULL,'Used','In stock',ARRAY['cat-desks.jpg','complete-office.jpg']::text[],'[{"label":"Dimensions","value":"140 × 70 × 74 cm"},{"label":"Frame","value":"Welded steel A-frame"},{"label":"Cable tray","value":"Included"},{"label":"Condition","value":"Professionally refurbished"}]'::jsonb,false,18,'Laminate / steel',ARRAY['Oak','Bone']::text[],NULL,'Ships in 1 week',13);
insert into public.services (slug,name_en,summary_en,points_en,sort) values ('office-furnishing','Office Furnishing','End-to-end furnishing of a whole floor or building — specification, procurement, delivery and handover.',ARRAY['Budget & specification','Supplier coordination','Single-contract delivery']::text[],0);
insert into public.services (slug,name_en,summary_en,points_en,sort) values ('workspace-planning','Workspace Planning','Space studies, occupancy modelling and 2D/3D layouts that make every square metre earn its place.',ARRAY['Occupancy analysis','CAD floor plans','3D visualisation']::text[],1);
insert into public.services (slug,name_en,summary_en,points_en,sort) values ('delivery-installation','Delivery & Installation','Certified installation crews, out-of-hours access, packaging removal and a signed snag-free handover.',ARRAY['Out-of-hours installs','Building compliance','Waste removal']::text[],2);
insert into public.services (slug,name_en,summary_en,points_en,sort) values ('office-clearance','Office Clearance','Decommission, resale and responsible recycling of existing furniture, with a diversion report.',ARRAY['Asset buy-back','Certified recycling','Diversion reporting']::text[],3);
insert into public.projects (slug,name_en,type,location_en,year,scope_en,image,metric_en,sort) values ('open-plan-headquarters','Open-Plan Headquarters','Corporate Offices','Business park','2025','Full-floor furnishing across three levels of open-plan workspace.','hero-office.jpg','Full floor',0);
insert into public.projects (slug,name_en,type,location_en,year,scope_en,image,metric_en,sort) values ('boardroom-suite','Boardroom & Meeting Suite','Meeting Rooms','City centre office','2025','Boardroom and four meeting suites with AV-integrated tables.','project-meeting.jpg','5 rooms',1);
insert into public.projects (slug,name_en,type,location_en,year,scope_en,image,metric_en,sort) values ('front-of-house-reception','Front-of-House Reception','Reception Areas','Commercial tower','2024','Welcome counter, lounge seating and wayfinding joinery.','project-reception.jpg','Reception floor',2);
insert into public.projects (slug,name_en,type,location_en,year,scope_en,image,metric_en,sort) values ('executive-suite','Executive Suite','Executive Offices','Corporate campus','2024','Executive offices in walnut with matching credenzas.','cat-executive.jpg','6 suites',3);
