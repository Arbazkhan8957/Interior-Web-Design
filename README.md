# Interior-Web-Design

Ye project scaffold hai: **Vite + React + TypeScript + TailwindCSS** jo GitHub Pages pe host karne ke liye ready hai.

## Zyada important baatein (Roman Hindi)

1. **Repo name**: `Interior-Web-Design` (base URL ke liye vite.config.ts me base set kiya gaya hai).
2. **Install**:
   ```
   npm install
   ```
3. **Development server**:
   ```
   npm run dev
   ```
   Localhost par chalne ke baad page blank nahi dikhega — example content milega.
4. **Build**:
   ```
   npm run build
   ```
   `dist/` folder ready ho jayega.
5. **Deploy to GitHub Pages** (optional):
   - `homepage` field package.json me set hai: `https://<GITHUB_USERNAME>.github.io/Interior-Web-Design`
   - GitHub username ko replace karo (`<GITHUB_USERNAME>`) apne username se.
   - Install `gh-pages` agar nahi hai: `npm install --save-dev gh-pages`
   - Fir run karo:
     ```
     npm run deploy
     ```
   - Ya manually `dist/` ko GitHub Pages ke gh-pages branch pe push karo.

## Notes
- `vite.config.ts` me `base: '/Interior-Web-Design/'` set hai — agar aap repo ka naam change karte ho to isko bhi change karna padega.
- Ye scaffold ek basic working template hai. Aap apne components, images aur CSS add kar sakte ho.

Good luck — agar chaho to main is repo me extra pages/components bhi bana doon.

## Auto-deploy (GitHub Actions)
Repo me GitHub Actions workflow add kiya gaya hai: `.github/workflows/deploy.yml`.
Jab aap `main` branch pe push karoge, workflow build karke `dist/` ko GitHub Pages pe `gh-pages` branch me deploy kar dega.
Ensure karo ke repository name `Interior-Web-Design` hi ho aur `vite.config.ts` me `base` sahi set ho.
