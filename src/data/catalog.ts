import deskImg from "@/assets/cat-desks.jpg";
import chairImg from "@/assets/cat-chairs.jpg";
import executiveImg from "@/assets/cat-executive.jpg";
import receptionImg from "@/assets/project-reception.jpg";
import meetingImg from "@/assets/project-meeting.jpg";
import heroImg from "@/assets/hero-office.jpg";
import storageImg from "@/assets/cat-storage.jpg";
import completeOfficeImg from "@/assets/complete-office.jpg";
import adjustableDeskImg from "@/assets/p-adjustable-desk.jpg";
import ergoChairImg from "@/assets/p-ergonomic-chair.jpg";
import visitorChairImg from "@/assets/p-visitor-chair.jpg";
import pedestalImg from "@/assets/p-pedestal.jpg";
import filingCabinetImg from "@/assets/p-filing-cabinet.jpg";
import conferenceChairImg from "@/assets/p-conference-chair.jpg";

/**
 * Demo catalogue data.
 *
 * Everything below is shaped like a database row set (stable ids, slugs,
 * foreign-key style category slugs, image arrays, stock counters). Swapping
 * these arrays for async fetches from a real backend later does not require
 * any change to the Shop UI — see `src/lib/catalog.ts` for the access layer.
 */

export type CategorySlug =
  | "office-desks"
  | "office-chairs"
  | "executive-furniture"
  | "reception-furniture"
  | "storage-cabinets"
  | "meeting-room-furniture"
  | "workstations"
  | "accessories";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  image: string;
  count: number;
}

export const categories: Category[] = [
  {
    slug: "office-desks",
    name: "Office Desks",
    description: "Height-adjustable, bench and single desks in oak, walnut and steel.",
    image: deskImg,
    count: 42,
  },
  {
    slug: "office-chairs",
    name: "Office Chairs",
    description: "Ergonomic task seating engineered for eight-hour days.",
    image: chairImg,
    count: 36,
  },
  {
    slug: "executive-furniture",
    name: "Executive Furniture",
    description: "Directors' desks, credenzas and leather seating.",
    image: executiveImg,
    count: 18,
  },
  {
    slug: "reception-furniture",
    name: "Reception Furniture",
    description: "Counters, lounge seating and first-impression pieces.",
    image: receptionImg,
    count: 21,
  },
  {
    slug: "storage-cabinets",
    name: "Storage & Cabinets",
    description: "Pedestals, lockers and acoustic storage walls.",
    image: storageImg,
    count: 27,
  },
  {
    slug: "meeting-room-furniture",
    name: "Meeting Room Furniture",
    description: "Conference tables, boardroom seating and AV-ready surfaces.",
    image: meetingImg,
    count: 19,
  },
  {
    slug: "workstations",
    name: "Workstations",
    description: "Modular bench systems with screens, power and cable management.",
    image: completeOfficeImg,
    count: 24,
  },
  {
    slug: "accessories",
    name: "Accessories",
    description: "Monitor arms, task lighting, acoustic panels and cable trays.",
    image: chairImg,
    count: 58,
  },
];

export type ProductCondition = "New" | "Used";
export type ProductAvailability = "In stock" | "Made to order";

export interface Specification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: CategorySlug;
  /** Short catalogue description shown on the product card. */
  description: string;
  /** Longer copy shown on the product detail page. */
  details: string;
  price: number;
  compareAt?: number;
  currency: "ILS";
  condition: ProductCondition;
  availability: ProductAvailability;
  images: string[];
  specifications: Specification[];
  featured: boolean;
  /** Units on hand. 0 with "Made to order" availability is expected. */
  stock: number;
  material: string;
  colorways: string[];
  badge?: "New" | "Best seller" | "Made to order" | "In stock";
  lead: string;
  /** ISO date used by the "Newest" sort. */
  addedAt: string;
}

type ProductSeed = Omit<Product, "currency" | "image"> & { currency?: "ILS" };

