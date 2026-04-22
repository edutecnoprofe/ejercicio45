---
name: Apex Neon
colors:
  surface: '#1e100a'
  surface-dim: '#1e100a'
  surface-bright: '#47352e'
  surface-container-lowest: '#180b06'
  surface-container-low: '#271812'
  surface-container: '#2c1c16'
  surface-container-high: '#372620'
  surface-container-highest: '#43312a'
  on-surface: '#fadcd2'
  on-surface-variant: '#e4beb1'
  inverse-surface: '#fadcd2'
  inverse-on-surface: '#3e2c26'
  outline: '#ab897d'
  outline-variant: '#5b4137'
  surface-tint: '#ffb59a'
  primary: '#ffb59a'
  on-primary: '#5a1b00'
  primary-container: '#ff5c00'
  on-primary-container: '#521800'
  inverse-primary: '#a73a00'
  secondary: '#d3fbff'
  on-secondary: '#00363a'
  secondary-container: '#00eefc'
  on-secondary-container: '#00686f'
  tertiary: '#a0c9ff'
  on-tertiary: '#00325a'
  tertiary-container: '#0096fd'
  on-tertiary-container: '#002d51'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbce'
  primary-fixed-dim: '#ffb59a'
  on-primary-fixed: '#370e00'
  on-primary-fixed-variant: '#802a00'
  secondary-fixed: '#7df4ff'
  secondary-fixed-dim: '#00dbe9'
  on-secondary-fixed: '#002022'
  on-secondary-fixed-variant: '#004f54'
  tertiary-fixed: '#d2e4ff'
  tertiary-fixed-dim: '#a0c9ff'
  on-tertiary-fixed: '#001c37'
  on-tertiary-fixed-variant: '#00497f'
  background: '#1e100a'
  on-background: '#fadcd2'
  surface-variant: '#43312a'
typography:
  display-giant:
    fontFamily: Inter
    fontSize: 120px
    fontWeight: '900'
    lineHeight: 110px
    letterSpacing: -0.04em
  headline-xl:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 52px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  body-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 30px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-margin: clamp(24px, 5vw, 64px)
  gutter: 24px
---

## Brand & Style

This design system targets high-performance athletes and luxury home-gym enthusiasts. It evokes an atmosphere of elite nocturnal training, combining the intensity of a high-end fitness studio with the futuristic clarity of a high-tech interface. 

The aesthetic is a hybrid of **Glassmorphism** and **High-Contrast Bold**. It relies on deep, obsidian-like voids contrasted against hyper-saturated neon accents. The emotional goal is to provide a sense of "prestige-performance"—making every workout feel like a cinematic event, whether viewed on a handheld device or a 75-inch gym display.

## Colors

The palette is anchored by a deep navy-black background that eliminates visual noise. **Electric Orange** is the primary action color, used for high-energy triggers and progress indicators. **Bright Cyan** serves as the secondary accent for data visualization, cooling down the intensity of the orange.

To achieve the "Neon Glow" effect, accents use a dual-layer drop shadow: one tight, high-opacity shadow and one large, diffused outer glow (e.g., `0 0 20px rgba(255, 92, 0, 0.5)`). Surfaces use semi-transparent white overlays to create the frosted glass effect.

## Typography

This design system utilizes **Inter** for its uncompromising legibility and technical precision. For large-screen TV optimization, we employ a "Giant" display tier for timers and rep counts, ensuring data is readable from 15 feet away. Headlines use extra-bold weights and tight tracking to create a powerful, "heavy-lift" feel. Body text remains clean with generous line heights to ensure clarity during movement.

## Layout & Spacing

The layout utilizes a **Fluid Grid** system that scales aggressively from mobile PWA views to large-format screens. On mobile, components span the full width to maximize touch targets. On TV screens, the content centers into a high-legibility zone with massive side margins. 

The spacing rhythm is based on an 8px base unit. We prioritize vertical "breathing room" (XL spacing) between major workout segments to prevent the UI from feeling cluttered during high-intensity intervals.

## Elevation & Depth

Hierarchy is established through **Glassmorphism** rather than traditional shadows. 
- **Base Level:** The deep #06080F background.
- **Mid Level (Cards/Panels):** Translucent white fills (5-10% opacity) with a `backdrop-filter: blur(20px)`. These panels must have a 1px solid white border at 15% opacity to define the edges against the dark background.
- **Top Level (Modals/Popovers):** Higher transparency (15% opacity) with a more intense glow on the border.

Depth is reinforced by "light leaks"—subtle, large-scale blurs of Orange or Cyan positioned behind the glass panels to create a sense of environmental lighting.

## Shapes

The shape language is "Athletic-Rounded." Most containers use a 1rem (16px) corner radius to feel modern and accessible. However, the most critical interactive elements—Action Buttons and Progress Rings—utilize pill-shapes and perfect circles to distinguish them from informational panels. This geometric contrast guides the user's eye toward movement and action.

## Components

### Massive Action Buttons
Buttons are the primary focal point. The "Start Workout" or "Next Set" buttons should be minimum 80px in height on mobile, featuring a solid Electric Orange fill, black text, and a matching orange neon glow.

### Giant Circular Timers
Timers are center-stage components. They use a thick (20px+) stroke width. The "elapsed" portion of the ring uses the Bright Cyan neon glow, while the "remaining" portion is a faint 10% white stroke.

### Glassmorphism Cards
Workout detail cards use the frosted glass treatment. They should never have a solid background. All data points within cards (Heart Rate, Calories) are paired with a small icon in the secondary accent color.

### Functional Inputs
Input fields for weight or reps are designed as "Steppers" with giant + and - buttons to accommodate sweaty or moving hands. They use the same translucent glass styling as cards but with a 2px border highlight when focused.

### Exercise Chips
Status chips (e.g., "Strength," "HIIT," "Completed") use a low-opacity fill of the accent color with high-contrast text and no blur, ensuring they remain readable at a glance.