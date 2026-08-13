REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.categories, public.products, public.services, public.projects, public.site_settings, public.site_texts FROM anon;
GRANT SELECT ON public.categories, public.products, public.services, public.projects, public.site_settings, public.site_texts TO anon;
REVOKE ALL ON public.user_roles FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories, public.products, public.services, public.projects, public.site_settings, public.site_texts, public.user_roles TO authenticated;
GRANT ALL ON public.categories, public.products, public.services, public.projects, public.site_settings, public.site_texts, public.user_roles TO service_role;