import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { CMS_QUERY_KEY, fetchCmsRaw } from "@/lib/cms";
import { BUNDLED_IMAGE_KEYS } from "@/lib/assets";
import { ImageField, ImageListField, ImageRefsContext } from "@/components/admin/ImageUploader";
import { collectImageReferences, type UploadFolder } from "@/lib/uploads";
import { LOCALES, LOCALE_META } from "@/lib/i18n";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Control panel — manage site content" },
      { name: "description", content: "Manage products, categories, services, projects and site copy." },
      { property: "og:title", content: "Control panel" },
      { property: "og:description", content: "Manage site content." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

/* -------------------------------------------------- field spec */

type FieldType = "text" | "textarea" | "number" | "bool" | "image" | "images" | "list" | "json";

interface Field {
  name: string;
  label: string;
  type?: FieldType;
  /** Expand into name_en / name_he / name_ar inputs. */
  i18n?: boolean;
  /** i18n list (points_en, points_he …). */
  i18nList?: boolean;
  /** Storage folder for image uploads. */
  folder?: UploadFolder;
}

interface TableSpec {
  table: string;
  label: string;
  pk: string;
  title: (row: any) => string;
  fields: Field[];
  blank: Record<string, any>;
}

const SPECS: TableSpec[] = [
  {
    table: "categories",
    label: "Categories",
    pk: "id",
    title: (r) => r.name_en || r.slug,
    fields: [
      { name: "slug", label: "Slug" },
      { name: "name", label: "Name", i18n: true },
      { name: "description", label: "Description", i18n: true, type: "textarea" },
      { name: "image", label: "Image", type: "image", folder: "categories" },
      { name: "sort", label: "Order", type: "number" },
      { name: "active", label: "Visible", type: "bool" },
    ],
    blank: { slug: "new-category", image: "hero-office.jpg", sort: 99, active: true },
  },
  {
    table: "products",
    label: "Products",
    pk: "id",
    title: (r) => r.name_en || r.slug,
    fields: [
      { name: "slug", label: "Slug" },
      { name: "category_slug", label: "Category slug" },
      { name: "name", label: "Name", i18n: true },
      { name: "description", label: "Short description", i18n: true, type: "textarea" },
      { name: "details", label: "Full details", i18n: true, type: "textarea" },
      { name: "price", label: "Price (₪)", type: "number" },
      { name: "compare_at", label: "Compare-at price", type: "number" },
      { name: "condition", label: "Condition (New / Used)" },
      { name: "availability", label: "Availability (In stock / Made to order)" },
      { name: "images", label: "Images", type: "images", folder: "products" },
      { name: "specifications", label: "Specifications (JSON list of {label, value})", type: "json" },
      { name: "material", label: "Material" },
      { name: "colorways", label: "Colourways", type: "list" },
      { name: "badge", label: "Badge" },
      { name: "lead", label: "Lead time", i18n: true },
      { name: "stock", label: "Stock", type: "number" },
      { name: "featured", label: "Featured", type: "bool" },
      { name: "sort", label: "Order", type: "number" },
      { name: "active", label: "Visible", type: "bool" },
    ],
    blank: {
      slug: "new-product",
      category_slug: "office-desks",
      price: 0,
      condition: "New",
      availability: "In stock",
      images: ["hero-office.jpg"],
      specifications: [],
      colorways: [],
      stock: 0,
      featured: false,
      sort: 99,
      active: true,
    },
  },
  {
    table: "services",
    label: "Services",
    pk: "id",
    title: (r) => r.name_en || r.slug,
    fields: [
      { name: "slug", label: "Slug" },
      { name: "name", label: "Name", i18n: true },
      { name: "summary", label: "Summary", i18n: true, type: "textarea" },
      { name: "points", label: "Bullet points", i18nList: true },
      { name: "sort", label: "Order", type: "number" },
      { name: "active", label: "Visible", type: "bool" },
    ],
    blank: { slug: "new-service", points_en: [], points_he: [], points_ar: [], sort: 99, active: true },
  },
  {
    table: "projects",
    label: "Projects",
    pk: "id",
    title: (r) => r.name_en || r.slug,
    fields: [
      { name: "slug", label: "Slug" },
      { name: "name", label: "Name", i18n: true },
      { name: "type", label: "Type" },
      { name: "location", label: "Location", i18n: true },
      { name: "year", label: "Year" },
      { name: "scope", label: "Scope", i18n: true, type: "textarea" },
      { name: "metric", label: "Metric" , i18n: true },
      { name: "image", label: "Image", type: "image", folder: "projects" },
      { name: "sort", label: "Order", type: "number" },
      { name: "active", label: "Visible", type: "bool" },
    ],
    blank: { slug: "new-project", type: "Corporate Offices", year: "2026", image: "hero-office.jpg", sort: 99, active: true },
  },
];

const SETTINGS_FIELDS: Field[] = [
  { name: "name", label: "Company name" },
  { name: "tagline", label: "Tagline" },
  { name: "phone", label: "Phone" },
  { name: "whatsapp", label: "WhatsApp number (digits only)" },
  { name: "email", label: "Email" },
  { name: "facebook", label: "Facebook URL" },
  { name: "address", label: "Address" },
  { name: "hours", label: "Opening hours" },
];

/* -------------------------------------------------- inputs */

function FieldInput({
  field,
  name,
  value,
  onChange,
}: {
  field: Field;
  name: string;
  value: any;
  onChange: (value: any) => void;
}) {
  const type = field.type ?? "text";

  if (type === "bool") {
    return (
      <div className="flex items-center gap-3">
        <Switch checked={!!value} onCheckedChange={onChange} />
        <span className="text-xs text-muted-foreground">{value ? "Visible" : "Hidden"}</span>
      </div>
    );
  }
  if (type === "textarea") {
    return <Textarea rows={3} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
  }
  if (type === "number") {
    return (
      <Input
        type="number"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
      />
    );
  }
  if (type === "list") {
    return (
      <Textarea
        rows={2}
        value={Array.isArray(value) ? value.join("\n") : ""}
        placeholder="One value per line"
        onChange={(e) => onChange(e.target.value.split("\n").map((v) => v.trim()).filter(Boolean))}
      />
    );
  }
  if (type === "json") {
    return (
      <Textarea
        rows={4}
        defaultValue={JSON.stringify(value ?? [], null, 2)}
        onBlur={(e) => {
          try {
            onChange(JSON.parse(e.target.value));
          } catch {
            toast.error("Invalid JSON");
          }
        }}
      />
    );
  }
  if (type === "image") {
    return <ImageField value={value ?? ""} onChange={onChange} folder={field.folder ?? "branding"} />;
  }
  if (type === "images") {
    return <ImageListField value={value ?? []} onChange={onChange} folder={field.folder ?? "products"} />;
  }
  return <Input id={name} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
}

function FieldRow({
  field,
  draft,
  set,
}: {
  field: Field;
  draft: Record<string, any>;
  set: (key: string, value: any) => void;
}) {
  if (field.i18n || field.i18nList) {
    return (
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-[0.1em]">{field.label}</Label>
        <div className="grid gap-3 md:grid-cols-3">
          {LOCALES.map((loc) => {
            const key = `${field.name}_${loc}`;
            return (
              <div key={key} className="space-y-1">
                <span className="text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground">
                  {LOCALE_META[loc].native}
                </span>
                <FieldInput
                  field={field.i18nList ? { ...field, type: "list" } : field}
                  name={key}
                  value={draft[key]}
                  onChange={(v) => set(key, v)}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-[0.1em]">{field.label}</Label>
      <FieldInput field={field} name={field.name} value={draft[field.name]} onChange={(v) => set(field.name, v)} />
    </div>
  );
}

function RecordForm({
  fields,
  row,
  onSave,
  onDelete,
}: {
  fields: Field[];
  row: Record<string, any>;
  onSave: (draft: Record<string, any>) => Promise<void>;
  onDelete?: () => Promise<void>;
}) {
  const [draft, setDraft] = React.useState<Record<string, any>>(row);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => setDraft(row), [row]);

  const set = (key: string, value: any) => setDraft((d) => ({ ...d, [key]: value }));

  return (
    <div className="space-y-5">
      {fields.map((f) => (
        <FieldRow key={f.name} field={f} draft={draft} set={set} />
      ))}
      <div className="flex gap-3 pt-2">
        <Button
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            await onSave(draft);
            setBusy(false);
          }}
        >
          {busy ? <Loader2 className="size-4 animate-spin" /> : null}
          Save changes
        </Button>
        {onDelete ? (
          <Button
            variant="outline"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              await onDelete();
              setBusy(false);
            }}
          >
            <Trash2 className="size-4" />
            Delete
          </Button>
        ) : null}
      </div>
    </div>
  );
}

/* -------------------------------------------------- page */

function AdminPage() {
  const { loading, session, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: CMS_QUERY_KEY, queryFn: fetchCmsRaw });

  const refresh = () => queryClient.invalidateQueries({ queryKey: CMS_QUERY_KEY });

  React.useEffect(() => {
    if (!loading && !session) navigate({ to: "/auth", replace: true });
  }, [loading, session, navigate]);

  if (loading || !session) {
    return (
      <div className="container-page section-y flex justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }


  if (!isAdmin) {
    return (
      <div className="container-page section-y">
        <h1 className="display-md">No admin access</h1>
        <p className="mt-3 max-w-lg text-sm text-muted-foreground">
          You are signed in as {session.user.email}, but this account has no admin role yet. An
          existing admin needs to grant it.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => signOut()}>
          Sign out
        </Button>
      </div>
    );
  }

  async function saveRow(table: string, pk: string, draft: Record<string, any>) {
    const { [pk]: id, ...payload } = draft;
    const { error } = await supabase.from(table as never).update(payload as never).eq(pk, id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Saved");
    refresh();
  }

  async function insertRow(table: string, blank: Record<string, any>) {
    const { error } = await supabase.from(table as never).insert(blank as never);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Added");
    refresh();
  }

  async function deleteRow(table: string, pk: string, id: any) {
    const { error } = await supabase.from(table as never).delete().eq(pk, id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Deleted");
    refresh();
  }

  return (
    <div className="container-page section-y">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Control panel</p>
          <h1 className="display-md mt-3">Site content</h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            Everything on the website — company details, page copy, catalogue, services and
            projects — in English, Hebrew and Arabic.
          </p>
        </div>
        <Button variant="outline" onClick={() => signOut()}>
          Sign out
        </Button>
      </div>

      {isLoading || !data ? (
        <div className="mt-16 flex justify-center">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <ImageRefsContext.Provider value={collectImageReferences(data)}>
        <Tabs defaultValue="company" className="mt-10">
          <TabsList className="flex-wrap">
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="texts">Page texts</TabsTrigger>
            {SPECS.map((s) => (
              <TabsTrigger key={s.table} value={s.table}>
                {s.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="company" className="mt-8 max-w-2xl">
            <RecordForm
              fields={SETTINGS_FIELDS}
              row={data.settings ?? {}}
              onSave={async (draft) => {
                const { error } = await supabase
                  .from("site_settings")
                  .upsert({ ...draft, id: true } as never);
                if (error) {
      toast.error(error.message);
      return;
    }
                toast.success("Saved");
                refresh();
              }}
            />
          </TabsContent>

          <TabsContent value="texts" className="mt-8">
            <Accordion type="single" collapsible className="max-w-3xl">
              {data.texts.map((row: any) => (
                <AccordionItem key={row.key} value={row.key}>
                  <AccordionTrigger className="text-sm">
                    <span className="truncate text-start">
                      <span className="text-muted-foreground">{row.key}</span>
                      <span className="ms-3">{row.value_en}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <RecordForm
                      fields={[{ name: "value", label: "Text", i18n: true, type: "textarea" }]}
                      row={row}
                      onSave={(draft) => saveRow("site_texts", "key", draft)}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          {SPECS.map((spec) => {
            const rows = (data as any)[spec.table] as any[];
            return (
              <TabsContent key={spec.table} value={spec.table} className="mt-8">
                <Button variant="outline" onClick={() => insertRow(spec.table, spec.blank)}>
                  <Plus className="size-4" />
                  New {spec.label.toLowerCase().replace(/s$/, "")}
                </Button>
                <Accordion type="single" collapsible className="mt-6 max-w-3xl">
                  {rows.map((row) => (
                    <AccordionItem key={row[spec.pk]} value={row[spec.pk]}>
                      <AccordionTrigger className="text-sm">
                        <span className="text-start">
                          {spec.title(row)}
                          {row.active ? null : (
                            <span className="ms-3 text-xs text-muted-foreground">hidden</span>
                          )}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <RecordForm
                          fields={spec.fields}
                          row={row}
                          onSave={(draft) => saveRow(spec.table, spec.pk, draft)}
                          onDelete={() => deleteRow(spec.table, spec.pk, row[spec.pk])}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            );
          })}
        </Tabs>
        </ImageRefsContext.Provider>
      )}
    </div>
  );
}
