---
name: Dayflow Narrative
colors:
  surface: '#fbf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#fbf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ef'
  surface-container: '#efeeea'
  surface-container-high: '#eae8e4'
  surface-container-highest: '#e4e2de'
  on-surface: '#1b1c1a'
  on-surface-variant: '#444748'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f0ed'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#b22200'
  on-secondary: '#ffffff'
  secondary-container: '#d73b19'
  on-secondary-container: '#fffbff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#251a00'
  on-tertiary-container: '#a67e00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#ffdad3'
  secondary-fixed-dim: '#ffb4a4'
  on-secondary-fixed: '#3d0600'
  on-secondary-fixed-variant: '#8c1800'
  tertiary-fixed: '#ffdf9a'
  tertiary-fixed-dim: '#f8be00'
  on-tertiary-fixed: '#251a00'
  on-tertiary-fixed-variant: '#5a4300'
  background: '#fbf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2de'
typography:
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
  data-mono:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: -0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system for this HR platform bridges the gap between professional utility and editorial sophistication. It rejects the generic "SaaS Blue" aesthetic in favor of a **Modern Editorial** style—blending high-contrast typography, a warm "paper-like" color palette, and subtle Brutalist influences. 

The personality is authoritative yet rhythmic, designed to make administrative tasks feel like navigating a high-end publication. It prioritizes clarity and visual hierarchy to manage complex data without sacrificing its distinctive character. The aesthetic response should be one of "controlled energy"—highly functional but visually memorable.

## Colors
The palette is rooted in a warm, sophisticated foundation to reduce digital eye strain while maintaining high impact.

- **Surface & Backgrounds:** The primary background uses the warm cream (#FDFBF7). Secondary surfaces (containers, sidebars) use a slightly deeper tint to create logical separation.
- **Typography & Key Lines:** Pure black is avoided in favor of a deep Charcoal (#1A1A1A) to maintain a premium feel while ensuring maximum readability.
- **Accents:** The Coral (#FF5733) is the primary action color, used for high-intent CTAs. Golden Yellow (#FFC300) serves as a secondary highlight for "in-progress" states or special visual emphasis.
- **Functional Colors:** Success, Error, and Warning states utilize muted, sophisticated versions of standard semantic colors to align with the editorial tone.

## Typography
This design system employs a "Serif-Display / Sans-UI" pairing to create an editorial cadence.

- **Headlines:** Use Playfair Display for all major page titles and section headers. Its high-contrast strokes provide the "retro-premium" character.
- **Interface & Data:** Plus Jakarta Sans is used for all functional UI elements. It is chosen for its modern, open apertures which ensure high legibility in data-heavy tables and forms.
- **Hierarchy:** Use bold weights for labels to create a clear "anchor" for the eye. Use the `label-md` style (uppercase with tracking) for section titles within sidebars and card headers.

## Layout & Spacing
The layout follows a strict **8px grid system** to maintain mathematical harmony.

- **Grid Model:** A 12-column fluid grid for desktop with 24px gutters. On mobile, transition to a single-column layout with 16px side margins.
- **Editorial White Space:** This design system encourages "generous breathing room." Avoid crowding elements. Use `stack-lg` (32px) between major card components to emphasize the "objects on a surface" feel.
- **Sidebar:** The navigation sidebar is fixed at 280px width on desktop, using a distinct background tint to separate navigation from the workspace.

## Elevation & Depth
Depth is communicated through **Structural Layering** and **Bold Outlines** rather than soft shadows.

- **Flat Layering:** Surfaces are distinguished by color shifts (e.g., Cream surface on a slightly darker Off-White page background).
- **Outlines:** Use 1px or 2px solid borders (#1A1A1A) for cards and buttons. This creates a tactile, "printed" look.
- **Shadows:** When necessary for temporary overlays (modals/dropdowns), use a "Hard Shadow" style: a 4px offset with 100% opacity and no blur, or a very tight 2px blur with 10% opacity Charcoal tint. Avoid large, diffused ambient shadows.

## Shapes
The shape language is "Soft-Geometric." 

- **Corners:** Use 4px (Soft) roundedness for most UI components (inputs, small buttons) to maintain a crisp, professional edge.
- **Large Components:** Cards and primary containers use `rounded-lg` (8px) to soften the overall layout.
- **Interactive Elements:** Checkboxes are sharp or minimally rounded (2px) to lean into the technical/SaaS feel.

## Components
- **Buttons:** High-contrast with a 1px solid charcoal border. Primary buttons use the Coral (#FF5733) background with white text. Hover states should involve a "Lift" effect (a hard shadow appearing behind the button).
- **Cards:** White or Cream background with a thin charcoal border. Headers within cards should use the `label-md` typography style with a bottom border separating header from content.
- **Data Tables:** Modern and clean. Use `body-md` for row data. Headers are `label-sm` in bold charcoal. Use subtle horizontal dividers only; avoid vertical grid lines to keep the "editorial" feel.
- **Inputs:** Square-ish (4px radius), 1px charcoal border. On focus, the border weight increases to 2px or adds a Golden Yellow (#FFC300) highlight.
- **Sidebars:** Use a "Master-Detail" pattern. The primary sidebar should feel like a table of contents in a magazine, using clean typography and high-contrast icons.
- **Chips/Badges:** Use the secondary palette (Success Green, Warning Orange) with low-saturation backgrounds but high-saturation text to maintain readability and sophistication.