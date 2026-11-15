# Oreo Stylessy — website

A single-page site for the studio, built in plain HTML / CSS / JS. No framework,
no build step, no dependencies. Open `index.html` or serve the folder.

```bash
python3 -m http.server 4321 --directory site
```

Then visit `http://localhost:4321`.

---

## Files

```
site/
  index.html          all markup, one page
  css/style.css       tokens, layout, every animation
  js/main.js          12 numbered blocks, one concern each
  assets/
    mark.svg          the A3 Balance mark (favicon + header)
    lockup.svg        full logo lockup
    img/*.svg         placeholder imagery — see below
```

---

## ⚠️ Replace before this goes live

**1. Every image is a placeholder.** The files in `assets/img/` are abstract
line compositions drawn from the logo concepts — they are there so the layout
reads as designed, not as real photography. Interior design sites live or die
on the photographs. Swap each one by changing the `src`; the CSS uses
`object-fit: cover` everywhere, so any aspect ratio drops in cleanly.

| Slot | File | Used in |
|---|---|---|
| Hero backdrop | `studio.svg` | `.hero__bg` |
| Studio portrait | `about.svg` | intro section |
| Studio wide | `studio.svg` | studio section |
| Projects 1–6 | `project-01…06.svg` | the horizontal rail |

The services list also pulls previews via `data-img` on each `<li>` — point
those at real project photos too.

**2. Bracketed copy is not real.** Search the HTML for `[` and you will find
`[YOUR EMAIL]`, `[YOUR PHONE]`, `[YOUR STUDIO ADDRESS]`, `[CLIENT NAME]`,
`[PROJECT]`. The testimonial is written as sample copy, not a real quote.

**3. The numbers are sample content.** `12 years`, `140+ spaces`, `9 cities`
and the six project names/years are placeholders — replace with the studio's
actual record before publishing.

---

## Motion

Everything is hand-written; nothing is pulled from a library.

| Effect | Where |
|---|---|
| Logo stroke-draw + counter | loader |
| Line-mask reveals on headings | `[data-split]` → JS splits on newlines |
| Fade-and-rise on scroll | `[data-reveal]`, `data-delay="1…3"` |
| Curtain + scale image reveal | `.reveal-img` |
| Parallax layers | `[data-parallax="0.18"]` — negative scrolls the other way |
| Scroll-driven horizontal gallery | `.rail` pins, track translates on scroll |
| Infinite marquee | CSS keyframes, content duplicated once |
| Counting statistics | `[data-count]` + optional `data-suffix` |
| Cursor-following image peek | services list |
| Magnetic buttons | `[data-magnetic]` |
| Progress line fill | process section |
| Custom cursor with hover labels | `[data-cursor="view"]` sets the label |
| Header hide on scroll down | `.head.is-hidden` |
| Full-screen menu, staggered in | burger |

**Timing lives in `:root`** — `--e` (the easing everything shares), `--t-f`,
`--t-m`, `--t-s`. Change those four values and the whole site retimes.

### Accessibility notes

- `prefers-reduced-motion: reduce` switches off every animation, the custom
  cursor and the scroll-jacked rail — the gallery becomes a normal scroller.
- Below 760px the pinned rail also becomes a native swipe carousel with
  scroll-snap, so touch users never fight a hijacked scroll.
- The loader has a hard 3.2s ceiling on a `setTimeout`, not just `requestAnimationFrame`,
  so a throttled background tab can never leave someone stuck behind the curtain.

---

## Palette — black & gold, locked

Seven tokens at the top of `css/style.css`, nothing hardcoded anywhere else:

| Token | Value | Role |
|---|---|---|
| `--ink` | `#0a0806` | page ground |
| `--ink-2` | `#110d0a` | raised panels — marquee, CTA |
| `--gold` | `#c9a367` | the brand gold |
| `--gold-lt` | `#e8cf98` | highlight — stats, hover |
| `--cream` | `#ece4d6` | body text |
| `--mute` | `rgba(236,228,214,.62)` | secondary text, 4.9:1 on `--ink` |
| `--hair` | `rgba(201,163,103,.22)` | rules and borders |

Same gold as the logo lockup. If the palette ever changes, these seven lines
are the only edit.

## Type

`Cormorant Garamond` (display) and `Jost` (UI), both loaded from Google Fonts
and both SIL Open Font License. Same pair as the logo lockup — see the
project README one level up for the tracking rules.

---

## Reference scan

Patterns were drawn from Dribbble's `interior-designer-website` tag, Hostinger's
interior-design template set and Envato Elements' interior web templates.
ThemeForest sits behind a Cloudflare bot check and was not scanned.

Nothing here is copied from any template — the recurring *structure* across
those sources (full-bleed hero → manifesto → project grid → numbered services
→ process → contact) is what informed the layout. The visual language is the
studio's own: the gold-on-black palette, the Cormorant/Jost pairing and the
arch-and-light motifs all come from the logo work in `../concepts/`.
