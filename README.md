# Personal website

A minimal, dark, typography-first personal site inspired by [rauchg.com](https://rauchg.com).
Built with Next.js (App Router) + TypeScript + Tailwind, with a blog powered by Notion.

- **Framework:** Next.js 16 (App Router) + React 19
- **Styling:** Tailwind CSS v4 (dark-only) + typography plugin
- **Content:** Blog posts authored in Notion, rendered as clean Markdown
- **Code highlighting:** Shiki (via rehype-pretty-code)
- **Deploy:** Vercel

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without any environment variables set, the blog shows **sample posts** from
`src/lib/mock-posts.ts` so you can build and preview immediately.

## Make it yours

All personal content lives in one file: **`src/lib/config.ts`**
(name, role, location, tagline, socials, About paragraphs, and Projects).

- To add an avatar: drop an image in `public/` and set `about.avatar` to its path
  (e.g. `"/avatar.jpg"`).
- To change the domain: set `siteConfig.url`.

## Blogging with Notion

1. Create an integration at <https://www.notion.so/my-integrations> and copy its
   **Internal Integration Secret**.
2. Create a Notion **database** (a full-page table) with these properties:
   | Property   | Type          |
   | ---------- | ------------- |
   | `Title`    | Title         |
   | `Slug`     | Text          |
   | `Published`| Checkbox      |
   | `Date`     | Date          |
   | `Summary`  | Text          |
   | `Tags`     | Multi-select  |
3. Share the database with your integration: open the database → `•••` →
   **Connections** → add your integration.
4. Copy the database ID from its URL (the 32-character hash) and add the values to
   `.env.local` (see `.env.example`):

   ```bash
   NOTION_TOKEN=secret_xxx
   NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   REVALIDATE_SECRET=$(openssl rand -hex 32)
   ```

To publish a post: add a row, fill in the fields, write the page body, and check
`Published`. It appears on the site within the ISR window (5 min), or instantly if
you hit the revalidation endpoint below.

### Instant publishing (optional)

After editing in Notion, trigger an immediate refresh:

```bash
curl -X POST "https://yourdomain.com/api/revalidate?secret=YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"slug":"my-post"}'
```

You can wire this to a Notion automation/webhook so publishing is fully automatic.

## Blog view counts

Each post shows a live view count next to the byline. Counts are stored in
[Upstash Redis](https://upstash.com) (serverless, free tier, ideal for Vercel):

1. Create a database at <https://console.upstash.com>.
2. Copy its **REST URL** and **REST token** into `.env.local`:

   ```bash
   UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
   UPSTASH_REDIS_REST_TOKEN=xxx
   ```

Without these set, posts display a stable placeholder number so the layout looks
right during local development. Views increment once per browser session per post.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import it at <https://vercel.com/new>.
3. Add the three environment variables in the Vercel project settings.
4. Add your custom domain under **Settings → Domains**.

## Project structure

```
src/
  app/
    page.tsx              # Home (intro + recent writing)
    about/page.tsx        # About
    projects/page.tsx     # Projects
    [year]/[slug]/page.tsx           # Post at /2025/my-post (ISR, Markdown -> HTML)
    [year]/[slug]/opengraph-image.tsx  # Per-post OG image
    api/revalidate/route.ts          # On-demand revalidation
    api/views/route.ts               # View count read/increment
    rss.xml/route.ts      # RSS feed
    sitemap.ts            # Sitemap
  components/             # Nav, Footer, PostList
  lib/
    config.ts             # <- edit your personal info here
    posts.ts              # Notion <-> mock data source
    notion.ts             # Notion API integration
    mock-posts.ts         # Sample posts (used until Notion is configured)
    markdown.ts           # Markdown -> HTML + Shiki
```
