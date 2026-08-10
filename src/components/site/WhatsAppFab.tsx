import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/company";

export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 end-5 z-40 grid size-13 place-items-center rounded-full bg-clay text-clay-foreground shadow-lift transition-transform hover:scale-105"
    >
      <MessageCircle className="size-5" />
    </a>
  );
}
