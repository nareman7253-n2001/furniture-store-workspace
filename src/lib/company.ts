export const COMPANY = {
  name: "Atelier Works",
  tagline: "Office furniture & complete workspace solutions",
  phone: "+972 52-905-6909",
  whatsapp: "972529056909",
  email: "m0529056909@gmail.com",
  facebook: "https://facebook.com/profile.php?id=100055115784827",
  address: "1240 Warehouse Row, Suite 300, San Francisco, CA",
  hours: "Mon–Fri, 9:00–18:00",
};

export function whatsappLink(message = "Hello Atelier Works, I'd like to discuss an office project.") {
  return `https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(message)}`;
}
