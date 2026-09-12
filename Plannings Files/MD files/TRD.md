# KCATCH Frontend TRD

## 1. Technical goal

Create a maintainable, data-driven frontend where content, visual presentation and motion are separate concerns.

## 2. Assumed stack

The implementation plan assumes:

- React + TypeScript.
- Next.js or the existing React routing setup.
- Tailwind CSS or the existing utility CSS system.
- `clsx` / `cn` style utility for conditional classes.
- GSAP.
- GSAP ScrollTrigger.
- Lenis for smooth scrolling.
- Native CSS `clip-path`, transforms and masks for visual effects.

If the existing repository already uses a different framework, preserve its conventions and map these concepts to the existing architecture rather than replacing the application foundation.

## 3. Rendering architecture

Routes:

```text
app/
  page.tsx
  projects/
    page.tsx
  contact/
    page.tsx
```

Suggested feature organization:

```text
components/
  layout/
  navigation/
  ui/
  motion/
  home/
  projects/
  contact/

content/
  site.ts
  projects.ts

styles/
  tokens.css
  globals.css
```

## 4. Motion architecture

Create one Lenis instance at the application/root level.

GSAP ScrollTrigger must use the Lenis scroll position.

Conceptually:

```text
Lenis
  ↓
requestAnimationFrame
  ↓
GSAP ticker
  ↓
ScrollTrigger
  ↓
section-specific timelines
```

Do not create independent smooth-scroll engines per route or component.

## 5. Horizontal-scroll implementation

The Home Featured Work section should use a pinned wrapper.

Concept:

```text
FeaturedWorkSection
  ├── sticky/pinned viewport
  ├── horizontal track
  │    ├── ProjectScene 01
  │    ├── ProjectScene 02
  │    ├── ProjectScene 03
  │    ├── ProjectScene 04
  │    └── ProjectScene 05
  └── progress indicator
```

ScrollTrigger controls the horizontal track:

```text
vertical scroll distance
        ↓
ScrollTrigger progress
        ↓
xPercent / translateX
        ↓
horizontal project progression
```

Avoid manually listening to wheel events. Wheel interception is what makes a normal scroll experience feel like a carousel.

## 6. Responsive strategy

### Desktop

- Full horizontal-scroll experience.
- Large cinematic scenes.
- Layered image compositions.
- Progress line.

### Tablet

- Shorter horizontal track.
- Reduced decorative layers.
- Maintain the project-at-a-time focus.

### Mobile

Prefer a controlled vertical project stack or short horizontal touch track if the interaction remains usable.

Do not force a desktop pinned horizontal experience onto a narrow viewport if it hurts readability or navigation.

## 7. Media

Use:

- `next/image` or equivalent responsive image component for raster images.
- SVG for logos, tape, checkerboard and simple graphic marks.
- PNG/WebP for illustrated stickers with transparency.
- Video only where the hero requires it.

APNG should not be the default for decorative tape/checker assets. Most of those elements are static and are better represented as SVG/PNG/WebP. Use APNG only when a genuinely frame-based raster animation is required.

## 8. Data model

Presentation components receive typed content objects.

Example:

```ts
type Project = {
  id: string;
  title: string;
  client: string;
  category: string;
  tags: string[];
  description: string;
  heroImage: string;
  supportingImages?: string[];
  annotation?: string;
  featured?: boolean;
  order: number;
};
```

Do not put client names, descriptions or phone numbers directly inside reusable components.

## 9. Motion lifecycle

Each animated component should:

1. Register its GSAP context.
2. Create timelines/triggers inside that context.
3. Clean up on unmount.
4. Respect reduced-motion preferences.
5. Avoid duplicate triggers after route navigation.

Use `gsap.context()` or the framework-appropriate cleanup pattern.

## 10. Performance

Prioritize:

- transform
- opacity
- clip-path where reasonable

Avoid continuously animating:

- width
- height
- top
- left
- box-shadow
- expensive filters

Use `will-change` only on elements that actually animate and remove unnecessary persistent usage.

## 11. Accessibility

When reduced motion is enabled:

- Disable pinned horizontal transformation.
- Show projects as a normal vertical stack.
- Keep all text and controls visible.
- Disable decorative parallax.
- Keep navigation and forms fully functional.

## 12. Browser QA

Test:

- Chrome desktop.
- Safari desktop.
- Mobile Safari.
- Chrome Android.
- Touch scrolling.
- Trackpad scrolling.
- Keyboard navigation.
- Reduced-motion preference.
- Slow network.
