import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import type { PostMeta, Post } from "@/lib/posts";

/**
 * Notion database property names. Change these to match your database if you
 * name the columns differently.
 */
const PROP = {
  title: "Title",
  slug: "Slug",
  published: "Published",
  date: "Date",
  summary: "Summary",
  tags: "Tags",
} as const;

const token = process.env.NOTION_TOKEN;
const databaseId = process.env.NOTION_DATABASE_ID;

export function isNotionConfigured(): boolean {
  return Boolean(token && databaseId);
}

let notionClient: Client | null = null;
let n2mClient: NotionToMarkdown | null = null;

function getClients() {
  if (!notionClient) {
    notionClient = new Client({ auth: token });
    n2mClient = new NotionToMarkdown({ notionClient });
  }
  return { notion: notionClient, n2m: n2mClient! };
}

/* eslint-disable @typescript-eslint/no-explicit-any */

function readTitle(prop: any): string {
  return prop?.title?.map((t: any) => t.plain_text).join("") ?? "";
}

function readRichText(prop: any): string {
  return prop?.rich_text?.map((t: any) => t.plain_text).join("") ?? "";
}

function readDate(prop: any): string {
  return prop?.date?.start ?? "";
}

function readTags(prop: any): string[] {
  return prop?.multi_select?.map((t: any) => t.name) ?? [];
}

function pageToMeta(page: any): PostMeta {
  const props = page.properties ?? {};
  const title = readTitle(props[PROP.title]);
  const slug = readRichText(props[PROP.slug]) || slugify(title);
  return {
    slug,
    title,
    date: readDate(props[PROP.date]) || page.created_time,
    summary: readRichText(props[PROP.summary]),
    tags: readTags(props[PROP.tags]),
  };
}

async function queryPublishedPages(extraFilter?: any): Promise<any[]> {
  const { notion } = getClients();
  const results: any[] = [];
  let cursor: string | undefined = undefined;

  do {
    const response: any = await notion.databases.query({
      database_id: databaseId!,
      start_cursor: cursor,
      filter: {
        and: [
          { property: PROP.published, checkbox: { equals: true } },
          ...(extraFilter ? [extraFilter] : []),
        ],
      },
      sorts: [{ property: PROP.date, direction: "descending" }],
    });
    results.push(...response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  return results;
}

export async function getNotionPosts(): Promise<PostMeta[]> {
  const pages = await queryPublishedPages();
  return pages.map(pageToMeta);
}

export async function getNotionPostBySlug(slug: string): Promise<Post | null> {
  const pages = await queryPublishedPages({
    property: PROP.slug,
    rich_text: { equals: slug },
  });

  // Fall back to matching a title-derived slug if no explicit Slug column value.
  let page = pages[0];
  if (!page) {
    const all = await queryPublishedPages();
    page = all.find((p) => pageToMeta(p).slug === slug);
  }
  if (!page) return null;

  const meta = pageToMeta(page);
  const { n2m } = getClients();
  const mdBlocks = await n2m.pageToMarkdown(page.id);
  const markdown = n2m.toMarkdownString(mdBlocks).parent ?? "";

  return { ...meta, markdown };
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
