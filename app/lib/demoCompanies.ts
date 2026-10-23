import * as nova from "./novaPrecision";

// One entry per demo exhibition. Every page under /demo/[slug] reads from here.
// To add a company: append an entry, and it appears in the /demo directory
// and gets the full set of exhibition pages automatically.

export type Profile = {
  name: string;
  tagline: string;
  description: string;
  country: string;
  founded: string;
  website: string;
  email: string;
  phone: string;
  identityVideo: string;
  innovationVideo: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  story: string;
  image: string;
  specifications: string[];
};

export type Person = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  image: string;
  bio: string;
  note: string;
};

export type Dealership = {
  id: string;
  name: string;
  country: string;
  region: string;
  products: string[];
  email: string;
  address: string;
};

export type Location = {
  id: string;
  name: string;
  type: string;
  country: string;
  region: string;
  address: string;
  services: string[];
};

export type DemoCompany = {
  slug: string;
  industry: string;
  location: string;
  initials: string;
  blurb: string;
  featured?: boolean;
  enquiryEmail: string;
  profile: Profile;
  content: {
    kicker: string;
    heroImage: string;
    heroKicker: string;
    heroCaption: string;
    headline: [string, string, string];
    heroDescription: string;
    trust: [string, string, string, string];
    intro: [string, string];
    introCopy: string;
    letter: { quote: string; name: string; role: string };
    capabilities: string[];
    videoImage: string;
    innovationImage: string;
  };
  products: Product[];
  team: Person[];
  dealerships: Dealership[];
  locations: Location[];
};

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=85`;

const novaPrecision: DemoCompany = {
  slug: "nova-precision",
  industry: "Machinery & Equipment",
  location: "Germany",
  initials: "NP",
  featured: true,
  enquiryEmail: "sales@example.com",
  blurb:
    "Explore precision engineering, industrial machinery, product capabilities, and company information.",
  profile: nova.company,
  content: {
    kicker: "MANUFACTURING & INDUSTRIAL TECHNOLOGY",
    heroImage: img("1567789884554-0b844b597180", 1800),
    heroKicker: "ENGINEERING · TECHNOLOGY · PRODUCTION",
    heroCaption: "Made with care, measured to the micron.",
    headline: ["Meet the company", "behind the", "machines."],
    heroDescription:
      "Step inside NovaPrecision Manufacturing — the hands, the machines and the quiet pride behind every part, gathered in one digital exhibition.",
    trust: [
      "PRECISION ENGINEERING",
      "INDUSTRIAL SOLUTIONS",
      "MANUFACTURING TECHNOLOGY",
      "GLOBAL PARTNERSHIPS",
    ],
    intro: ["Behind every machine,", "a person who cared."],
    introCopy:
      "A good exhibition shows buyers not only what a manufacturer makes, but who makes it — the engineers who stay late to get a tolerance right, and the people who pick up the phone when something matters.",
    letter: {
      quote:
        "We began with one lathe, a rented garage and a promise: every part that leaves our door is one we would proudly sign. Decades later, that promise is still the only thing we really sell.",
      name: "Alex Morgan",
      role: "Managing Director · a letter from the workshop (fictional)",
    },
    capabilities: [
      "Precision CNC machining",
      "Industrial equipment",
      "Production engineering",
      "Automation integration",
      "Technical support",
      "Custom manufacturing",
    ],
    videoImage: img("1581092160607-ee22621dd758"),
    innovationImage: img("1581092334651-ddf26d9a09d0"),
  },
  products: nova.products,
  team: nova.team,
  dealerships: nova.dealerships,
  locations: nova.locations,
};

const ironbridge: DemoCompany = {
  slug: "ironbridge-steelworks",
  industry: "Steel & Metals",
  location: "Sheffield, United Kingdom",
  initials: "IS",
  enquiryEmail: "enquiries@example.com",
  blurb:
    "Explore structural steel, forged components and the foundry crews behind a century of steelmaking.",
  profile: {
    name: "Ironbridge Steelworks",
    tagline: "Forged by hands. Trusted for generations.",
    description:
      "A fictional steel producer with a century of craft behind it — created to show how a heritage manufacturer can tell its story on FirmExpo.",
    country: "United Kingdom",
    founded: "1924 (fictional)",
    website: "https://example.com",
    email: "enquiries@example.com",
    phone: "+44 000 000000",
    identityVideo: "",
    innovationVideo: "",
  },
  content: {
    kicker: "STEEL & METALS",
    heroImage: img("1504917595217-d4dc5ebe6122", 1800),
    heroKicker: "FORGING · ROLLING · FINISHING",
    heroCaption: "Forged by hands, trusted for generations.",
    headline: ["Meet the people", "who forge the", "steel."],
    heroDescription:
      "Step inside Ironbridge Steelworks — the furnaces, the foundry crews and the generations of craft behind every beam, gathered in one digital exhibition.",
    trust: [
      "STRUCTURAL STEEL",
      "FORGED COMPONENTS",
      "CUSTOM ALLOYS",
      "GLOBAL SUPPLY",
    ],
    intro: ["Behind every beam,", "a family of craftspeople."],
    introCopy:
      "Steel is judged by what it carries. A good exhibition shows buyers the metallurgy, yes — but also the foundry crews who read a pour by colour and the families who have worked these furnaces for three generations.",
    letter: {
      quote:
        "Steel remembers how it was made. For a hundred years we have worked to make sure it remembers care — and that every bridge, frame and machine built on it stands a little taller for it.",
      name: "Margaret Hale",
      role: "Managing Director · a letter from the foundry (fictional)",
    },
    capabilities: [
      "Hot-rolled structural sections",
      "Closed-die forging",
      "Custom alloy development",
      "Heat treatment",
      "Material testing & certification",
      "Cut-to-length service",
    ],
    videoImage: img("1581092160607-ee22621dd758"),
    innovationImage: img("1581092334651-ddf26d9a09d0"),
  },
  products: [
    {
      id: "structural-sections",
      name: "Structural Steel Sections",
      category: "Structural Steel",
      description:
        "Beams, channels and angles rolled for builders who need to trust what's holding everything up.",
      story:
        "Every heat is tested before it ships, and every test is signed by someone who will see the finished building one day.",
      image: img("1504917595217-d4dc5ebe6122"),
      specifications: [
        "Hot-rolled beams, channels and angles",
        "Certified grades with full traceability",
        "Cut-to-length on request",
        "Delivery planned around your site",
      ],
    },
    {
      id: "forged-components",
      name: "Forged Components",
      category: "Forging",
      description:
        "Closed-die forgings for equipment makers where a failure isn't an option.",
      story:
        "Forging aligns the grain of the steel the way a craftsperson aligns a blade. You can feel the difference in the first hour of use.",
      image: img("1581092160607-ee22621dd758"),
      specifications: [
        "Closed-die and open-die forging",
        "Heat treatment in-house",
        "Ultrasonic and magnetic inspection",
        "Short runs and long-term supply",
      ],
    },
    {
      id: "precision-plate",
      name: "Precision Steel Plate",
      category: "Plate & Sheet",
      description:
        "Flat, consistent plate and sheet, cut and prepared so it arrives ready to work.",
      story:
        "Consistency isn't glamorous, but it's what lets your line run on a Monday morning without a single surprise.",
      image: img("1567789884554-0b844b597180"),
      specifications: [
        "Tight thickness tolerances",
        "Laser and plasma cutting",
        "Surface treatment options",
        "Mill certificates with every order",
      ],
    },
  ],
  team: [
    {
      id: "director",
      name: "Margaret Hale",
      role: "Managing Director",
      email: "margaret@example.com",
      phone: "+44 000 000000",
      image: "",
      bio: "Fourth generation at the works, and still the first to arrive on a pour day.",
      note: "My grandfather poured steel in this city. I just try to be worthy of it.",
    },
    {
      id: "metallurgy",
      name: "Daniel Okafor",
      role: "Head of Metallurgy",
      email: "daniel@example.com",
      phone: "+44 000 000001",
      image: "",
      bio: "Can tell you a lot about an alloy from the sound it makes on the bench.",
      note: "Every grade we ship is a promise I get to keep.",
    },
    {
      id: "partnerships",
      name: "Priya Nair",
      role: "Customer Partnerships",
      email: "priya@example.com",
      phone: "+44 000 000002",
      image: "",
      bio: "Makes sure the right steel reaches the right site, on the day it was promised.",
      note: "Behind every order is a team trying to finish something they're proud of.",
    },
  ],
  dealerships: [
    {
      id: "dealer-pennine",
      name: "Pennine Metals Supply",
      country: "United Kingdom",
      region: "Northern England",
      products: ["Structural Steel Sections", "Precision Steel Plate"],
      email: "pennine@example.com",
      address: "Demonstration address, United Kingdom",
    },
    {
      id: "dealer-rhine",
      name: "Rhein Stahlhandel",
      country: "Germany",
      region: "Western Europe",
      products: ["Forged Components"],
      email: "rhein@example.com",
      address: "Demonstration address, Germany",
    },
  ],
  locations: [
    {
      id: "foundry-sheffield",
      name: "Sheffield Foundry",
      type: "Factory",
      country: "United Kingdom",
      region: "Yorkshire",
      address: "Demonstration address, Sheffield, United Kingdom",
      services: ["Melting and casting", "Forging", "Heat treatment"],
    },
    {
      id: "hub-rotterdam",
      name: "Rotterdam Distribution Hub",
      type: "Warehouse",
      country: "Netherlands",
      region: "Western Europe",
      address: "Demonstration address, Rotterdam, Netherlands",
      services: ["Cut-to-length", "European dispatch"],
    },
    {
      id: "office-birmingham",
      name: "Birmingham Sales Office",
      type: "Regional Office",
      country: "United Kingdom",
      region: "West Midlands",
      address: "Demonstration address, Birmingham, United Kingdom",
      services: ["Sales", "Customer support"],
    },
  ],
};

const voltara: DemoCompany = {
  slug: "voltara-automation",
  industry: "Industrial Automation",
  location: "Eindhoven, Netherlands",
  initials: "VA",
  enquiryEmail: "hello@example.com",
  blurb:
    "Explore robotic work cells, smart conveyors and the engineers teaching factories to think.",
  profile: {
    name: "Voltara Automation Systems",
    tagline: "Automation that works beside people.",
    description:
      "A fictional automation company — created to show how a modern engineering team can present robotics, vision and control systems on FirmExpo.",
    country: "Netherlands",
    founded: "2009 (fictional)",
    website: "https://example.com",
    email: "hello@example.com",
    phone: "+31 000 000000",
    identityVideo: "",
    innovationVideo: "",
  },
  content: {
    kicker: "INDUSTRIAL AUTOMATION",
    heroImage: img("1581092580497-e0d23cbdf1dc", 1800),
    heroKicker: "ROBOTICS · VISION · CONTROL",
    heroCaption: "Where machines learn to work beside people.",
    headline: ["Meet the team", "teaching factories to", "think."],
    heroDescription:
      "Step inside Voltara Automation Systems — the engineers, the robots and the belief that technology should give people their time back, all in one digital exhibition.",
    trust: [
      "ROBOTIC CELLS",
      "MACHINE VISION",
      "SMART CONVEYING",
      "SYSTEM INTEGRATION",
    ],
    intro: ["Behind every robot,", "a person who cared."],
    introCopy:
      "Automation is only as human as the people who design it. A good exhibition shows buyers what a system can do — and who will be on the other end of the phone when they need to make it do more.",
    letter: {
      quote:
        "We don't automate to replace people. We automate so people can spend their day on work worth doing — and go home with energy left for everything else.",
      name: "Sanne de Vries",
      role: "Founder & CEO · a note from the lab (fictional)",
    },
    capabilities: [
      "Robotic work cells",
      "Machine vision inspection",
      "Conveying and logistics",
      "PLC and control software",
      "Commissioning & training",
      "Remote monitoring & support",
    ],
    videoImage: img("1581092334651-ddf26d9a09d0"),
    innovationImage: img("1581092160607-ee22621dd758"),
  },
  products: [
    {
      id: "robotic-work-cell",
      name: "Robotic Work Cell",
      category: "Robotics",
      description:
        "A compact, ready-to-run cell that takes over the repetitive tasks nobody enjoys.",
      story:
        "We train your operators on day one — because the best cell is the one your own team feels proud to run.",
      image: img("1581092580497-e0d23cbdf1dc"),
      specifications: [
        "Six-axis collaborative robot",
        "Safety-rated guarding options",
        "Quick changeover tooling",
        "Operator training included",
      ],
    },
    {
      id: "smart-conveyor",
      name: "Smart Conveyor Line",
      category: "Conveying & Logistics",
      description:
        "Modular conveying that moves products smoothly and tells you when something needs attention.",
      story:
        "We design it so a night-shift technician can fix it with a coffee in one hand — and never needs to call us at 3 a.m.",
      image: img("1567789884554-0b844b597180"),
      specifications: [
        "Modular layouts that grow with you",
        "Built-in sensors and diagnostics",
        "Energy-saving drive control",
        "Remote monitoring dashboard",
      ],
    },
    {
      id: "vision-inspection",
      name: "Vision Inspection System",
      category: "Machine Vision",
      description:
        "Cameras and software that catch the defect no tired eye should have to find.",
      story:
        "It doesn't replace your quality team — it gives them back their afternoons, and their confidence.",
      image: img("1581092334651-ddf26d9a09d0"),
      specifications: [
        "High-resolution inline inspection",
        "Self-learning defect detection",
        "Traceable inspection records",
        "Integrates with existing lines",
      ],
    },
  ],
  team: [
    {
      id: "founder",
      name: "Sanne de Vries",
      role: "Founder & CEO",
      email: "sanne@example.com",
      phone: "+31 000 000000",
      image: "",
      bio: "Built the first robot cell in her garage and has never stopped asking what it could do for the operator.",
      note: "We build robots so people can do the work only people can do.",
    },
    {
      id: "robotics",
      name: "Mateo Rossi",
      role: "Robotics Engineer",
      email: "mateo@example.com",
      phone: "+31 000 000001",
      image: "",
      bio: "Teaches machines to move gently — then teaches the humans beside them how to trust it.",
      note: "A good robot is quiet, careful, and a little bit kind.",
    },
    {
      id: "success",
      name: "Aisha Karim",
      role: "Customer Success",
      email: "aisha@example.com",
      phone: "+31 000 000002",
      image: "",
      bio: "Stays with every customer long after commissioning, until the system feels like theirs.",
      note: "Our job isn't done when it's installed. It's done when you stop worrying about it.",
    },
  ],
  dealerships: [
    {
      id: "dealer-benelux",
      name: "Benelux Robotics Partners",
      country: "Netherlands",
      region: "Western Europe",
      products: ["Robotic Work Cell", "Vision Inspection System"],
      email: "benelux@example.com",
      address: "Demonstration address, Netherlands",
    },
    {
      id: "dealer-nordic",
      name: "Nordic Automation Group",
      country: "Sweden",
      region: "Northern Europe",
      products: ["Smart Conveyor Line", "Robotic Work Cell"],
      email: "nordic@example.com",
      address: "Demonstration address, Sweden",
    },
  ],
  locations: [
    {
      id: "lab-eindhoven",
      name: "Eindhoven Innovation Lab",
      type: "R&D Lab",
      country: "Netherlands",
      region: "North Brabant",
      address: "Demonstration address, Eindhoven, Netherlands",
      services: ["Research & development", "Customer test cells"],
    },
    {
      id: "service-gothenburg",
      name: "Gothenburg Service Centre",
      type: "Service Centre",
      country: "Sweden",
      region: "Northern Europe",
      address: "Demonstration address, Gothenburg, Sweden",
      services: ["Technical support", "Commissioning"],
    },
    {
      id: "office-munich",
      name: "Munich Sales Office",
      type: "Regional Office",
      country: "Germany",
      region: "Central Europe",
      address: "Demonstration address, Munich, Germany",
      services: ["Sales", "Customer support"],
    },
  ],
};

export const demoCompanies: DemoCompany[] = [novaPrecision, ironbridge, voltara];

export function getCompany(slug: string): DemoCompany | undefined {
  return demoCompanies.find((c) => c.slug === slug);
}
