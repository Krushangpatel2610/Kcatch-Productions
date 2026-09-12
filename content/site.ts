// content/site.ts
// Site-wide content model.
// Source of truth for navigation, capabilities, family clients and CTAs.

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------
export type NavLink = {
  label: string;
  href: string;
};

export const NAV_LINKS: NavLink[] = [
  { label: "HOME", href: "/" },
  { label: "PROJECTS", href: "/projects" },
  { label: "CONTACT", href: "/contact" },
];

export const NAV_CTA: NavLink = {
  label: "LET'S TALK",
  href: "/contact",
};

// ---------------------------------------------------------------------------
// Home Hero
// ---------------------------------------------------------------------------
export const HOME_HERO = {
  eyebrow: "KCATCH MEDIA",
  headlineLine1: "KCATCH",
  headlineLine2: "THE",
  headlineLine3: "DAMN EYE",
  support: "OH, I MADE YOU LOOK",
  subtext:
    "We make content, campaigns and cultural moments that make people pause, look twice, and remember.",
  primaryCta: { label: "PLAY SHOWREEL", href: "#showreel" },
  scrollCue: "SCROLL TO EXPLORE",
  tapeText: "OH, I MADE YOU LOOK",
};

// ---------------------------------------------------------------------------
// Featured Work Section
// ---------------------------------------------------------------------------
export const FEATURED_WORK = {
  sectionLabel: "FEATURED WORK",
  headline1: "REAL BRANDS.",
  headline2: "REAL IMPACT.",
  supportWords: ["IDEAS", "BRANDS", "CULTURE", "PEOPLE"],
  annotation:
    "A collection of campaigns, content and cultural stories that made people look.",
  scrollHint: "SCROLL HORIZONTALLY",
};

// ---------------------------------------------------------------------------
// Capabilities / What We KCATCH
// ---------------------------------------------------------------------------
export type Capability = {
  id: string;
  title: string;
  description?: string;
  icon: string; // lucide icon name
};

export const CAPABILITIES_SECTION = {
  sectionLabel: "WHAT WE DO",
  headline: "WHAT\nWE KCATCH",
  annotation:
    "We blend strategy, storytelling, design and cultural insight to create work that doesn't just sit on a feed, it moves through it.",
  cta: { label: "KNOW MORE", href: "/contact" },
};

export const CAPABILITIES: Capability[] = [
  {
    id: "brand-strategy",
    title: "Brand Strategy",
    description: "Positioning that cuts through.",
    icon: "Lightbulb",
  },
  {
    id: "content-production",
    title: "Content Production",
    description: "Visuals that do the work.",
    icon: "Video",
  },
  {
    id: "campaigns-performance",
    title: "Campaigns & Performance",
    description: "Ideas with measurable momentum.",
    icon: "BarChart3",
  },
  {
    id: "culture-influence",
    title: "Culture & Influence",
    description: "Culturally rooted, digitally fluent.",
    icon: "Users",
  },
];

// ---------------------------------------------------------------------------
// About / Visibility
// ---------------------------------------------------------------------------
export const ABOUT_SECTION = {
  headline1: "VISIBILITY",
  headline2: "ISN'T LUCK.",
  headline3: "IT'S DESIGN.",
  body: "We live in a world where attention is currency, and we engineer moments that make people pause, look twice, and remember.",
  cta: { label: "OUR STORY", href: "/contact" },
  annotation: "SAME IDEAS. BIGGER IMPACT.",
  // TODO: replace with approved studio/campaign background image
  bgImage: "/contact/studio-bg.jpg",
};

// ---------------------------------------------------------------------------
// Our Family (clients)
// ---------------------------------------------------------------------------
export type Client = {
  id: string;
  name: string;
  // TODO: replace with approved client logo assets
  logo: string;
  alt: string;
};

export const FAMILY_SECTION = {
  headline: "OUR FAMILY",
  annotation: "SOME BRANDS WE'VE KCATCHED",
};

export const CLIENTS: Client[] = [
  { id: "razorpay", name: "Razorpay", logo: "/brand/logos/razorpay.svg", alt: "Razorpay" },
  { id: "zee5", name: "ZEE5", logo: "/brand/logos/zee5.svg", alt: "ZEE5" },
  { id: "rummy-circle", name: "Rummy Circle", logo: "/brand/logos/rummy-circle.svg", alt: "Rummy Circle" },
  { id: "qatar-airways", name: "Qatar Airways", logo: "/brand/logos/qatar-airways.svg", alt: "Qatar Airways" },
  { id: "my11circle", name: "MY11Circle", logo: "/brand/logos/my11circle.svg", alt: "MY11Circle" },
  { id: "pokerbaazi", name: "PokerBaazi", logo: "/brand/logos/pokerbaazi.svg", alt: "PokerBaazi" },
  { id: "azorte", name: "AZORTE", logo: "/brand/logos/azorte.svg", alt: "AZORTE" },
  { id: "hebron", name: "The Hebron School", logo: "/brand/logos/hebron.svg", alt: "The Hebron School" },
  { id: "swiggy", name: "Swiggy", logo: "/brand/logos/swiggy.svg", alt: "Swiggy" },
  { id: "pepperfry", name: "Pepperfry", logo: "/brand/logos/pepperfry.svg", alt: "Pepperfry" },
  { id: "capsul", name: "Capsul", logo: "/brand/logos/capsul.svg", alt: "Capsul" },
];

// ---------------------------------------------------------------------------
// Final CTA
// ---------------------------------------------------------------------------
export const FINAL_CTA = {
  headline1: "LET'S",
  headline2: "MAKE THEM LOOK.",
  cta: { label: "START A PROJECT", href: "/contact" },
  supportWords: ["IDEAS", "BRANDS", "CULTURE", "PEOPLE"],
};

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------
export type SocialLink = {
  platform: string;
  icon: string; // lucide icon name
  href: string;
};

export const FOOTER = {
  brand: "KCATCH",
  locations: ["AHMEDABAD", "PUNE"],
  tagline: "BUILT TO MAKE YOU SEEN.",
  legalName: "KCATCH MEDIA",
  year: 2025,
};

export const SOCIAL_LINKS: SocialLink[] = [
  { platform: "Instagram", icon: "ExternalLink", href: "https://instagram.com/kcatchmedia" },
  { platform: "LinkedIn", icon: "ExternalLink", href: "https://linkedin.com/company/kcatch" },
  { platform: "YouTube", icon: "ExternalLink", href: "https://youtube.com/@kcatch" },
  { platform: "X", icon: "ExternalLink", href: "https://x.com/kcatchmedia" },
  { platform: "Behance", icon: "ExternalLink", href: "https://behance.net/kcatch" },
];
