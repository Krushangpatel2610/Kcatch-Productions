# KCATCH Frontend Documentation Pack

This documentation defines the frontend product, visual system, motion system, content architecture, component architecture, and implementation sequence for the KCATCH website test.

## Scope

The website has exactly three routes:

- `/` Home
- `/projects` Projects
- `/contact` Contact Us

The Home route contains the cinematic hero, the Featured Work horizontal-scroll experience, and the supporting brand/CTA sections. The horizontal-scroll experience is a section inside Home, not a fourth route.

## Source hierarchy

1. KCATCH Company Brochure: source of truth for KCATCH content, projects, brand language, visual identity, client/family material, and contact details.
2. KCATCH Website References Updated: source of truth for interaction/composition references and page-order direction.
3. Approved UI concept image: source of truth for the current visual composition direction.
4. These documents: implementation contract for the frontend.

## Core principle

Build KCATCH as a creative editorial experience, not a generic agency template.

The visual language is:

**deep navy + electric yellow + black/white graphics + cinematic photography + oversized typography + tape + checkerboard + stickers + editorial collage.**

Motion should make the experience feel smooth and intentional, never noisy.

## Documentation map

- `PRD.md`: product requirements and acceptance criteria.
- `TRD.md`: technical architecture and implementation rules.
- `DESIGN_SYSTEM.md`: colors, typography, spacing, graphic assets, responsive rules.
- `ANIMATION_SYSTEM.md`: GSAP, ScrollTrigger, Lenis, parallax, masks, reveals, hover and horizontal-scroll behavior.
- `CONTENT.md`: data-driven website content model and page content.
- `COMPONENT_ARCHITECTURE.md`: shared components, section components, route composition and naming.
- `IMPLEMENTATION_PLAN.md`: staged implementation plan, including the proposed 8-hour build sequence.

## Non-goals

- No fourth route for individual project case studies in the initial test.
- No conventional carousel for Home Featured Work.
- No animation that blocks access to content.
- No visual copy of Cuberto, Deadwater, Aurey, RocketAir, or Caractère Bois.
- No hard-coded project content inside presentation components.

## Definition of done

A route is complete when its content, responsive layout, accessibility, interaction states, motion, reduced-motion behavior, performance, and visual consistency have been checked together.
