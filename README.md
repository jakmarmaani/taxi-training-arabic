# Taxi and Private Hire Training Practice

A small Arabic-first bilingual study app built with plain HTML, CSS and JavaScript. It has no paid services, package installation or server requirement. It can run locally by opening `index.html`, or be published as a static GitHub Pages site.

## Files

- `index.html` — page structure and controls
- `style.css` — responsive layout and right-to-left styling
- `app.js` — language toggle, filters, answer checks and local notes
- `questions.js` — question bank, Arabic translations and answer key notes

## Run locally

Download/extract the folder and open `index.html` in a browser. The app uses browser `localStorage` only for written notes; the notes stay on that device and are not submitted to anyone.

## Publish with GitHub Pages

1. Create a new **public** GitHub repository, for example `taxi-training-arabic`.
2. Upload the four files above to the repository root, or use Linux terminal:

   ```bash
   cd taxi-training-arabic
   git init
   git add index.html style.css app.js questions.js README.md
   git commit -m "Create Arabic taxi training practice app"
   git branch -M main
   git remote add origin https://github.com/jakmarmaani/taxi-training-arabic.git
   git push -u origin main
   ```

3. On GitHub, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/(root)`, then save.
4. GitHub will show the published website address in the Pages section.

Create the repository first under the GitHub account `jakmarmaani`, then run these commands. Do not upload private learner information into a public repository.

## Editing and checking questions

Edit `questions.js`. Each object has the English and Arabic prompt, module, printed source page and either answer options or a written-answer type. For a choice question, set `answer` to the zero-based option number. The answer explanations are study notes based on the supplied answer key and should be checked against the original page.

The PDFs include scanned tables and diagrams. This question bank includes the clearly identifiable activity prompts and selected answer-key items; check each scan and add any missing rows before calling it a complete transcription. The course material is marked City of Edinburgh Council 2020, so obtain permission before republishing the source text or a full translation publicly. Confirm current licensing rules before using it for formal training.
