// content/contact.ts
// Contact page content model.
// Source of truth for contact details, office info and need options.

export type ContactOffice = {
  city: string;
  label: string;
  people: Array<{
    name: string;
    phone: string;
  }>;
};

export type NeedOption = {
  id: string;
  label: string;
};

// ---------------------------------------------------------------------------
// Contact Hero
// ---------------------------------------------------------------------------
export const CONTACT_HERO = {
  eyebrow: "HEY THERE!",
  headline1: "LET'S",
  headline2: "MAKE",
  headline3: "THEM LOOK.",
  headline4: undefined as string | undefined,
  supportWords: ["IDEAS.", "BRANDS.", "CULTURE.", "PEOPLE."],
  supportTagline: "THAT'S WHAT WE KCATCH.",
  annotation1: "GOOD IDEAS START HERE.",
  annotation2: "MAKE GOOD NOUBLE.",
  // TODO: replace with approved studio/camera hero image
  bgImage: "/contact/hero-bg.jpg",
};

// ---------------------------------------------------------------------------
// Contact Form
// ---------------------------------------------------------------------------
export const CONTACT_FORM = {
  heading: "START A CONVERSATION",
  orNote: "OR JUST SAY HI. WE DON'T BITE.",
  cta: "SEND IT",
  fields: {
    name: { label: "Your Name", placeholder: "John Doe" },
    email: { label: "Email", placeholder: "you@company.com" },
    company: { label: "Company", placeholder: "Your Company" },
    message: {
      label: "What are we KCATCHing?",
      placeholder: "Tell us about your project... The bigger, the better!",
    },
    need: { label: "What do you need?" },
  },
};

// ---------------------------------------------------------------------------
// Need Options (chips)
// ---------------------------------------------------------------------------
export const NEED_OPTIONS: NeedOption[] = [
  { id: "branding", label: "Branding" },
  { id: "campaign", label: "Campaign" },
  { id: "content", label: "Content" },
  { id: "social", label: "Social" },
  { id: "influencer", label: "Influencer" },
  { id: "something-weird", label: "Something Weird" },
];

// ---------------------------------------------------------------------------
// Offices — from approved KCATCH brochure
// ---------------------------------------------------------------------------
export const OFFICES: ContactOffice[] = [
  {
    city: "Ahmedabad",
    label: "KCATCH AHMEDABAD",
    people: [
      { name: "Adit Suvarna", phone: "+91 81604 73945" },
      { name: "Jay Panchal", phone: "+91 87349 31730" },
    ],
  },
  {
    city: "Pune",
    label: "KCATCH PUNE",
    people: [{ name: "Shagun Shukla", phone: "+91 99981 19667" }],
  },
];

// ---------------------------------------------------------------------------
// Contact CTA
// ---------------------------------------------------------------------------
export const CONTACT_CTA = {
  headline1: "CREATIVE",
  headline2: "PEOPLE",
  headline3: "ALWAYS",
  headline4: "FIND A WAY.",
  body: "Brands. Campaigns. Content. Culture. Influence. Let's build what's next.",
  cta: { label: "LET'S TALK", href: "/contact" },
  polaroidNote1: "BUILT TO MAKE YOU SEEN.",
  polaroidNote2: "SAME CREW. DIFFERENT MADNESS.",
  // TODO: replace with approved polaroid images
  polaroid1: "/contact/polaroid-01.jpg",
  polaroid2: "/contact/polaroid-02.jpg",
};
