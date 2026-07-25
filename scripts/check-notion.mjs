// Verifies the Notion database schema + lists published posts.
// Run with:  node --env-file=.env.local scripts/check-notion.mjs
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

const expected = {
  Title: "title",
  Slug: "rich_text",
  Published: "checkbox",
  Date: "date",
  Summary: "rich_text",
  Tags: "multi_select",
};

const db = await notion.databases.retrieve({ database_id: databaseId });
console.log("\nDatabase properties found:");
const props = db.properties ?? {};
for (const [name, def] of Object.entries(props)) {
  console.log(`  ${name} (${def.type})`);
}

console.log("\nSchema check:");
for (const [name, type] of Object.entries(expected)) {
  const def = props[name];
  if (!def) console.log(`  MISSING: ${name} (expected ${type})`);
  else if (def.type !== type)
    console.log(`  WRONG TYPE: ${name} is ${def.type}, expected ${type}`);
  else console.log(`  OK: ${name}`);
}

const res = await notion.databases.query({
  database_id: databaseId,
  filter: { property: "Published", checkbox: { equals: true } },
});
console.log(`\nPublished posts: ${res.results.length}`);
for (const page of res.results) {
  const t = page.properties?.Title?.title?.map((x) => x.plain_text).join("");
  console.log(`  - ${t || "(no title)"}`);
}
console.log("");