const seed: ProductSeed[] = [
  {
    id: "p-001",
    name: "Executive Office Desk",
    slug: "executive-office-desk",
    category: "executive-furniture",
    description: "2.2m directors' desk in walnut veneer with concealed power.",
    details:
      "A managerial desk built for daily commercial use: 25mm walnut veneer top on a bronzed steel understructure, cable spine, two grommets and an optional matching credenza.",
    price: 8900,
    compareAt: 9800,
    condition: "New",
    availability: "Made to order",
    images: [executiveImg, heroImg, meetingImg],
    specifications: [
      { label: "Dimensions", value: "220 × 90 × 75 cm" },
      { label: "Top", value: "25mm walnut veneer" },
      { label: "Frame", value: "Bronzed steel" },
      { label: "Warranty", value: "10 years" },
    ],
    featured: true,
    stock: 0,
    material: "Walnut veneer / bronzed steel",
    colorways: ["Walnut", "Ebony"],
    badge: "Made to order",
    lead: "6–8 weeks",
    addedAt: "2026-01-14",
  },
  {
    id: "p-002",
    name: "Height Adjustable Desk",
    slug: "height-adjustable-desk",
    category: "office-desks",
    description: "Dual-motor sit-stand desk with a solid oak top and silent lift.",
    details:
      "Electric dual-motor frame with three memory presets, anti-collision sensing and a 25mm solid oak top. Integrated cable tray keeps the floor clear at any height.",
    price: 4290,
    compareAt: 4790,
    condition: "New",
    availability: "In stock",
    images: [adjustableDeskImg, deskImg, heroImg],
    specifications: [
      { label: "Dimensions", value: "160 × 80 cm" },
      { label: "Height range", value: "65–130 cm" },
      { label: "Load", value: "120 kg" },
      { label: "Warranty", value: "10 years frame" },
    ],
    featured: true,
    stock: 24,
    material: "Solid oak / powder-coated steel",
    colorways: ["Natural oak", "Smoked oak", "Graphite"],
    badge: "Best seller",
    lead: "Ships in 3 days",
    addedAt: "2026-02-02",
  },
  {
    id: "p-003",
    name: "Modern Workstation",
    slug: "modern-workstation",
    category: "workstations",
    description: "Four-person bench with beam-routed power and modesty screens.",
    details:
      "A shared bench system tuned for 1.4m spans. Beam-routed power, tool-free screen mounting and a footprint that scales cleanly across an open floor.",
    price: 11800,
    condition: "New",
    availability: "Made to order",
    images: [completeOfficeImg, deskImg, heroImg],
    specifications: [
      { label: "Configuration", value: "4 positions" },
      { label: "Span", value: "140 cm per position" },
      { label: "Power", value: "Beam-routed, 8 sockets" },
      { label: "Screens", value: "PET acoustic felt" },
    ],
    featured: true,
    stock: 0,
    material: "Laminate / steel beam frame",
    colorways: ["Oak / graphite", "Bone / bone"],
    lead: "4 weeks",
    addedAt: "2026-01-28",
  },
  {
    id: "p-004",
    name: "Ergonomic Office Chair",
    slug: "ergonomic-office-chair",
    category: "office-chairs",
    description: "Weight-responsive recline, adjustable lumbar and 4D arms.",
    details:
      "Certified for 24-hour use, with a recycled mesh back, seat-depth slider and fully disassemblable construction for end-of-life recycling.",
    price: 2450,
    condition: "New",
    availability: "In stock",
    images: [ergoChairImg, chairImg, heroImg],
    specifications: [
      { label: "Mechanism", value: "Weight-responsive synchro" },
      { label: "Arms", value: "4D adjustable" },
      { label: "Back", value: "Recycled mesh" },
      { label: "Warranty", value: "8 years" },
    ],
    featured: true,
    stock: 48,
    material: "Recycled mesh / cast aluminium",
    colorways: ["Charcoal", "Bone", "Clay"],
    badge: "Best seller",
    lead: "Ships in 3 days",
    addedAt: "2026-02-10",
  },
  {
    id: "p-005",
    name: "Executive Office Chair",
    slug: "executive-office-chair",
    category: "executive-furniture",
    description: "High-back leather seating with polished aluminium base.",
    details:
      "A directors' chair with a high back, full-grain leather upholstery, knee-tilt mechanism and a hand-polished aluminium five-star base.",
    price: 3980,
    condition: "New",
    availability: "In stock",
    images: [chairImg, executiveImg],
    specifications: [
      { label: "Upholstery", value: "Full-grain leather" },
      { label: "Mechanism", value: "Knee tilt with lock" },
      { label: "Base", value: "Polished aluminium" },
      { label: "Warranty", value: "5 years" },
    ],
    featured: false,
    stock: 9,
    material: "Full-grain leather / aluminium",
    colorways: ["Black", "Cognac"],
    lead: "Ships in 1 week",
    addedAt: "2025-12-05",
  },
  {
    id: "p-006",
    name: "Visitor Chair",
    slug: "visitor-chair",
    category: "reception-furniture",
    description: "Upholstered guest chair on solid oak legs, stackable pairs.",
    details:
      "A quiet, comfortable guest chair for meeting rooms and waiting areas. Contract-grade fabric, moulded foam seat and solid oak legs with felt glides.",
    price: 890,
    condition: "New",
    availability: "In stock",
    images: [visitorChairImg, receptionImg],
    specifications: [
      { label: "Dimensions", value: "56 × 58 × 78 cm" },
      { label: "Frame", value: "Solid oak" },
      { label: "Fabric", value: "Contract-grade, 100k rubs" },
      { label: "Warranty", value: "5 years" },
    ],
    featured: false,
    stock: 62,
    material: "Contract fabric / solid oak",
    colorways: ["Sand", "Clay", "Charcoal"],
    badge: "In stock",
    lead: "Ships in 3 days",
    addedAt: "2026-01-06",
  },
  {
    id: "p-007",
    name: "Reception Desk",
    slug: "reception-desk",
    category: "reception-furniture",
    description: "Front-of-house counter with accessible lower return.",
    details:
      "A sculptural welcome counter in composite stone and oak veneer, with an accessible lower return, integrated lighting and full cable management.",
    price: 14500,
    condition: "New",
    availability: "Made to order",
    images: [receptionImg, heroImg],
    specifications: [
      { label: "Dimensions", value: "280 × 90 × 110 cm" },
      { label: "Surface", value: "Composite stone" },
      { label: "Lighting", value: "Integrated LED" },
      { label: "Accessibility", value: "Lower return included" },
    ],
    featured: true,
    stock: 0,
    material: "Composite stone / oak veneer",
    colorways: ["Bone stone", "Grey stone"],
    lead: "8 weeks",
    addedAt: "2025-11-20",
  },
  {
    id: "p-008",
    name: "Meeting Room Table",
    slug: "meeting-room-table",
    category: "meeting-room-furniture",
    description: "3.2m conference table seating twelve, AV-ready surface.",
    details:
      "Flush AV grommets, an under-table power rail and a plinth base that keeps the floor clear for chairs and cabling.",
    price: 12900,
    condition: "New",
    availability: "Made to order",
    images: [meetingImg, heroImg],
    specifications: [
      { label: "Dimensions", value: "320 × 120 × 74 cm" },
      { label: "Seats", value: "12" },
      { label: "AV", value: "Flush grommets + power rail" },
      { label: "Base", value: "Steel plinth" },
    ],
    featured: true,
    stock: 0,
    material: "Oak veneer / steel plinth",
    colorways: ["Natural oak", "Fumed oak"],
    badge: "New",
    lead: "5 weeks",
    addedAt: "2026-02-18",
  },
  {
    id: "p-009",
    name: "Conference Chair",
    slug: "conference-chair",
    category: "meeting-room-furniture",
    description: "Stackable mesh-back meeting chair with chrome frame.",
    details:
      "Designed for boardrooms and training spaces: stacks four high, linkable side to side, with a breathable mesh back and upholstered seat.",
    price: 740,
    condition: "Used",
    availability: "In stock",
    images: [conferenceChairImg, meetingImg],
    specifications: [
      { label: "Stacking", value: "4 high" },
      { label: "Frame", value: "Chrome steel" },
      { label: "Back", value: "Mesh" },
      { label: "Condition", value: "Professionally refurbished" },
    ],
    featured: false,
    stock: 36,
    material: "Mesh / chrome steel",
    colorways: ["Black"],
    lead: "Ships in 3 days",
    addedAt: "2025-10-11",
  },
  {
    id: "p-010",
    name: "Office Storage Cabinet",
    slug: "office-storage-cabinet",
    category: "storage-cabinets",
    description: "Acoustic storage wall that divides space and cuts reverberation.",
    details:
      "A room-dividing storage system with PET acoustic backing, adjustable shelves and lockable tambour doors.",
    price: 6300,
    condition: "Used",
    availability: "In stock",
    images: [storageImg, meetingImg],
    specifications: [
      { label: "Dimensions", value: "200 × 45 × 160 cm" },
      { label: "Doors", value: "Lockable tambour" },
      { label: "Acoustics", value: "PET felt backing" },
      { label: "Condition", value: "Professionally refurbished" },
    ],
    featured: false,
    stock: 7,
    material: "Laminate / PET acoustic felt",
    colorways: ["Bone", "Clay", "Graphite"],
    lead: "Ships in 1 week",
    addedAt: "2025-09-30",
  },
  {
    id: "p-011",
    name: "Mobile Pedestal",
    slug: "mobile-pedestal",
    category: "storage-cabinets",
    description: "Three-drawer under-desk pedestal on soft-braked castors.",
    details:
      "Rolls under any 75cm desk. Soft-close drawers, a central lock and a cushioned top that doubles as informal seating.",
    price: 690,
    condition: "New",
    availability: "In stock",
    images: [pedestalImg, storageImg],
    specifications: [
      { label: "Dimensions", value: "42 × 60 × 60 cm" },
      { label: "Drawers", value: "3, soft-close" },
      { label: "Lock", value: "Central, keyed" },
      { label: "Castors", value: "Soft-braked" },
    ],
    featured: false,
    stock: 84,
    material: "Oak laminate / steel",
    colorways: ["Natural oak", "Bone", "Graphite"],
    badge: "In stock",
    lead: "Ships in 3 days",
    addedAt: "2026-01-22",
  },
  {
    id: "p-012",
    name: "Filing Cabinet",
    slug: "filing-cabinet",
    category: "storage-cabinets",
    description: "Four-drawer steel filing cabinet with anti-tilt interlock.",
    details:
      "Full-extension runners, foolscap and A4 filing, anti-tilt interlock and a powder-coated finish that survives daily office use.",
    price: 1180,
    condition: "New",
    availability: "In stock",
    images: [filingCabinetImg, storageImg],
    specifications: [
      { label: "Dimensions", value: "47 × 62 × 132 cm" },
      { label: "Drawers", value: "4, full extension" },
      { label: "Filing", value: "A4 / foolscap" },
      { label: "Safety", value: "Anti-tilt interlock" },
    ],
    featured: false,
    stock: 31,
    material: "Powder-coated steel",
    colorways: ["Off-white", "Graphite"],
    lead: "Ships in 3 days",
    addedAt: "2025-12-18",
  },
  {
    id: "p-013",
    name: "Dual Monitor Arm",
    slug: "dual-monitor-arm",
    category: "accessories",
    description: "Gas-spring arm carrying two 32\" displays, tool-free clamp.",
    details:
      "Independent gas-spring articulation per screen, integrated cable routing and a clamp that fits desk tops up to 90mm.",
    price: 620,
    condition: "New",
    availability: "In stock",
    images: [chairImg, deskImg],
    specifications: [
      { label: "Screens", value: "2 × up to 32\"" },
      { label: "Load", value: "9 kg per arm" },
      { label: "Mount", value: "Clamp or grommet" },
      { label: "VESA", value: "75 / 100" },
    ],
    featured: false,
    stock: 120,
    material: "Aluminium",
    colorways: ["Black", "Silver"],
    lead: "Ships in 3 days",
    addedAt: "2026-02-05",
  },
  {
    id: "p-014",
    name: "Single Office Desk",
    slug: "single-office-desk",
    category: "office-desks",
    description: "Fixed-height 140cm desk with cable tray and modesty panel.",
    details:
      "The everyday workhorse: 140 × 70cm laminate top, welded steel A-frame, under-desk cable tray and a fabric modesty panel.",
    price: 1650,
    condition: "Used",
    availability: "In stock",
    images: [deskImg, completeOfficeImg],
    specifications: [
      { label: "Dimensions", value: "140 × 70 × 74 cm" },
      { label: "Frame", value: "Welded steel A-frame" },
      { label: "Cable tray", value: "Included" },
      { label: "Condition", value: "Professionally refurbished" },
    ],
    featured: false,
    stock: 18,
    material: "Laminate / steel",
    colorways: ["Oak", "Bone"],
    lead: "Ships in 1 week",
    addedAt: "2025-11-02",
  },
];

