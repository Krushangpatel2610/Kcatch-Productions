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
  cta: { label: "OUR STORY", href: "/projects#story-01" },
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
// Our Family — full brand list (Home page "OUR FAMILY" section only).
// Separate from CLIENTS above (which also feeds OrbitSection's inner ring —
// kept untouched so Orbit's rendered output doesn't change).
// `logo: null` means no approved logo asset exists yet for that brand;
// FamilySection falls back to rendering the brand name as text until a
// real logo is supplied — see the report after this array is wired in.
// ---------------------------------------------------------------------------
export type FamilyBrand = {
  id: string;
  name: string;
  logo: string | null;
  alt: string;
};

export const FAMILY_BRANDS: FamilyBrand[] = [
  { id: "the-hebron-school", name: "The Hebron School", logo: null, alt: "The Hebron School" },
  { id: "s-dev", name: "S Dev", logo: null, alt: "S Dev" },
  { id: "k9-restro", name: "K9 Restro", logo: null, alt: "K9 Restro" },
  { id: "swiggy-family", name: "Swiggy", logo: null, alt: "Swiggy" },
  { id: "capsul-family", name: "Capsul", logo: null, alt: "Capsul" },
  { id: "ministry-of-culture", name: "Ministry of Culture — Government of India", logo: null, alt: "Ministry of Culture — Government of India" },
  { id: "pravegs-grand-eulogia", name: "Praveg's Grand Eulogia", logo: null, alt: "Praveg's Grand Eulogia" },
  { id: "pepperfry-family", name: "Pepperfry", logo: null, alt: "Pepperfry" },
  { id: "pramesh", name: "Pramesh", logo: null, alt: "Pramesh" },
  { id: "bailamos", name: "Bailamos", logo: null, alt: "Bailamos" },
  { id: "healuxe", name: "Healuxe", logo: null, alt: "Healuxe" },
  { id: "the-new-hebron-preschool", name: "The New Hebron Preschool", logo: null, alt: "The New Hebron Preschool" },
  { id: "gujarat-police", name: "Gujarat Police", logo: null, alt: "Gujarat Police" },
  { id: "happinezz", name: "HappinEzz / Happiness", logo: null, alt: "HappinEzz / Happiness" },
  { id: "wellbalance", name: "WellBalance", logo: null, alt: "WellBalance" },
  { id: "thc", name: "THC — The Heritage Culture", logo: null, alt: "THC — The Heritage Culture" },
  { id: "anytime-fitness", name: "Anytime Fitness", logo: null, alt: "Anytime Fitness" },
  { id: "azadi-ka-amrit-mahotsav", name: "Azadi Ka Amrit Mahotsav", logo: null, alt: "Azadi Ka Amrit Mahotsav" },
  { id: "roastery-culture", name: "Roastery Culture", logo: null, alt: "Roastery Culture" },
  { id: "the-school-post", name: "The School Post", logo: null, alt: "The School Post" },
  { id: "kidzee", name: "Kidzee", logo: null, alt: "Kidzee" },
  { id: "originiya", name: "oriGiniya", logo: null, alt: "oriGiniya" },
  { id: "red-fm", name: "Red FM 93.5", logo: null, alt: "Red FM 93.5" },
  { id: "gls-university", name: "GLS University", logo: null, alt: "GLS University" },
  { id: "radio-city", name: "Radio City 91.1 FM", logo: null, alt: "Radio City 91.1 FM" },
  { id: "rudraksh-dental-clinic", name: "Rudraksh Dental Clinic", logo: null, alt: "Rudraksh Dental Clinic" },
  { id: "grace-coffee", name: "Grace Coffee", logo: null, alt: "Grace Coffee" },
  { id: "the-entertainers", name: "The Entertainers", logo: null, alt: "The Entertainers" },
  { id: "tea-post", name: "tea post", logo: null, alt: "tea post" },
  { id: "fr-fitness", name: "FR Fitness", logo: null, alt: "FR Fitness" },
  { id: "ace-bounce", name: "Ace Bounce", logo: null, alt: "Ace Bounce" },
  { id: "the-ummed-hotels", name: "The Ummed Hotels", logo: null, alt: "The Ummed Hotels" },
  { id: "laxmi-namkeen", name: "Laxmi Namkeen", logo: null, alt: "Laxmi Namkeen" },
  { id: "hook", name: "HOOK", logo: null, alt: "HOOK" },
  { id: "aquaplus", name: "Aquaplus", logo: null, alt: "Aquaplus" },
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
