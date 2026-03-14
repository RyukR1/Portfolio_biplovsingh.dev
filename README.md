# biplovsingh.dev — Personal Portfolio

Personal portfolio website for **Biplov Singh**, a Data Science & Machine Learning developer.
Built with vanilla HTML, CSS, and JavaScript — zero frameworks, zero dependencies.

**Live site:** [biplovsingh.dev](https://biplovsingh.dev)

---

## Sections

| Section | Description |
|---------|-------------|
| Hero | Introduction, typewriter effect, animated code window |
| About | Background, tech stack, terminal snippet |
| Skills | Categorized skill cards with proficiency levels |
| Projects | Aspect Pulse, Reddit Sentiment Pipeline, Movie Recommendation System |
| Contact | Social links + validated contact form |

---

## Tech Stack

- **HTML5** — semantic markup
- **CSS3** — custom properties, grid, flexbox, animations (no frameworks)
- **Vanilla JavaScript** — typewriter, scroll animations, form validation, theme toggle

No npm. No build step. No dependencies.

---

## Run Locally

```bash
git clone https://github.com/biplovsingh/biplovsingh.dev.git
cd biplovsingh.dev
```

Then just open `index.html` in your browser.
Or use a local server for a closer-to-production experience:

```bash
# Python
python3 -m http.server 3000

# Node.js (npx)
npx serve .
```

---

## Deploy to GitHub Pages

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Set source to `main` branch, `/ (root)` folder
4. Save — your site will be live at `https://YOUR_USERNAME.github.io/REPO_NAME`

### Custom Domain (`biplovsingh.dev`)

Add a `CNAME` file in the repo root containing:

```
biplovsingh.dev
```

Then in your domain registrar's DNS settings, add:

```
A     @    185.199.108.153
A     @    185.199.109.153
A     @    185.199.110.153
A     @    185.199.111.153
CNAME www  YOUR_USERNAME.github.io.
```

GitHub Pages will automatically provision an SSL certificate.

---

## Customization

| What | Where |
|------|-------|
| Your photo | Replace `.avatar-placeholder` in `index.html` with an `<img>` tag |
| Resume | Drop `resume.pdf` in the root folder |
| GitHub / LinkedIn URLs | Search `biplovsingh` in `index.html`, replace with your handles |
| Project GitHub & demo links | Search `href="#"` in the Projects section of `index.html` |
| Contact form backend | See commented Formspree snippet in `script.js` (~line 171) |
| Typewriter phrases | Edit the `phrases` array in `script.js` (~line 110) |

---

## Project Structure

```
/
├── index.html      # All markup
├── styles.css      # Design system + responsive styles
├── script.js       # Interactivity (theme, typewriter, form, animations)
├── resume.pdf      # Your CV (add this yourself)
├── .gitignore
└── README.md
```

---

## License

MIT — feel free to use this as a template. A credit link back to this repo is appreciated but not required.
