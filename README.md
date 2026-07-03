# BandaDeCuarta

Responsive music landing page for BandaDeCuarta, built with Next.js, TypeScript, and Tailwind CSS for Vercel deployment.

The site is public, has no authentication, has no database, and does not require environment variables.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Project Structure

- `src/app/page.tsx` renders the landing page.
- `src/components/MusicLanding.tsx` contains the menu and audio player behavior.
- `src/data/songs.ts` maps song titles to public audio paths.
- `public/images/cover.jpg` is the full-screen background image.
- `public/audio/` contains the MP3 files served by the website.
- `public/lyrics/` contains one TXT lyric file per song.

## Audio Behavior

Selecting a song starts playback from the song menu. If a browser blocks playback, the player keeps the selected song loaded and shows a clear play state.

## Song Sharing

The share button creates a public link with `?song=<song-id>`. Opening that link selects the shared song automatically, so it can be sent through WhatsApp or any messaging app.

## Lyrics

Lyrics live in `public/lyrics/` as one `.txt` file per song. The player loads the text file for the selected song and opens the lyrics in a scrollable modal from the lyrics icon.

The app does not sync lyrics to the audio or save lyric data from the browser. A visitor's browser cannot write back to these static text files after deployment without adding a backend, database, or authenticated write flow.

## Privacy And Security

- No secrets, API keys, tokens, credentials, or private configuration are required.
- `.env*` and `.vercel` are ignored by Git.
- Do not commit local credentials or generated deployment state.

## Deployment

### GitHub

Create a GitHub repository under `manuk-coder`, then push this local repository:

```bash
gh repo create manuk-coder/banda-de-cuarta --public --source=. --remote=origin --push
```

Authenticate with GitHub CLI first if prompted:

```bash
gh auth login
```

### Vercel

Link and deploy the project with the Vercel CLI:

```bash
vercel
vercel --prod
```

Use the Vercel account for `manuk.coder@gmail.com` when authenticating. Keep `.vercel/` uncommitted.

## Notes

The original media was inspected from the local `assets/` folder and copied into `public/` with URL-safe filenames so Next.js can serve it directly.
