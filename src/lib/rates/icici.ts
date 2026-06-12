import { load } from "cheerio";

export async function fetchICICIRates() {
  const res = await fetch(
    "https://www.icici.bank.in/corporate/global-markets/forex/forex-card-rate",
  );

  if (!res.ok) throw new Error(`Failed to fetch ICICI rates: ${res.status}`);

  const $ = load(await res.text());

  let ttBuyRate: string | null = null;

  $(".exchange-rate-table tbody tr").each((_, row) => {
    const currency = $(row).find("td").first().text().trim();
    if (currency.includes("United States Dollar")) {
      ttBuyRate = $(row).find("td").eq(1).text().trim();
    }
  });

  if (!ttBuyRate) throw new Error("USD TT Buy rate not found");

  return parseFloat(ttBuyRate);
}
