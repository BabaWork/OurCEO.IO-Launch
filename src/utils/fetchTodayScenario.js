// src/utils/fetchTodayScenario.js
// ---------------------------------------------------------------
//  Helpers for talking to Notion:   • get today's scenario
//                                   • record a vote
// ---------------------------------------------------------------

import { notion } from "./notionClient.js";

/**
 * ⚙️  If you renamed / split your Notion DBs just
 *     update the IDs here and you’re good.
 */
export const databaseId = {
  scenarios: process.env.NOTION_SCENARIO_DB, // daily content
  votes:     process.env.NOTION_VOTE_DB      // per-day vote record
};

/* ----------------------------------------------------------------
   Fetch today's scenario
   ---------------------------------------------------------------- */
export async function fetchTodayScenario(date = new Date()) {
  const iso = date.toISOString().slice(0, 10); // YYYY-MM-DD

  const { results } = await notion.databases.query({
    database_id: databaseId.scenarios,
    filter: {
      property: "Date",
      date: { equals: iso }
    },
    sorts: [{ property: "Date", direction: "ascending" }],
    page_size: 1
  });

  if (!results.length) return null;

  const page = results[0];

  /** Helper to pull plain-text / files comfortably */
  const getText = prop =>
    page.properties[prop]?.rich_text?.[0]?.plain_text ?? "";

  const getLink = prop =>
    page.properties[prop]?.url ?? "";

  const scenario = {
    body:        getText("Body"),
    choices: [
      {
        text:     getText("Choice 1"),
        effect:   getText("Effect 1"),
        image:    getLink("Image 1")
      },
      {
        text:     getText("Choice 2"),
        effect:   getText("Effect 2"),
        image:    getLink("Image 2")
      },
      {
        text:     getText("Choice 3"),
        effect:   getText("Effect 3"),
        image:    getLink("Image 3")
      },
      {
        text:     getText("Choice 4"),
        effect:   getText("Effect 4"),
        image:    getLink("Image 4")
      }
    ],
    ad:          getLink("Fake Ad Link"),
    thankYou:    getText("Thank You"),
    guiltTrip:   getText("Guilt Trip"),
    charity:     getText("Charity"),
    charityLink: getLink("Charity Link")
  };

  return scenario;
}

/* ----------------------------------------------------------------
   Submit a vote
   ----------------------------------------------------------------
   – `optionIndex` is 0-based (0..3) for Choice 1-4
   – We create a row in the Votes DB with a number in the proper column
   ---------------------------------------------------------------- */
export async function submitVote(optionIndex, date = new Date()) {
  if (optionIndex < 0 || optionIndex > 3)
    throw new Error("optionIndex must be 0–3");

  const iso = date.toISOString().slice(0, 10); // YYYY-MM-DD
  const columnName = `Vote-${optionIndex + 1}`;

  const props = {
    Date: { date: { start: iso } },
    [columnName]: { number: 1 }
  };

  return notion.pages.create({
    parent: { database_id: databaseId.votes },
    properties: props
  });
}
