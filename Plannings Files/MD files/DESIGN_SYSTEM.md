# KCATCH Design System

## 1. Visual direction

KCATCH should feel:

- Cinematic
- Bold
- Editorial
- Rebellious
- Playful
- Premium
- Graphic

The site must remain distinctly KCATCH rather than visually copying any reference website.

## 2. Color tokens

These are implementation tokens based on the approved KCATCH visual direction.

```css
:root {
  --kc-blue: #283474;
  --kc-yellow: #FFF000;
  --kc-black: #05070B;
  --kc-white: #FFFFFF;
  --kc-paper: #F4F1E8;
  --kc-muted: #B8BDCA;
  --kc-line: rgba(255,255,255,.18);
}
```

The exact yellow/blue values should be tuned against the supplied brand artwork during visual QA. The important requirement is the relationship: deep navy as the dominant canvas and electric yellow as the high-energy accent.

## 3. Color usage

### Default

- Main page background: deep navy / near-black.
- Primary text on dark: white.
- Primary emphasis: yellow.
- Secondary editorial panels: off-white.
- Graphic contrast: black and white.

### Yellow

Use for:

- Main headlines.
- Primary CTAs.
- Tape.
- Active indicators.
- Selected filter.
- Important words.

Do not make every element yellow.

## 4. Typography

The brochure/reference material clearly requires oversized, bold typography, but does not establish an exact digital font-family specification.

Therefore the font family must be tokenized and easy to replace.

Recommended implementation starting point:

```css
--font-display: "Bebas Neue", "Arial Narrow", sans-serif;
--font-body: "Inter", Arial, sans-serif;
--font-hand: "Caveat", "Comic Sans MS", cursive;
```

This is an implementation recommendation, not a claim that these are KCATCH's official brand fonts.

If official KCATCH font files are supplied, they replace the display token without changing component markup.

## 5. Type hierarchy

Suggested desktop scale:

```text
Display XL     clamp(4rem, 10vw, 10rem)
Display L      clamp(3rem, 7vw, 7rem)
Display M      clamp(2.5rem, 5vw, 5rem)
Heading        clamp(1.8rem, 3vw, 3.5rem)
Body           1rem - 1.2rem
Meta           .7rem - .85rem
```

Headlines should be tightly set and may use uppercase.

## 6. Layout

Use a 12-column desktop grid.

Default:

- Outer gutter: 4vw to 6vw.
- Section vertical spacing: 8vw to 14vw.
- Card gap: 16px to 32px.
- Border radius: restrained, generally 0 to 20px depending on composition.

Avoid making every component rounded.

## 7. Graphic assets

### Yellow tape

Reusable asset/component.

Properties:

- Yellow background.
- Repeated KCATCH phrase.
- Slight rotation.
- Rough/torn edge.
- Optional grain.

Possible uses:

- Section separator.
- Image overlay.
- CTA transition.
- Project annotation.

### Checkerboard

Reusable SVG pattern.

Possible uses:

- Section boundary.
- Footer border.
- Project transition.
- Small frame accent.

### Stickers

Transparent PNG/WebP or SVG where possible.

Use:

- Astronaut/character.
- Foam finger.
- Megaphone.
- Airplane.
- Crown.
- Hand-drawn marks.

### Handwritten graphics

Use sparingly for:

- Annotation.
- Directional arrows.
- Small editorial notes.
- Project commentary.

## 8. Photography

Photography should be large enough to become a compositional element.

Preferred treatments:

- Full-bleed cinematic crop.
- Editorial framed image.
- Polaroid/photo print overlay.
- Collage crop.
- Image behind typography.

Avoid generic thumbnail grids on Home.

## 9. Buttons

Primary:

- Yellow fill.
- Black/dark text.
- Strong uppercase label.
- Arrow icon.

Secondary:

- Transparent/dark fill.
- White border.
- White text.

Hover can use:

- Slight scale.
- Arrow translation.
- Background/text inversion.

Keep hover motion below roughly 250-400ms.

## 10. Navigation

Desktop:

- KCATCH logo.
- Home.
- Projects.
- Contact.
- Primary `LET'S TALK` action.

Mobile:

- Logo.
- Menu trigger.
- Full-screen or large overlay menu if required.

Navigation should remain readable over cinematic backgrounds.

## 11. Visual rhythm

Use a sequence such as:

`dark → image → yellow interruption → dark → paper → dark → yellow CTA`

This creates connection between sections without making every section identical.