export const products: Product[] = seed.map((p) => ({ ...p, currency: "ILS" as const }));

/** Convenience accessor so components never index into `images` directly. */
export function primaryImage(product: Product): string {
  return product.images[0] ?? "";
}

export interface Service {
  slug: string;
  name: string;
  summary: string;
  points: string[];
}

export const services: Service[] = [
  {
    slug: "office-furnishing",
    name: "Office Furnishing",
    summary:
      "End-to-end furnishing of a whole floor or building — specification, procurement, delivery and handover.",
    points: ["Budget & specification", "Supplier coordination", "Single-contract delivery"],
  },
  {
    slug: "workspace-planning",
    name: "Workspace Planning",
    summary:
      "Space studies, occupancy modelling and 2D/3D layouts that make every square metre earn its place.",
    points: ["Occupancy analysis", "CAD floor plans", "3D visualisation"],
  },
  {
    slug: "delivery-installation",
    name: "Delivery & Installation",
    summary:
      "Certified installation crews, out-of-hours access, packaging removal and a signed snag-free handover.",
    points: ["Out-of-hours installs", "Building compliance", "Waste removal"],
  },
  {
    slug: "office-clearance",
    name: "Office Clearance",
    summary:
      "Decommission, resale and responsible recycling of existing furniture, with a diversion report.",
    points: ["Asset buy-back", "Certified recycling", "Diversion reporting"],
  },
];

