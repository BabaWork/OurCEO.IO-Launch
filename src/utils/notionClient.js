import { Client } from '@notionhq/client';

export const notion = new Client({
  auth: process.env.VITE_NOTION_SECRET,
});

export const databaseId = process.env.VITE_NOTION_DATABASE_ID;
