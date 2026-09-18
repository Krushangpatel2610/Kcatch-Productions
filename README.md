# KCATCH Media

A highly interactive, cinematic agency website built for KCATCH Media. The site emphasizes bold typography, fluid animations, and a seamless scroll-driven user experience.

## Technology Stack

- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS v4
- **Animation:** GSAP (GreenSock), `@gsap/react`, ScrollTrigger
- **Smooth Scrolling:** Lenis

---

## Animation Strategy & Motion Architecture

The site relies heavily on a synchronized animation system to deliver a "cinematic" feel:

1. **Lenis Smooth Scroll (`SmoothScrollProvider`)**
   We use Lenis to hijack and smooth the native browser scroll. This provides a buttery-smooth experience that synchronizes perfectly with GSAP's `ScrollTrigger` for scroll-linked animations.

2. **The Preloader Gate (`lib/motion/preloader-gate.ts`)**
   Because the site has a custom loading sequence (`Preloader`), we cannot rely on standard `useEffect` on-mount triggers for entrance animations. Instead, we use a custom event emitter. Any component that needs to animate in (like the Hero text or the Navigation bar) subscribes to `onPreloaderDone()`. This guarantees that nothing animates underneath the loading screen before the user can actually see it.

3. **GSAP & React Integration (`useGSAP`)**
   All complex animations are built using GSAP timelines. We use the `@gsap/react` `useGSAP` hook for automatic cleanup and scope management, preventing memory leaks and orphaned animations during route changes.

4. **Reusable Motion Primitives (`components/motion/`)**
   Instead of writing GSAP code in every component, we wrap elements in reusable primitives:
   - `<Reveal>`: Triggers a slide-and-fade entrance when scrolled into view.
   - `<MaskText>`: Staggers individual lines of text from behind a hidden mask for dramatic typographic entrances.

---

## Project Structure

The project is structured to separate content from presentation, and to group components logically by their domain.

### `/app` (Routing)
Standard Next.js App Router structure.
- `page.tsx`: Home page
- `projects/page.tsx`: Projects showcase
- `contact/page.tsx`: Contact form and office locations
- `layout.tsx`: Global layout, injects fonts and the `SmoothScrollProvider`.

### `/components` (UI & Presentation)
- **/contact, /home, /projects:** Page-specific sections (e.g., `hero-section.tsx`, `featured-work-section.tsx`).
- **/graphics:** Recurring brand visual elements like `<TapeStack>`, `<Sticker>`, and `<HandwrittenNote>`.
- **/layout:** Global shell components like `<SiteShell>`, `<Navigation>`, `<Footer>`, and `<Container>`.
- **/motion:** The reusable animation wrappers discussed above.

### `/content` (Static CMS)
To avoid hardcoding text directly into the React components, all copy and data are centralized here.
- `site.ts`: Global data (Nav links, footer info, social links).
- `projects.ts`: Project portfolio data (titles, descriptions, categories, images).
- `contact.ts`: Contact page copy.

### `/lib` (Utilities)
- `utils.ts`: Standard Tailwind class merging (`cn`).
- `motion/preloader-gate.ts`: The global event emitter for the preloader.
- `motion/reduced-motion.ts`: Accessibility utility to detect `prefers-reduced-motion` and disable complex animations for users who request it.

---

## Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
