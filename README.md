# Daarika Magesh - GitHub Pages Site

This folder is a ready-to-publish personal website for **GitHub Pages**.

## Publish on GitHub.io (Project Pages)

1. Create a new repository on GitHub (example: `daarika-site`).
2. Upload **everything inside this folder** (`index.html`, `styles.css`, `script.js`, `assets/`, etc.).
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose:
   - **Source:** Deploy from a branch
   - **Branch:** `main` (or `master`) and **/(root)**
5. Save. Your site will appear at:
   - `https://<your-username>.github.io/<repo-name>/`

## Publish on GitHub.io (User/Org Pages)

If you want the URL to be `https://<your-username>.github.io/`:

1. Create a repo named exactly: `<your-username>.github.io`
2. Upload this folder contents to the repo root.
3. Enable Pages (same Settings → Pages steps).

## Edit content

- Update text in `index.html`.
- Add a new blog post by duplicating an existing `<article class="post">...</article>` inside the Blog section.
- Replace `assets/Daarika_Magesh_Resume.pdf` with an updated resume when needed.

## Theme colors

The theme uses these approximations for screen display:
- PANTONE 13-4401 TCX (Quiet Tide) → `#C0E3F0`
- PANTONE 16-4023 TCX (Rain Washed) → `#8192AB`

You can change them in `styles.css` under `:root`.
