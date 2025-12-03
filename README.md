# Interior-Web-Design

This project is a Vite + React + TypeScript + TailwindCSS scaffold, ready to be deployed on GitHub Pages.

Important Points

1. Repository Name
2. Your repo name is: Interior-Web-Design
3. The base URL is already set correctly inside vite.config.ts.
4. Install Dependencies
   ```
   npm install
   ```
5. Start the Development Server
   ```
   npm run dev
   ```
   After the server starts, the page will not be blank — you will see example content displayed.
6. Build for Production
   ```
   npm run build
   ```
   `The production-ready output will be generated inside the dist/ folder.
7. Deploy to GitHub Pages (Optional)
   - `The homepage field inside package.json is set to:`
   - Replace <GITHUB_USERNAME> with your actual GitHub username.
   - Install GitHub Pages deployment helper:
   - npm install --save-dev gh-pages
   - Deploy using:
     ```
     npm run deploy
     ```
   - Push the generated dist/ folder manually to the gh-pages branch.

Notes
- `In vite.config.ts, the base option is set to:
- base: '/Interior-Web-Design/'


If you ever rename the repository, you must update this value accordingly.

This scaffold is a basic working template.
You can freely add your own components, images, and custom CSS.

Auto-Deploy (GitHub Actions)

A GitHub Actions workflow exists at.
Whenever you push to the main branch:

The workflow automatically builds the project.

It deploys the dist/ folder to the gh-pages branch.

Make sure:

Your repository is named Interior-Web-Design

The base value in vite.config.ts is correct.
