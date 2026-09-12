# KCATCH Animation System

## 1. Motion philosophy

Motion should feel like the website is physically unfolding as the user moves through a creative presentation.

Use motion to:

- Reveal.
- Transition.
- Focus attention.
- Create depth.
- Establish continuity.

Do not animate everything.

## 2. Core stack

- Lenis: smooth scroll.
- GSAP: timeline engine.
- ScrollTrigger: scroll synchronization.
- CSS transforms/clip-path: efficient visual effects.

## 3. Motion intensity

### Hero

Highest motion priority.

### Featured Work horizontal section

Highest interaction priority.

### Projects

Medium-high.

### Contact

Medium.

### Footer/decorative graphics

Low.

## 4. Hero animation

The client/reference direction calls for a cinematic scroll-controlled video hero.

Target behavior:

```text
Hero starts
  ↓
video frame 0
  ↓ scroll
video scrubs forward
  ↓
typography reveals
  ↓
CTA becomes active
  ↓
hero exits
```

Use a scrubbed timeline rather than autoplay as the primary storytelling mechanism.

If video is not yet available, implement the same timeline using a static image sequence or controlled media placeholder so the architecture can later accept the real video.

## 5. Hero text reveal

Use a mask/clip reveal.

Recommended:

- Split heading into lines.
- Each line starts clipped below its visible area.
- Animate `yPercent` into place.
- Stagger lines by 40-80ms.
- Use a slightly delayed opacity.

Avoid character-by-character animation for the main hero unless specifically approved. It can look gimmicky.

## 6. Hero image motion

Use very subtle scale:

```text
scale 1.08 → 1.00
```

and small opposing translation for foreground graphic elements.

The foreground should move less than the background.

## 7. Home Featured Work horizontal scroll

This is the signature interaction.

Structure:

```text
SECTION START
  ↓
pin viewport
  ↓
Project 01 active
  ↓
horizontal movement
  ↓
Project 02 active
  ↓
Project 03
  ↓
Project 04
  ↓
Project 05
  ↓
unpin
  ↓
next Home section
```

Do not use a carousel library.

### Scene transition

As the horizontal track moves:

- Previous project moves out.
- Current project occupies the visual center.
- Next project enters.
- Project number/progress updates.
- Text can use a short opacity/clip transition.
- Image can use a subtle scale or x translation.

Do not crossfade the entire page. Let the horizontal geometry create the transition.

## 8. Project scene image motion

Use layered parallax:

```text
Background image: x = -2% to 2%
Main image:       x = -4% to 4%
Sticker:          x = -8% to 8%
Handwriting:      x = opposite direction, smaller range
```

The exact values should be tuned from the scene composition.

## 9. Mask transitions

Use clip-path for:

- Image entering from side.
- White editorial card reveal.
- Yellow tape reveal.
- Large heading reveal.

Example conceptual transition:

```text
clip-path: inset(0 100% 0 0)
        ↓
clip-path: inset(0 0 0 0)
```

Avoid animating huge blur filters.

## 10. Text animations

### Section headings

Use line-mask reveal.

### Body copy

Simple fade + 8-20px vertical movement.

### Metadata

Small stagger after the main heading.

### Handwritten annotations

Reveal through:

- opacity
- clip-path
- small x/y movement

Do not animate every handwritten stroke.

## 11. Parallax sections

Use parallax selectively in:

- About/brand imagery.
- Large campaign photography.
- Contact cinematic image.
- Decorative stickers.

Never use aggressive parallax on mobile.

## 12. Tape animation

Tape should usually be static.

Optional entrance:

```text
scaleX(0) → scaleX(1)
```

with transform origin at one edge.

Do not continuously move tape across the page unless it is deliberately designed as a marquee.

## 13. Checkerboard animation

Prefer static checkerboard.

Optional section transition:

```text
xPercent: -10 → 0
```

or a one-time clip reveal.

Avoid infinite animated checkerboard movement because it competes with content.

## 14. Sticker motion

Use small entrance offsets:

- rotate -4deg → 0deg
- scale .94 → 1
- opacity 0 → 1

Hover can add:

- rotate ±2deg
- scale 1.03

Keep it subtle.

## 15. Projects page

Project cards can reveal on scroll:

1. Image clip reveal.
2. Number.
3. Title.
4. Tags.
5. CTA.

Stagger should be short.

Use different compositions between selected projects rather than identical card animation.

## 16. Contact page

CTA heading:

- Mask reveal.
- Background image slow scale.
- Yellow tape enters.
- Form fades upward.

Form interactions:

- Input focus transitions under 200ms.
- Button arrow moves slightly on hover.
- Validation should not depend on animation.

## 17. Cursor

A custom cursor can be implemented on desktop only.

States:

- Default dot.
- Link: expanded ring.
- Image: `VIEW`.
- Project: arrow.
- Drag/horizontal section: `SCROLL`.

Disable on touch devices.

## 18. Reduced motion

When `prefers-reduced-motion: reduce`:

- Disable Lenis smoothing or reduce it to native behavior.
- Disable parallax.
- Disable clip-heavy transitions.
- Disable custom cursor.
- Disable pinned horizontal transformation.
- Render Featured Work as a normal vertical stack.
- Keep all content visible.

## 19. Motion tokens

```ts
const motion = {
  fast: 0.2,
  normal: 0.45,
  slow: 0.8,
  reveal: 1.0,
  ease: "power3.out",
  scrub: 0.8,
};
```

These are starting tokens, not rigid values.

## 20. Rule

One visual idea per animation.

If the user notices the animation before the content, the animation is probably too strong.
