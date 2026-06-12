import { load } from "cheerio";

export async function fetchAxisRates() {
  const res = await fetch(
    "https://application.axis.bank.in/WebForms/corporatecardrate/index.aspx",
  );

  if (!res.ok) throw new Error(`Failed to fetch rates: ${res.status}`);

  const html = await res.text();
  const $ = load(html);

  console.log("dataRow count:", $("tr.dataRow").length);
  console.log("first row html:", $("tr.dataRow").first().html()?.slice(0, 200));
  let ttBuyRate: string | null = null;

  $("tr.dataRow").each((_, row) => {
    const label = $(row).find("th").first().text().trim();
    if (label === "US Dollar") {
      ttBuyRate = $(row).find("td td").eq(1).text().trim();
    }
  });

  if (!ttBuyRate) throw new Error("USD TT Buy rate not found");

  return parseFloat(ttBuyRate);
}
