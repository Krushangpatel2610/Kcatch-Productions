# KCATCH Component Architecture

## 1. Principle

Build reusable structural primitives first, then page-specific compositions.

Do not make one giant component for the entire Home page.

## 2. Global components

```text
SiteShell
PageTransition
Navigation
MobileMenu
Footer
CustomCursor
SmoothScrollProvider
```

## 3. Motion components

```text
Reveal
MaskedText
ParallaxMedia
MagneticButton
ScrollProgress
HorizontalScrollSection
```

These should contain motion behavior, not KCATCH-specific content.

## 4. UI primitives

```text
Button
ArrowButton
Tag
SectionLabel
ProjectNumber
Tape
Checkerboard
Sticker
HandwrittenNote
ImageFrame
EditorialPanel
```

## 5. Home components

```text
HomePage
HeroSection
FeaturedWorkSection
ProjectScene
CapabilitiesSection
AboutSection
FamilySection
FinalCTASection
```

### Home hierarchy

```text
HomePage
 ├─ HeroSection
 ├─ FeaturedWorkSection
 │   └─ ProjectScene[]
 ├─ CapabilitiesSection
 ├─ AboutSection
 ├─ FamilySection
 └─ FinalCTASection
```

## 6. Projects components

```text
ProjectsPage
ProjectsHero
ProjectFilters
ProjectArchive
ProjectArchiveItem
ProjectsCTA
```

The archive should accept `Project[]`.

## 7. Contact components

```text
ContactPage
ContactHero
ContactForm
NeedSelector
OfficeList
SocialLinks
ContactImage
ContactCTA
```

## 8. Shared project scene

The same ProjectScene concept can be used in Home and Projects, but it should support variants.

```ts
type ProjectSceneProps = {
  project: Project;
  variant?: "featured" | "archive" | "compact";
};
```

## 9. Graphic components

### `KcatchTape`

Props:

```ts
{
  text?: string;
  rotation?: number;
  variant?: "yellow" | "white";
}
```

### `Checkerboard`

Props:

```ts
{
  density?: "tight" | "normal";
  height?: "sm" | "md";
}
```

### `Sticker`

Props:

```ts
{
  src: string;
  alt: string;
  rotation?: number;
  className?: string;
}
```

## 10. CN/class strategy

Use a shared `cn()` helper.

Keep visual variants explicit:

```text
button-primary
button-outline
project-featured
project-archive
section-dark
section-paper
section-yellow
```

Avoid one-off inline class explosions.

## 11. Asset strategy

Recommended:

```text
public/
  brand/
  projects/
    razorpay/
    zee5/
    rummycircle/
    qatar/
    azorte/
  graphics/
    tape/
    checkerboard/
    stickers/
    handwritten/
  video/
```

## 12. Content import

```text
content/site.ts
content/projects.ts
```

Components import typed content.

Example:

```ts
import { featuredProjects } from "@/content/projects";
```

## 13. Route composition

### Home

```text
<HomePage />
```

### Projects

```text
<ProjectsPage />
```

### Contact

```text
<ContactPage />
```

Keep route files thin.

## 14. Testing

Every reusable motion component should have:

- Desktop test.
- Mobile test.
- Reduced-motion test.
- Mount/unmount test.
- Keyboard interaction test where applicable.
