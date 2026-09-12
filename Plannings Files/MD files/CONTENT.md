# KCATCH Content Source

This file is the single content contract for the frontend.

Components should consume this data rather than hard-code copy.

## 1. Brand

### Primary statement

`KCATCH THE DAMN EYE`

### Supporting statement

`OH, I MADE YOU LOOK.`

### Positioning

KCATCH Media is presented in the brochure as a precision-driven attention studio combining brand strategy, visual design, content production and performance thinking into one system, with the goal of making brands not merely visible but unmissable.

### Brand idea

`VISIBILITY ISN'T LUCK. IT'S DESIGN.`

### Closing direction

`LET'S MAKE THEM LOOK.`

## 2. Home

### Hero

Eyebrow:
`KCATCH MEDIA`

Headline:
`KCATCH THE DAMN EYE`

Support:
`OH, I MADE YOU LOOK.`

Primary CTA:
`WATCH SHOWREEL`

Scroll cue:
`SCROLL TO EXPLORE`

### Featured Work

Section title:
`FEATURED WORK`

Support:
`REAL BRANDS. REAL IMPACT.`

Recommended featured sequence:

1. Razorpay
2. ZEE5
3. RummyCircle
4. Qatar Airways
5. AZORTE

The project list must remain data-driven so the sequence can be changed without changing the UI.

### What We Do

Section title:
`WHAT WE KCATCH`

Capabilities:

- Brand Strategy
- Content Production
- Campaigns & Performance
- Culture & Influence

### About

Headline:
`VISIBILITY ISN'T LUCK. IT'S DESIGN.`

The brochure describes KCATCH as an attention-focused creative studio and emphasizes strategy, visual design, content production and performance thinking.

### Our Family

Section title:
`OUR FAMILY`

Use the approved client/logo artwork from the brochure rather than inventing or redrawing logos.

### Final CTA

Headline:
`LET'S MAKE THEM LOOK.`

CTA:
`START A PROJECT`

## 3. Featured project copy

### Razorpay

Title:
`Razorpay`

Suggested short description:
`Simplifying payments through relatable stories.`

Category tags:
`CAMPAIGN`, `DIGITAL`, `SOCIAL`

Suggested annotation:
`PAYMENTS THAT FIT YOUR WORLD.`

### ZEE5

Title:
`ZEE5`

Suggested short description:
`Culture-driven storytelling that connects.`

Category tags:
`ENTERTAINMENT`, `CONTENT`, `DIGITAL`

Suggested annotation:
`STORIES THAT STAY.`

### RummyCircle

Title:
`RummyCircle`

Sub-title:
`FT. THE GREEK GOD OF BOLLYWOOD`

Suggested short description:
`Play bold. Play unforgettable.`

Category tags:
`CELEBRITY`, `CAMPAIGN`, `DIGITAL`

### Qatar Airways

Title:
`Qatar Airways`

Suggested short description:
`A higher way to travel.`

Category tags:
`TRAVEL`, `CAMPAIGN`, `CONTENT`

### AZORTE

Title:
`AZORTE`

Suggested short description:
`Style that speaks.`

Category tags:
`FASHION`, `BRAND`, `CONTENT`

## 4. Projects page categories

Use the brochure's project material to organize:

- Campaigns
- Music Video
- Influencer Marketing
- Education
- Other

Known project/client material includes:

- Razorpay
- ZEE5
- RummyCircle
- Qatar Airways
- MY11Circle
- PokerBaazi
- AZORTE
- Delhi Bulls
- Music Video / AIA NA PIYA
- Influencer Marketing
- Hebron
- Rakshak

Do not invent project results, metrics or campaign claims that are not present in the source material.

## 5. Contact

### Primary CTA

`LET'S MAKE THEM LOOK.`

### Form heading

`START A CONVERSATION.`

### Fields

- Your Name
- Email Address
- Company
- What are we KCATCHing?
- What do you need?

### Direct contact

**KCATCH AHMEDABAD**

Adit Suvarna  
+91 81604 73945

Jay Panchal  
+91 87349 31730

**KCATCH PUNE**

Shagun Shukla  
+91 99981 19667

These contact details are taken from the supplied KCATCH brochure.

### Social

Use only the social platforms/handles that are confirmed in the final approved content.

## 6. Content rules

- Preserve client/project spelling from approved source material.
- Do not fabricate campaign metrics.
- Do not fabricate testimonials.
- Do not fabricate addresses.
- Keep copy short in visual sections.
- Long explanatory copy belongs in expandable/editorial content, not inside the main project visual.
- All client logos should use approved assets.

## 7. Data shape

```ts
export type Project = {
  id: string;
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
  order: number;
};

export type ContactOffice = {
  city: string;
  people: Array<{
    name: string;
    phone: string;
  }>;
};
```
