# KCATCH Frontend Implementation Plan

## 1. Build strategy

Implement the site in a controlled sequence.

Do not build all three routes simultaneously.

Recommended order:

1. Foundation.
2. Home.
3. Projects.
4. Contact.
5. Global polish and QA.

The Home page receives the most attention because it contains the signature cinematic and horizontal-scroll experience.

## 2. Proposed 8-hour implementation sequence

This is a focused implementation schedule, not a promise that every asset or integration will require exactly one hour.

### Hour 1: Foundation

- Confirm existing project framework.
- Set global CSS tokens.
- Add fonts or font placeholders.
- Create Lenis provider.
- Create GSAP/ScrollTrigger utility.
- Create route shell.
- Create navigation.
- Create footer.
- Create content data files.
- Establish asset folders.
- Establish reduced-motion handling.

Deliverable:

All three routes render with shared shell and design tokens.

### Hours 2-3: Home

#### Hour 2

Build:

- Hero structure.
- Cinematic media layer.
- Hero typography.
- CTA.
- Scroll cue.
- Hero mask reveals.
- Navigation overlay behavior.

#### Hour 3

Build:

- Featured Work horizontal-scroll section.
- Pinned section.
- ProjectScene.
- Razorpay first scene.
- ZEE5, RummyCircle, Qatar Airways and AZORTE scene data.
- Horizontal progress.
- Image/text parallax.
- Tape/checker/sticker overlays.

Critical deliverable:

One polished horizontal scene must be correct before scaling to all five projects.

### Hours 4-5: Home completion + Projects

#### Hour 4

Home:

- Capabilities.
- About.
- Family/client section.
- Final CTA.
- Section transitions.
- Responsive adjustments.

#### Hour 5

Projects:

- Projects hero.
- Category filters.
- Full project archive.
- Editorial project layouts.
- Scroll reveals.
- Closing CTA.

### Hour 6: Projects polish

- Vary project compositions.
- Add visual hierarchy.
- Tune image crops.
- Add hover states.
- Improve project numbering.
- Add orbital-inspired optional composition where useful.
- Avoid turning the archive into a repetitive card wall.

### Hour 7: Contact

- Contact hero.
- Large CTA typography.
- Contact form.
- Need selector.
- Office information.
- Social links.
- Contact photography.
- Branded footer.
- Validation and keyboard states.

### Hour 8: QA and polish

- Desktop visual pass.
- Tablet pass.
- Mobile pass.
- Reduced-motion pass.
- Lenis/ScrollTrigger cleanup.
- Route navigation testing.
- Image loading test.
- Keyboard navigation.
- Form accessibility.
- Performance pass.
- Remove excessive motion.
- Final visual consistency pass.

## 3. Implementation order inside Home

Do not build decorative details first.

Use:

```text
1. Layout
2. Typography
3. Image composition
4. Content
5. Interaction
6. Motion
7. Decorative graphics
8. Polish
```

## 4. Horizontal section development sequence

### Step 1

Build a static Razorpay scene.

### Step 2

Build horizontal track.

### Step 3

Connect vertical scroll to horizontal progress.

### Step 4

Add scene-specific content transitions.

### Step 5

Add parallax layers.

### Step 6

Add progress indicator.

### Step 7

Add ZEE5, RummyCircle, Qatar Airways and AZORTE.

### Step 8

Test section exit and next section continuity.

## 5. Important implementation rule

Do not make the first horizontal scene dependent on five different animation systems.

Use one master ScrollTrigger timeline.

Each ProjectScene reads the same progress and derives its own local state.

## 6. Visual QA checklist

### Home

- Does the hero immediately communicate KCATCH?
- Does Featured Work start directly after the hero?
- Does the horizontal section feel like scrolling through a presentation?
- Does each project have one dominant focal point?
- Are tape/checker/stickers supporting rather than overwhelming?
- Does the section exit smoothly?

### Projects

- Does the page feel like a full archive?
- Are projects visually differentiated?
- Are filters usable?
- Does the page remain fast?

### Contact

- Is the CTA dominant?
- Is the form easy to complete?
- Are office details readable?
- Does the page end strongly?

## 7. Definition of complete

The implementation is ready for final review when:

- All three routes work.
- Content comes from data files.
- The Home Featured Work section is horizontal-scroll-driven.
- No carousel dependency exists for Featured Work.
- GSAP and Lenis are integrated cleanly.
- Motion has reduced-motion fallback.
- Responsive layouts are intentional.
- No placeholder copy remains in production sections.
- No invented project facts remain.
