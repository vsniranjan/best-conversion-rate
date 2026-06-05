import { load } from "cheerio";

export type IOBRate = {
  unit: string;
  currency: string;
  ttBuy: string;
  ttSell: string;
  billBuy: string;
  billSell: string;
};

export async function fetchIOBRates() {
  const res = await fetch("https://www.iob.bank.in/en/forex-rates");

  if (!res.ok) throw new Error(`Failed to fetch IOB rates: ${res.status}`);

  const $ = load(await res.text());
  const rates: IOBRate[] = [];

  $(".iob-table tbody tr").each((_, row) => {
    const cols = $(row).find("td");
    rates.push({
      unit: $(cols[0]).text().trim(),
      currency: $(cols[1]).text().trim(),
      ttBuy: $(cols[2]).text().trim(),
      ttSell: $(cols[3]).text().trim(),
      billBuy: $(cols[4]).text().trim(),
      billSell: $(cols[5]).text().trim(),
    });
  });

  const USDRate = rates.find((x) => x.currency === "USD");

  if (!USDRate) {
    throw new Error("USD Rate not found");
  }
  const ttBuyRate = USDRate.ttBuy;

  return parseFloat(ttBuyRate);
}
