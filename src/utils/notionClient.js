import { Client } from '@notionhq/client';

export const notion = new Client({
  auth: import.meta.env.VITE_NOTION_SECRET,
});

export const databaseId = import.meta.env.VITE_NOTION_DATABASE_ID;
