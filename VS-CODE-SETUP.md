# LUXHWORK in VS Code

## 1. Requirements

- Node.js 22 or newer
- Git
- pnpm 10
- Visual Studio Code

Install pnpm if needed:

```bash
npm install --global pnpm
```

## 2. Clone and open

```bash
git clone https://github.com/nha-twenty4/LUXHWORK..git
cd LUXHWORK
code .
```

If the repository is already cloned, open the `LUXHWORK` folder directly in VS Code.

## 3. Install dependencies

Open the VS Code terminal with **Terminal → New Terminal**, then run:

```bash
pnpm install
```

VS Code will recommend the project extensions. Install them from the Extensions panel if they are not installed yet.

## 4. Start the website

```bash
pnpm dev
```

Open the local URL shown in the terminal, normally `http://localhost:3000`.

You can also open **Terminal → Run Task… → LUXHWORK: Dev server**.

## 5. Useful commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start local development server |
| `pnpm check` | Run TypeScript typecheck |
| `pnpm test` | Run the test suite |
| `pnpm build` | Create a production build |

The same commands are available through **Terminal → Run Task…**.

## 6. Recommended workflow

1. Create a new branch before a larger UI change:

   ```bash
   git checkout -b ui/my-change
   ```

2. Edit the UI mainly in:
   - `client/src/pages/Home.tsx` — pages and components
   - `client/src/index.css` — global styling and responsive rules
   - `client/src/projectMedia.ts` — project image mapping
   - `client/src/uploadedProjectMedia.ts` — uploaded project assets

3. Run validation:

   ```bash
   pnpm check
   pnpm build
   ```

4. Save, commit, and push:

   ```bash
   git add .
   git commit -m "Describe the UI change"
   git push origin ui/my-change
   ```

## 7. VS Code files included

- `.vscode/settings.json` — formatting and workspace exclusions
- `.vscode/extensions.json` — recommended extensions
- `.vscode/tasks.json` — install, dev, check, test, and build tasks
- `.editorconfig` — consistent indentation and line endings
