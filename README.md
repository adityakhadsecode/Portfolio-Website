# ✦ Aditya Khadse — Portfolio Website

A modern, minimalist portfolio website. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no bloat —  just clean code and smooth animations.

---

## ✨ Features

- **Full-viewport hero** with portrait image and scrolling marquee name
- **GSAP-powered animations** — scroll reveals, parallax, staggered entries
- **Magnetic cursor effect** — buttons subtly follow mouse movement on hover
- **Slide-in navigation panel** with hamburger toggle
- **Work showcase** — project grid with hover image follower + image tile gallery
- **Live local time** display in the footer
- **Spline 3D ready** — integration slots prepared for future 3D scenes
- **Fully responsive** — optimized for desktop, tablet, and mobile

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Structure | HTML5 (Semantic) |
| Styling | Vanilla CSS (Custom Properties, Clamp, Grid) |
| Animation | [GSAP 3](https://gsap.com/) + ScrollTrigger |
| Typography | [PP Neue Montreal](https://fonts.cdnfonts.com/css/pp-neue-montreal) via CDNFonts |
| Icons | Inline SVG |

## 📁 Project Structure

```
Portfolio Website/
├── index.html          # Single-page markup — all sections
├── css/
│   └── style.css       # Design system, components, responsive
├── js/
│   ├── main.js         # GSAP animations, interactions, loader
│   └── magnetic.js     # Magnetic button hover effect module
├── its me.png          # Hero portrait image
├── .gitignore
└── README.md
```

## 🚀 Getting Started

No build step required — just serve the files:

```bash
# Using npx (quickest)
npx serve .

# Or open index.html directly in your browser
```

## 🎨 Design Details

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| Dark | `#1C1D20` | Hero bg, footer, nav |
| Light | `#FFFFFF` | Text on dark, section bg |
| Blue | `#455CE9` | CTA buttons, accents |
| Gray | `#999D9E` | Secondary text, labels |

### Sections
1. **Header** — Fixed navigation with `mix-blend-mode: difference`
2. **Hero** — Full-screen portrait, horizontal marquee, location badge
3. **Intro** — Statement text + "About me" circle button
4. **Work Grid** — Project list with hover image follower
5. **Work Tiles** — 4-column image gallery with zoom hover
6. **Footer** — CTA, contact buttons, socials, live clock

### Animations
- Page loader with pulsing text
- Hero entry sequence (image → badge → info → marquee → header)
- Scroll-triggered fade-ins with staggered delays
- Continuous marquee with scroll-speed boost
- Parallax on hero image

## 🔮 Future Plans

- [ ] Integrate Spline 3D scenes (hero background, interactive elements)
- [ ] Add project detail pages
- [ ] Dark/light theme toggle
- [ ] Contact form with serverless backend
- [ ] Deploy to custom domain

## 📝 Credits

- Design inspiration: [Dennis Snellenberg](https://dennissnellenberg.com/)
- Font: [PP Neue Montreal](https://pangrampangram.com/products/neue-montreal) by Pangram Pangram
- Animation library: [GSAP](https://gsap.com/) by GreenSock
- Placeholder images: [Unsplash](https://unsplash.com/)

---

<p align="center">
  <strong>© Code by Aditya Khadse</strong><br>
  <sub>Built with passion, no frameworks needed.</sub>
</p>
