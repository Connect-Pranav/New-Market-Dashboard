# MARKETO AI™

Financial Research & Intelligence Operating System — single-file HTML prototype.

## Hosting on GitHub Pages

1. Create a new repository (or use an existing one).
2. Add `index.html` and `.nojekyll` to the repository root.
3. Commit and push:
   ```
   git add index.html .nojekyll README.md
   git commit -m "Deploy MARKETO AI v4"
   git push
   ```
4. In the repository, go to **Settings → Pages**.
5. Under **Source**, select **Deploy from a branch** (or **GitHub Actions** if prompted), choose the `main` branch and `/ (root)` folder, then save.
6. Your site will be live at `https://<your-username>.github.io/<repo-name>/` within a few minutes.

## Notes

- Single file, no build step, no dependencies, no API keys required.
- All data (companies, screener universe, news, TV channels) is local mock data.
- Live Market TV is a full UI/interaction prototype using mock channel states — not a real broadcast feed.
