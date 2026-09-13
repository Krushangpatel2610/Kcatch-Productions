// content/projects.ts
// Single source of truth for all KCATCH project content.
// Do NOT hard-code project data inside components.

export type Project = {
  id: string;
  number: string;
  client: string;
  title: string;
  subtitle?: string;
  category: string;
  tags: string[];
  description: string;
  annotation?: string;
  heroImage: string;
  supportingImages?: string[];
  featured: boolean;
  featuredOrder?: number;
  archiveOrder: number;
};

export type ProjectCategory =
  | "ALL"
  | "CAMPAIGNS"
  | "MUSIC VIDEO"
  | "INFLUENCER"
  | "EDUCATION"
  | "OTHERS";

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  "ALL",
  "CAMPAIGNS",
  "MUSIC VIDEO",
  "INFLUENCER",
  "EDUCATION",
  "OTHERS",
];

// ---------------------------------------------------------------------------
// ALL PROJECTS
// ---------------------------------------------------------------------------
// heroImage paths use /projects/<id>/ folder convention.
// Actual images TBD — slots reserved.
// ---------------------------------------------------------------------------

export const allProjects: Project[] = [
  {
    id: "razorpay",
    number: "01",
    client: "Razorpay",
    title: "Razorpay",
    category: "CAMPAIGNS",
    tags: ["CAMPAIGN", "DIGITAL", "SOCIAL"],
    description: "Simplifying payments through relatable stories.",
    annotation: "PAYMENTS THAT FIT YOUR WORLD.",
    heroImage: "/Images/Projects/01-Razorpay.webp",
    supportingImages: ["/projects/razorpay/supporting-01.jpg"],
    featured: true,
    featuredOrder: 1,
    archiveOrder: 1,
  },
  {
    id: "zee5",
    number: "02",
    client: "ZEE5",
    title: "ZEE5",
    category: "CAMPAIGNS",
    tags: ["CAMPAIGN", "CONTENT", "DIGITAL"],
    description: "Entertainment that lives with you.",
    annotation: "STORIES FOR A BILLION MOODS.",
    heroImage: "/Images/Projects/02-Zee5.webp",
    supportingImages: ["/projects/zee5/supporting-01.jpg"],
    featured: true,
    featuredOrder: 2,
    archiveOrder: 2,
  },
  {
    id: "rummy-circle",
    number: "03",
    client: "RummyCircle",
    title: "Rummy Circle",
    subtitle: "Ft. Hrithik Roshan",
    category: "CAMPAIGNS",
    tags: ["CAMPAIGN", "CELEBRITY", "DIGITAL"],
    description: "Play bold. Play unforgettable.",
    heroImage: "/Images/Projects/03-RummyCircle-Large.png",
    supportingImages: ["/projects/rummy-circle/supporting-01.jpg"],
    featured: true,
    featuredOrder: 3,
    archiveOrder: 3,
  },
  {
    id: "qatar-airways",
    number: "04",
    client: "Qatar Airways",
    title: "Qatar Airways",
    category: "CAMPAIGNS",
    tags: ["TRAVEL", "CAMPAIGN", "CONTENT"],
    description: "A higher way to travel.",
    annotation: "JOURNEYS THAT BRING US CLOSER.",
    heroImage: "/Images/Projects/04-Qatar Airways.webp",
    supportingImages: ["/projects/qatar-airways/supporting-01.jpg"],
    featured: true,
    featuredOrder: 4,
    archiveOrder: 4,
  },
  {
    id: "my11circle",
    number: "05",
    client: "MY11Circle",
    title: "MY11Circle",
    category: "CAMPAIGNS",
    tags: ["CAMPAIGN", "SPORTS", "DIGITAL"],
    description: "More than a game.",
    heroImage: "/Images/Projects/05-My11Circle.webp",
    featured: false,
    archiveOrder: 5,
  },
  {
    id: "pokerbaazi",
    number: "06",
    client: "PokerBaazi",
    title: "PokerBaazi",
    subtitle: "Ft. Shahid Kapoor",
    category: "CAMPAIGNS",
    tags: ["CAMPAIGN", "CELEBRITY", "CONTENT"],
    description: "Game on. Always.",
    annotation: "PLAY BIGGER.",
    heroImage: "/Images/Projects/06-Pokerbazi.webp",
    featured: false,
    archiveOrder: 6,
  },
  {
    id: "azorte",
    number: "07",
    client: "AZORTE",
    title: "Fashion / AZORTE",
    category: "CAMPAIGNS",
    tags: ["FASHION", "BRAND", "CONTENT"],
    description: "Style that speaks.",
    annotation: "ONE OF FASHION FIRSTS.",
    heroImage: "/Images/Projects/07-Azorte.webp",
    supportingImages: ["/projects/azorte/supporting-01.jpg"],
    featured: true,
    featuredOrder: 5,
    archiveOrder: 7,
  },
  {
    id: "aia-na-piya",
    number: "08",
    client: "AIA NA PIYA",
    title: "Aia Na Piya",
    category: "MUSIC VIDEO",
    tags: ["MUSIC", "VIDEO", "DIRECTION"],
    description: "Visuals that vibe.",
    heroImage: "/Images/Projects/08-Music Video.webp",
    featured: false,
    archiveOrder: 8,
  },
  {
    id: "influencers",
    number: "09",
    client: "Influencers",
    title: "Influencers",
    category: "INFLUENCER",
    tags: ["INFLUENCER", "SOCIAL", "DIGITAL"],
    description: "New voices. Real impact.",
    heroImage: "/Images/Projects/09-Influencers.webp",
    featured: false,
    archiveOrder: 9,
  },
  {
    id: "hebron",
    number: "10",
    client: "The Hebron School",
    title: "Education / Hebron",
    category: "EDUCATION",
    tags: ["CAMPAIGN", "EDUCATION", "STORYTELLING"],
    description: "We made education fun.",
    heroImage: "/Images/Projects/10-Hebron.webp",
    featured: false,
    archiveOrder: 10,
  },
  {
    id: "rakshak",
    number: "11",
    client: "Rakshak",
    title: "Rakshak",
    category: "CAMPAIGNS",
    tags: ["CAMPAIGN", "SOCIAL IMPACT", "EVENT"],
    description: "A movement for change.",
    heroImage: "/Images/Projects/11-Kcartcaay.webp",
    featured: false,
    archiveOrder: 11,
  },
];

// Convenience exports
export const featuredProjects = allProjects
  .filter((p) => p.featured)
  .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));

export const archiveProjects = [...allProjects].sort(
  (a, b) => a.archiveOrder - b.archiveOrder
);

export function filterProjectsByCategory(
  category: ProjectCategory
): Project[] {
  if (category === "ALL") return archiveProjects;
  return archiveProjects.filter((p) => p.category === category);
}
