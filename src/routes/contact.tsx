import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";

import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ContactForm } from "@/components/site/ContactForm";
import { Button } from "@/components/ui/button";
import { COMPANY, whatsappLink } from "@/lib/company";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact ${COMPANY.name} — Office Furniture Enquiries` },
      {
        name: "description",
        content:
          "Talk to a workspace consultant about office furniture, furnishing projects, installation or clearance. Reply within one working day.",
      },
      { property: "og:title", content: `Contact ${COMPANY.name}` },
      {
        property: "og:description",
        content: "Send a brief or message us on WhatsApp — we reply within one working day.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <>
      <section className="container-page pt-8 pb-14">
        <Breadcrumbs items={[{ label: "Contact" }]} />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow">Contact</p>
            <h1 className="display-lg mt-4 text-balance">Tell us what you're furnishing.</h1>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            Send a brief, a floor plan or just a headcount. For quick questions, WhatsApp is
            fastest during studio hours.
          </p>
        </div>
      </section>

      <section className="hairline-t pt-14 pb-20">
        <div className="container-page grid gap-16 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="label-caps text-muted-foreground">Project enquiry</h2>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <aside className="space-y-10">
            <div className="border-t border-hairline pt-6">
              <p className="eyebrow">Studio</p>
              <address className="mt-4 space-y-2 text-sm not-italic text-muted-foreground">
                <p className="text-foreground">{COMPANY.address}</p>
                <p>{COMPANY.hours}</p>
              </address>
            </div>
            <div className="border-t border-hairline pt-6">
              <p className="eyebrow">Direct</p>
              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <a
                    href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
                    className="link-underline text-foreground"
                  >
                    {COMPANY.phone}
                  </a>
                </p>
                <p>
                  <a href={`mailto:${COMPANY.email}`} className="link-underline text-foreground">
                    {COMPANY.email}
                  </a>
                </p>
              </div>
              <Button asChild variant="clay" className="mt-6 w-full sm:w-auto">
                <a href={whatsappLink()} target="_blank" rel="noreferrer">
                  <MessageCircle className="size-4" />
                  Chat on WhatsApp
                </a>
              </Button>
            </div>
            <div className="border-t border-hairline pt-6">
              <p className="eyebrow">Trade & tenders</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                We respond to public tenders and framework agreements. Send documentation to{" "}
                <a href={`mailto:${COMPANY.email}`} className="text-foreground">
                  {COMPANY.email}
                </a>
                .
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
