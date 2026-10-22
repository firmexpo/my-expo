
export const company = {
  name: "NovaPrecision Manufacturing",
  tagline: "Engineering precision. Building progress.",
  description:
    "A fictional manufacturer of precision parts and industrial machinery — created to show how a company's story, people and products can come together on FirmExpo.",
  country: "Germany",
  founded: "1987 (fictional)",
  website: "https://example.com",
  email: "contact@example.com",
  phone: "+49 000 000000",
  identityVideo: "",
  innovationVideo: "",
};

export const products = [
  {
    id: "cnc-components",
    name: "CNC Precision Components",
    category: "Precision Engineering",
    description:
      "Precision-machined components, made to your drawing and checked by the people who made them.",
    story:
      "Every batch is signed off by the machinist who ran it. If a part isn't one we'd put our own name on, it never leaves the building.",
    image:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=85",
    specifications: [
      "CNC milling and turning",
      "Custom dimensions and tolerances",
      "Prototype to series production",
      "Full inspection report on request",
    ],
  },
  {
    id: "industrial-machinery",
    name: "Industrial Machinery",
    category: "Machinery & Equipment",
    description:
      "Dependable equipment for manufacturing floors, built to keep running long after the sale.",
    story:
      "We build machines for people who'll rely on them every single morning — so we design for the tenth year, not just the first demo.",
    image:
      "https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&w=1200&q=85",
    specifications: [
      "Heavy-duty industrial frames",
      "Production-line integration",
      "Operator training included",
      "Lifetime spare-parts support",
    ],
  },
  {
    id: "metal-parts",
    name: "Engineered Metal Parts",
    category: "Metal Fabrication",
    description:
      "Engineered metal parts for equipment makers who can't afford a part that almost fits.",
    story:
      "Behind each weld and bend is someone who learned the trade from someone else who cared. That patience shows up in the finish.",
    image:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=85",
    specifications: [
      "Cutting, bending and welding",
      "Stainless, steel and aluminium",
      "Surface finishing options",
      "Custom specifications",
    ],
  },
];

export const team = [
  {
    id: "director",
    name: "Alex Morgan",
    role: "Managing Director",
    email: "alex@example.com",
    phone: "+49 000 000000",
    image: "",
    bio: "Started on the shop floor and still walks it every morning, coffee in hand.",
    note: "I still keep the very first part we ever shipped on my desk.",
  },
  {
    id: "sales",
    name: "Jordan Lee",
    role: "Sales & Partnerships",
    email: "sales@example.com",
    phone: "+49 000 000001",
    image: "",
    bio: "Helps buyers find the right solution — even when it isn't one of ours.",
    note: "A good conversation is worth more than a good quote.",
  },
  {
    id: "engineering",
    name: "Taylor Reed",
    role: "Engineering Lead",
    email: "engineering@example.com",
    phone: "+49 000 000002",
    image: "",
    bio: "Turns difficult drawings into parts that simply work, first time.",
    note: "The best compliment is a machine nobody has to think about.",
  },
];

export const dealerships = [
  {
    id: "dealer-germany",
    name: "Northern Industrial Partners",
    country: "Germany",
    region: "Central Europe",
    products: ["Industrial Machinery", "CNC Precision Components"],
    email: "dealer@example.com",
    address: "Demonstration address, Germany",
  },
  {
    id: "dealer-france",
    name: "Atelier Ouest Distribution",
    country: "France",
    region: "Western Europe",
    products: ["Engineered Metal Parts"],
    email: "france@example.com",
    address: "Demonstration address, France",
  },
];

export const locations = [
  {
    id: "service-germany",
    name: "Service Centre",
    type: "Service Centre",
    country: "Germany",
    region: "Central Europe",
    address: "Demonstration address, Germany",
    services: ["Technical support", "Maintenance"],
  },
  {
    id: "factory-germany",
    name: "Manufacturing Facility",
    type: "Factory",
    country: "Germany",
    region: "Central Europe",
    address: "Demonstration address, Germany",
    services: ["Manufacturing", "Quality inspection"],
  },
  {
    id: "office-france",
    name: "Regional Office",
    type: "Regional Office",
    country: "France",
    region: "Western Europe",
    address: "Demonstration address, France",
    services: ["Sales", "Customer support"],
  },
];