export interface Project {
  slug: string;
  name: string;
  type:
    | "Corporate Offices"
    | "Executive Offices"
    | "Reception Areas"
    | "Meeting Rooms"
    | "Complete Workspace Projects";
  location: string;
  year: string;
  scope: string;
  image: string;
  metric: string;
}

export const projectTypes = [
  "Corporate Offices",
  "Executive Offices",
  "Reception Areas",
  "Meeting Rooms",
  "Complete Workspace Projects",
] as const;

export const projects: Project[] = [
  {
    slug: "open-plan-headquarters",
    name: "Open-Plan Headquarters",
    type: "Corporate Offices",
    location: "Business park",
    year: "2025",
    scope: "Full-floor furnishing across three levels of open-plan workspace.",
    image: heroImg,
    metric: "Full floor",
  },
  {
    slug: "boardroom-suite",
    name: "Boardroom & Meeting Suite",
    type: "Meeting Rooms",
    location: "City centre office",
    year: "2025",
    scope: "Boardroom and four meeting suites with AV-integrated tables.",
    image: meetingImg,
    metric: "5 rooms",
  },
  {
    slug: "front-of-house-reception",
    name: "Front-of-House Reception",
    type: "Reception Areas",
    location: "Commercial tower",
    year: "2024",
    scope: "Welcome counter, lounge seating and wayfinding joinery.",
    image: receptionImg,
    metric: "Reception floor",
  },
  {
    slug: "executive-suite",
    name: "Executive Suite",
    type: "Executive Offices",
    location: "Corporate campus",
    year: "2024",
    scope: "Executive offices in walnut with matching credenzas.",
    image: executiveImg,
    metric: "6 suites",
  },
];

export const stats = [
  { value: "New & used", label: "Furniture in one catalogue" },
  { value: "Full service", label: "Planning to installation" },
  { value: "Contract-grade", label: "Built for daily office use" },
  { value: "Nationwide", label: "Delivery & installation" },
];
