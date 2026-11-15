# Oreo Stylessy

Website for **Oreo Stylessy — Architecture & Interior Design**. A single page
in plain HTML, CSS and JavaScript: no framework, no build step, no runtime
dependencies.

**Live:** https://abhi1999-eng.github.io/oreo-stylessy-site/

```bash
python3 -m http.server 4321 --directory site
```

---

## ⚠️ This is a design preview, not finished content

Everything visual works; the content is deliberately placeholder.

- **All imagery is placeholder.** `site/assets/img/` holds abstract line
  compositions drawn from the studio's logo marks. Interior design sites live
  on photography — real photos change everything.
- **Bracketed copy is not real:** `[YOUR EMAIL]`, `[YOUR PHONE]`,
  `[YOUR STUDIO ADDRESS]`, `[CLIENT NAME]`, `[PROJECT]`. The testimonial is
  sample copy, not a real quote.
- **The numbers are sample content** — years, projects, cities and the six
  project names and dates.

[`site/README.md`](site/README.md) lists every slot to replace.

---

## Layout

```
site/
  index.html          all markup, one page
  css/style.css       palette, layout, every animation
  js/main.js          12 numbered blocks, one concern each
  assets/             logo mark, lockup, placeholder imagery
.github/workflows/    GitHub Pages deploy
```

## Palette — black and gold, locked

Seven tokens at the top of `site/css/style.css` and nothing hardcoded
anywhere else, alpha variants included. Change those lines and the whole
site changes; there is nowhere else to look.

## Type

`Cormorant Garamond` (display) and `Jost` (UI), both from Google Fonts and
both SIL Open Font License. Same pair as the logo lockup.

## Motion

Hand-written, no library: scroll-driven horizontal project gallery, line-mask
heading reveals, parallax, custom cursor, magnetic buttons, infinite marquee,
counting statistics, a stroke-drawn logo loader.

`prefers-reduced-motion: reduce` switches all of it off, and below 760px the
pinned gallery becomes a native swipe carousel — touch users never fight a
hijacked scroll.

---

## Not in this repo

The studio's identity work — logo concepts, the client shortlist and the
contact sheets — is kept out of version control on purpose and lives only on
the working machine. See `BRAND.md` there. Don't commit it without the
client's say-so.
