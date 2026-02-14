# Plaxeda's Valentine

A small interactive Valentine web page built with plain HTML, CSS, and JavaScript.

## Features

- Multi-step interactive flow
- Animated hearts and roses background
- Flip-style note book section
- Final confetti celebration

## Project Structure

- `index.html` - page structure and step content
- `css/style.css` - styling, layout, and animations
- `js/script.js` - interactions and step navigation logic
- `images/` - GIFs and photo assets

## Run Locally

1. Open `index.html` directly in your browser, or
2. Serve the folder with a local static server.

Example (Python):

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. In GitHub, open **Settings -> Pages**.
3. Set source to **Deploy from a branch**.
4. Choose branch `main` and folder `/ (root)`.
5. Save, then open the generated Pages URL.

## Notes

- `.DS_Store` files are ignored via `.gitignore` to keep commits clean.
- Keep all referenced assets inside `images/` and update paths in `index.html` when replacing files.
