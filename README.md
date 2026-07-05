# Portfolio — André Cabral Pires

Bilingual (EN/PT) single-page portfolio. Static HTML/CSS/JS, no build step, no dependencies.

## Files

- `index.html` — all content; every translatable element carries `data-en` / `data-pt`
- `styles.css` — design tokens at the top (`:root`), everything derives from them
- `script.js` — language toggle (persisted in `localStorage`) + reveal-on-scroll

## Run locally

```bash
python3 -m http.server 4173
# open http://localhost:4173
```

## Deploy

**GitHub Pages** (free, `apires89.github.io/portfolio`):

```bash
git init && git add . && git commit -m "Portfolio"
gh repo create portfolio --public --source . --push
# then: repo Settings → Pages → deploy from branch main, / (root)
```

**Netlify / Vercel**: drag this folder into their dashboard — done.

## Editing content

Change text in **both** `data-en` and `data-pt` attributes (the visible text between tags is just the EN default before JS runs). New projects: copy a `<article class="project reveal">` block inside `.project-index`.
