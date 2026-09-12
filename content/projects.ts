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
    // TODO: replace with approved Razorpay campaign asset
    heroImage: "/projects/razorpay/hero.jpg",
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
    // TODO: replace with approved ZEE5 campaign asset
    heroImage: "/projects/zee5/hero.jpg",
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
    // TODO: replace with approved RummyCircle Hrithik campaign asset
    heroImage: "/projects/rummy-circle/hero.jpg",
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
    // TODO: replace with approved Qatar Airways campaign asset
    heroImage: "/projects/qatar-airways/hero.jpg",
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
    // TODO: replace with approved MY11Circle campaign asset
    heroImage: "/projects/my11circle/hero.jpg",
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
    // TODO: replace with approved PokerBaazi Shahid campaign asset
    heroImage: "/projects/pokerbaazi/hero.jpg",
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
    // TODO: replace with approved AZORTE fashion asset
    heroImage: "/projects/azorte/hero.jpg",
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
    // TODO: replace with approved music video asset
    heroImage: "/projects/aia-na-piya/hero.jpg",
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
    // TODO: replace with approved influencer campaign asset
    heroImage: "/projects/influencers/hero.jpg",
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
    // TODO: replace with approved Hebron School asset
    heroImage: "/projects/hebron/hero.jpg",
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
    // TODO: replace with approved Rakshak asset
    heroImage: "/projects/rakshak/hero.jpg",
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
