// One-off helper: lists every database your Notion integration can access,
// with its correct ID to put in NOTION_DATABASE_ID.
//
// Run with:  node --env-file=.env.local scripts/find-notion-db.mjs
import { Client } from "@notionhq/client";

const token = process.env.NOTION_TOKEN;
if (!token) {
  console.error("NOTION_TOKEN is not set. Add it to .env.local.");
  process.exit(1);
}

const notion = new Client({ auth: token });

const res = await notion.search({
  filter: { property: "object", value: "database" },
  page_size: 100,
});

if (res.results.length === 0) {
  console.log(
    "\nNo databases visible to this integration.\n" +
      "Open your database in Notion -> ••• -> Connections -> connect your integration, then re-run.\n",
  );
  process.exit(0);
}

console.log("\nDatabases this integration can access:\n");
for (const db of res.results) {
  const title =
    db.title?.map((t) => t.plain_text).join("") || "(untitled)";
  console.log(`  ${title}`);
  console.log(`    NOTION_DATABASE_ID=${db.id}\n`);
}
