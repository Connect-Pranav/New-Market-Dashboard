# MARKETO AI™ V5

Financial Research & Intelligence Operating System — prototype.

Files: `index.html`, `data.js`, `mascot.js`, `app.js`

## Hosting on GitHub Pages

1. Add all four files plus `.nojekyll` to your repository root.
2. Commit and push:
   ```
   git add index.html data.js mascot.js app.js .nojekyll README.md
   git commit -m "Deploy MARKETO AI V5 — 3-page structure, premium mascot"
   git push
   ```
3. Repository → **Settings → Pages** → Source: **Deploy from a branch**, branch `main`, folder `/ (root)` → Save.
4. Live at `https://<username>.github.io/<repo-name>/` within a few minutes.

## Structure

Three separate pages (Executive / Research / Opportunity), switched via a fixed left sidebar. Top bar has logo, global search, MARKETO RUPEE™ quick-access pill, notifications, profile, and a scrolling market ticker strip. Live Market TV appears only as a small (320×180-class) widget inside the Executive Dashboard — not a hero element.

MARKETO RUPEE™ is a from-scratch SVG mascot: the ₹ glyph itself is the body silhouette, with a glass faceplate, neon-blue AI eyes, a holographic rotating-tick base platform, ambient particle field, and dashed orbit ring. Six states (idle, thinking, analyzing, researching, alert, success) each drive distinct animation: analyzing orbits mini bar-chart glyphs, researching orbits document glyphs, alert pulses gold, success rises green upward chevrons.

Opportunity Dashboard includes the AI Screener (custom filters), Opportunity Finder™ (Growth/Value/Turnaround/Emerging Themes), and four scanner types (Breakout, Volume Surge, 52-Week High, Momentum) with mock data.

All data is local mock data — no API keys, no external calls, no real broadcast feeds. Research scores (Quality, Growth, Financial Health, Management, Risk) are illustrative and not investment advice.
