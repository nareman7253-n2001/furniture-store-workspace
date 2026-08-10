import deskImg from "@/assets/cat-desks.jpg";
import chairImg from "@/assets/cat-chairs.jpg";
import executiveImg from "@/assets/cat-executive.jpg";
import receptionImg from "@/assets/project-reception.jpg";
import meetingImg from "@/assets/project-meeting.jpg";
import heroImg from "@/assets/hero-office.jpg";

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
    image: heroImg,
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
    image: deskImg,
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

export interface Product {
  id: string;
  name: string;
  category: CategorySlug;
  price: number;
  compareAt?: number;
  material: string;
  colorways: string[];
  badge?: "New" | "Best seller" | "Made to order" | "In stock";
  lead: string;
  image: string;
  gallery: string[];
  description: string;
}

export const products: Product[] = [
  {
    id: "brutalist-oak-desk",
    name: "Meridian Height-Adjustable Desk",
    category: "office-desks",
    price: 1480,
    compareAt: 1690,
    material: "Solid oak / powder-coated steel",
    colorways: ["Natural oak", "Smoked oak", "Graphite"],
    badge: "Best seller",
    lead: "Ships in 2 weeks",
    image: deskImg,
    gallery: [deskImg, heroImg, meetingImg],
    description:
      "A dual-motor sit-stand frame under a 25mm solid oak top. Integrated cable spine, silent lift and a 10-year frame warranty.",
  },
  {
    id: "atlas-task-chair",
    name: "Atlas Ergonomic Task Chair",
    category: "office-chairs",
    price: 720,
    material: "Recycled mesh / cast aluminium",
    colorways: ["Charcoal", "Bone", "Clay"],
    badge: "In stock",
    lead: "Ships in 3 days",
    image: chairImg,
    gallery: [chairImg, heroImg, receptionImg],
    description:
      "Weight-responsive recline, adjustable lumbar and 4D arms. Certified for 24-hour use and fully disassemblable for recycling.",
  },
  {
    id: "regent-executive-desk",
    name: "Regent Executive Desk",
    category: "executive-furniture",
    price: 4250,
    material: "Walnut veneer / bronzed steel",
    colorways: ["Walnut", "Ebony"],
    badge: "Made to order",
    lead: "6–8 weeks",
    image: executiveImg,
    gallery: [executiveImg, heroImg, meetingImg],
    description:
      "A 2.2m directors' desk with a hand-finished walnut top, concealed power and a matching credenza option.",
  },
  {
    id: "quarry-reception-counter",
    name: "Quarry Reception Counter",
    category: "reception-furniture",
    price: 5900,
    material: "Composite stone / oak veneer",
    colorways: ["Bone stone", "Grey stone"],
    badge: "Made to order",
    lead: "8 weeks",
    image: receptionImg,
    gallery: [receptionImg, heroImg],
    description:
      "A sculptural front-of-house counter with accessible lower return, integrated lighting and cable management.",
  },
  {
    id: "assembly-conference-table",
    name: "Assembly Conference Table 3.2m",
    category: "meeting-room-furniture",
    price: 6400,
    material: "Oak veneer / steel plinth",
    colorways: ["Natural oak", "Fumed oak"],
    badge: "New",
    lead: "5 weeks",
    image: meetingImg,
    gallery: [meetingImg, heroImg],
    description:
      "Seats twelve. Flush AV grommets, under-table power rail and a plinth base that keeps the floor clear.",
  },
  {
    id: "stack-storage-wall",
    name: "Stack Acoustic Storage Wall",
    category: "storage-cabinets",
    price: 2380,
    material: "Laminate / PET acoustic felt",
    colorways: ["Bone", "Clay", "Graphite"],
    lead: "4 weeks",
    image: heroImg,
    gallery: [heroImg, meetingImg],
    description:
      "A room-dividing storage system with acoustic backing that lowers reverberation in open-plan floors.",
  },
  {
    id: "grid-bench-workstation",
    name: "Grid 4-Person Bench Workstation",
    category: "workstations",
    price: 3960,
    compareAt: 4400,
    material: "Laminate / steel beam frame",
    colorways: ["Oak / graphite", "Bone / bone"],
    badge: "Best seller",
    lead: "3 weeks",
    image: deskImg,
    gallery: [deskImg, heroImg],
    description:
      "A four-desk bench with beam-routed power, modesty screens and a footprint tuned for 1.4m spans.",
  },
  {
    id: "beam-monitor-arm",
    name: "Beam Dual Monitor Arm",
    category: "accessories",
    price: 240,
    material: "Aluminium",
    colorways: ["Black", "Silver"],
    badge: "In stock",
    lead: "Ships in 3 days",
    image: chairImg,
    gallery: [chairImg],
    description: "Gas-spring dual arm supporting two 32\" displays with tool-free clamp mounting.",
  },
];

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
    slug: "northline-hq",
    name: "Northline Headquarters",
    type: "Corporate Offices",
    location: "San Francisco, CA",
    year: "2025",
    scope: "Full-floor furnishing for 180 staff across three levels.",
    image: heroImg,
    metric: "180 desks",
  },
  {
    slug: "harbour-partners",
    name: "Harbour Partners Boardroom",
    type: "Meeting Rooms",
    location: "Seattle, WA",
    year: "2025",
    scope: "Boardroom and four meeting suites with AV-integrated tables.",
    image: meetingImg,
    metric: "5 rooms",
  },
  {
    slug: "kessler-reception",
    name: "Kessler Tower Reception",
    type: "Reception Areas",
    location: "Portland, OR",
    year: "2024",
    scope: "Front-of-house counter, lounge and wayfinding joinery.",
    image: receptionImg,
    metric: "420 m²",
  },
  {
    slug: "aldridge-executive",
    name: "Aldridge Executive Suite",
    type: "Executive Offices",
    location: "Austin, TX",
    year: "2024",
    scope: "Six executive offices in walnut with bespoke credenzas.",
    image: executiveImg,
    metric: "6 suites",
  },
];

export const stats = [
  { value: "18", label: "Years furnishing workspaces" },
  { value: "640+", label: "Projects delivered" },
  { value: "24k", label: "Workstations installed" },
  { value: "97%", label: "Clients who return" },
];
