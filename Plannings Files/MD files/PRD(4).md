# KCATCH Website PRD

## 1. Product

KCATCH Media creative-agency website test.

## 2. Objective

Create a premium, visually distinctive three-route website that communicates KCATCH's creative capability through its own visual language and through strong project proof.

The first impression must be the work. The website should feel like a creative presentation rather than a conventional agency grid.

## 3. Required routes

### Route 1: Home `/`

Required order:

1. Cinematic hero.
2. Featured Work, immediately after hero.
3. Featured Work is a scroll-driven horizontal section, not a carousel.
4. Supporting capability/brand storytelling.
5. Strong final CTA.

The reference direction explicitly requires projects immediately after the hero and recommends large visual case-study presentations with horizontal, vertical, or scroll-driven scene transitions.

### Route 2: Projects `/projects`

Required:

1. Projects intro.
2. Full showcase of KCATCH work.
3. Category/filter controls.
4. Immersive project presentations.
5. Strong closing CTA.

### Route 3: Contact `/contact`

Required:

1. Bold CTA.
2. Contact form.
3. Relevant office/contact information.
4. Social links.
5. Branded closing/footer.

## 4. Home Featured Work interaction

This is the key interaction.

The user scrolls vertically. During a pinned section, the vertical scroll progress drives horizontal translation.

It must feel like:

`scroll down → project 01 → project 02 → project 03 → project 04 → project 05 → section exits`

It must NOT feel like:

`click next → carousel card changes`.

### Initial featured sequence

Recommended starting sequence:

1. Razorpay
2. ZEE5
3. RummyCircle
4. Qatar Airways
5. AZORTE

This sequence is an implementation recommendation based on the approved concept and brochure material. The final selected project set remains data-driven so it can be changed without changing components.

## 5. Home scene behavior

At any given moment, one project is the primary visual focus.

Each project scene may contain:

- Project number.
- Client/project title.
- Category tags.
- Short description.
- One dominant campaign image.
- One or more supporting images.
- Handwritten annotation.
- Tape or sticker.
- View Project CTA.
- Progress indicator.

The next scene may be partially visible near the edge to communicate continuity.

## 6. Projects page

The Projects route should show the complete work archive available for the test.

Recommended categories:

- Campaigns
- Music Video
- Influencer Marketing
- Education
- Other

Known brochure material includes work such as Razorpay, ZEE5, RummyCircle, Qatar Airways, MY11Circle, PokerBaazi, AZORTE, Delhi Bulls, Music Video, Influencer Marketing, Hebron, and Rakshak.

## 7. Contact page

The visual tone should be direct and bold.

Primary message direction:

`LET'S MAKE THEM LOOK.`

Form fields:

- Name
- Email
- Company
- What are we KCATCHing?
- What do you need?

Suggested need chips:

- Branding
- Campaign
- Content
- Social
- Influencer
- Education
- Something else

Office information must come from the approved brochure content model.

## 8. UX principles

- Work before explanation.
- Large visual focus.
- Clear hierarchy.
- One primary action per scene.
- Motion supports orientation.
- Every animated section must remain usable without motion.
- Mobile must not be a squeezed desktop composition.

## 9. Accessibility requirements

- Semantic headings.
- Keyboard-accessible navigation and controls.
- Visible focus states.
- Sufficient text contrast.
- Form labels and errors.
- Respect `prefers-reduced-motion`.
- Do not rely on animation to communicate essential information.
- All meaningful imagery requires appropriate alt text.

## 10. Performance requirements

- Lazy-load below-fold images.
- Use responsive image sizes.
- Avoid unnecessarily large animated raster assets.
- Preload only the critical hero media.
- Keep animation work transform/opacity/clip based where possible.
- Avoid layout-triggering animation.
- Test the horizontal section on touch devices.

## 11. Acceptance criteria

The website passes the product review when:

- Exactly three routes are present.
- Home begins with the cinematic hero.
- Featured work starts immediately after the hero.
- Featured work is scroll-driven horizontal movement, not a carousel.
- Projects contains the full showcase.
- Contact contains the CTA, form, contact and social information.
- KCATCH colors and graphic motifs are consistent.
- Motion is smooth and purposeful.
- Reduced-motion behavior works.
- Content is data-driven.
- Desktop, tablet and mobile layouts are intentionally designed.
