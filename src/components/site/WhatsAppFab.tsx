import { MessageCircle } from "lucide-react";

import { useWhatsappLink } from "@/lib/cms";

export function WhatsAppFab() {
  const whatsapp = useWhatsappLink();

  return (
    <a
      href={whatsapp}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 end-5 z-40 grid size-12 place-items-center rounded-full bg-clay text-clay-foreground shadow-soft transition-transform hover:scale-105"
    >
      <MessageCircle className="size-5" />
    </a>
  );
}
