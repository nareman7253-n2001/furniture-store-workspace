export const COMPANY = {
  name: "Atelier Works",
  tagline: "Office furniture & complete workspace solutions",
  phone: "+1 (415) 555-0142",
  whatsapp: "14155550142",
  email: "studio@atelierworks.com",
  address: "1240 Warehouse Row, Suite 300, San Francisco, CA",
  hours: "Mon–Fri, 9:00–18:00",
};

export function whatsappLink(message = "Hello Atelier Works, I'd like to discuss an office project.") {
  return `https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(message)}`;
}
