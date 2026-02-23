# Portfolio Website Color Guidelines

This document outlines the color system for the Aditya Khadse Portfolio Website, inspired by a sophisticated organic palette.

## Palette Overview

| Role | Color | Hex Code | Description |
| :--- | :--- | :--- | :--- |
| **Primary Background** | Light Sand | `#cab7a2` | The main background for light themes, providing a warm, premium feel. |
| **Secondary Background** | Warm Taupe | `#b4ada3` | Used for subtle section differentiation and secondary surfaces. |
| **Primary Accent** | Rose Beige | `#c4b1ae` | Main interactive color for buttons, hovered states, and highlights. |
| **Secondary Accent** | Olive Beige | `#bfb59e` | Used for hover variations and supporting interactive elements. |
| **Primary Text & Border** | Medium Grey | `#858786` | Used for body text, icons, and soft borders. |
| **Contrast Accent** | Deep Charcoal | `#1C1D20` | Retained from previous design for high-contrast headings and dark mode foundations. |

## Usage Rules

### 1. Backgrounds
*   Use `--color-bg-primary` (`#cab7a2`) as the base for the "light" sections (Intro, Work Grid, Work Tiles).
*   Use `--color-bg-secondary` (`#b4ada3`) for transitions or smaller containers within sections.

### 2. Typography
*   **Headings**: Use `--color-text-emphasis` (`#1C1D20`) for maximum readability.
*   **Body Text**: Use `--color-text-main` (`#858786`) for a softer, more integrated look.
*   **Light Text**: Use `--color-text-white` (`#FFFFFF`) on dark backgrounds.

### 3. Interactive Elements (Buttons & Links)
*   **Main Buttons**: Circular buttons and CTA backgrounds should use `--color-accent-rose` (`#c4b1ae`).
*   **Hover States**: Transition to `--color-accent-olive` (`#bfb59e`) on hover.
*   **Underlines**: Navigation and link underlines should use the current text color.

### 4. Borders & Divides
*   Use `--color-border-subtle` (`rgba(133, 135, 134, 0.2)`) for section dividers and row separators.

## CSS Implementation
The colors are implemented as CSS variables in `:root`:
```css
:root {
  --color-bg-primary: #cab7a2;
  --color-bg-secondary: #b4ada3;
  --color-accent-rose: #c4b1ae;
  --color-accent-olive: #bfb59e;
  --color-text-main: #858786;
  --color-text-emphasis: #1C1D20;
}
```
