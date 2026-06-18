# MARKETO AI™ V4

Financial Research & Intelligence Operating System — prototype.

Files: `index.html`, `data.js`, `app.js`

## Hosting on GitHub Pages

1. Add `index.html`, `data.js`, `app.js`, and `.nojekyll` to your repository root.
2. Commit and push:
   ```
   git add index.html data.js app.js .nojekyll README.md
   git commit -m "Deploy MARKETO AI V4 — sidebar layout"
   git push
   ```
3. Repository → **Settings → Pages** → Source: **Deploy from a branch**, branch `main`, folder `/ (root)` → Save.
4. Live at `https://<username>.github.io/<repo-name>/` within a few minutes.

## Layout

Fixed top bar (logo, global search, notifications, profile) + fixed left sidebar (Main Menu, Tools, MARKETO RUPEE™ mascot block, Intelligence) + a single scrolling page with three numbered dashboard sections (Executive, Research, Opportunity) + one sticky right rail (Live Market TV, News Summary, CEO Intelligence) + footer trust strip.

All data is local mock data — no API keys, no external calls, no real broadcast feeds. Research scores (Quality, Growth, Financial Health, Management, Risk) are illustrative and not investment advice.
