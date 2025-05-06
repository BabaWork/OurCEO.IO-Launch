import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.VITE_NOTION_SECRET });
const databaseId = process.env.VITE_NOTION_DATABASE_ID;

export default async function handler(req, res) {
  const today = new Date().toISOString().split("T")[0];

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "Date",
        date: { equals: today },
      },
    });

    const entry = response.results[0];
    if (!entry) return res.status(404).json({ error: "No scenario today" });

    const getText = (prop) => entry.properties[prop]?.rich_text?.[0]?.plain_text || "";
    const getUrl = (prop) => entry.properties[prop]?.url || "";

    const data = {
      prompt: getText("Scenario"),
      options: [1, 2, 3, 4].map((i) => ({
        text: getText(`Choice ${i}`),
        effect: getText(`Effect ${i}`),
        image: getUrl(`Image ${i}`),
        feedback: getText(`Feedback ${i}`),
      })),
      ad: getUrl("Fake Ad Link"),
      thankYou: getText("Thank You"),
      guiltTrip: getText("Guilt Trip"),
      charity: getText("Charity"),
      charityLink: getUrl("Charity Link"),
    };

    res.status(200).json(data);
  } catch (err) {
    console.error("❌ Scenario API Error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
