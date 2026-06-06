import { unstable_cache } from "next/cache";

import { getIDFCRate } from "./rates/idfc";
import { getMarketRate } from "./rates/market";
import { fetchIOBRates } from "./rates/iob";
import { fetchMulyaRate } from "./rates/mulya";
import { fetchSkydoRate } from "./rates/skydo";
import { fetchInfinityAppRates } from "./rates/infinityApp";

import {
  calcIDFC,
  calcIOB,
  calcSkydo,
  calcMulya,
  calcInfinityApp,
} from "./calculation";

const fetchAllRates = unstable_cache(
  async () => {
    return Promise.all([
      getIDFCRate(),
      fetchIOBRates(),
      fetchMulyaRate(),
      fetchSkydoRate(),
      fetchInfinityAppRates(),
      getMarketRate(),
    ]);
  },
  ["all-forex-rates"],
  { revalidate: 300 },
);

type Variant = "best" | "default" | "worst";

export async function compareAllRates(amtUSD: number) {
  const [idfcRate, iobRate, mulyaRate, skydoRate, infinityAppRate, marketRate] =
    await fetchAllRates();

  const skydo = calcSkydo(amtUSD, skydoRate.fx_rate);
  const mulya = calcMulya(amtUSD, mulyaRate.fx_rate);
  const infinityApp = calcInfinityApp(amtUSD, infinityAppRate.fx_rate);

  const iob = calcIOB(amtUSD, marketRate.rate, iobRate);
  const idfc = calcIDFC(amtUSD, marketRate.rate, idfcRate);

  const data = [
    { ...skydo, name: "Skydo" },
    { ...mulya, name: "Mulya" },
    { ...infinityApp, name: "InfinityApp" },
    { ...iob, name: "IOB" },
    { ...idfc, name: "IDFC" },
  ];
  const sortedData = data
    .sort((a, b) => b.effectiveRate - a.effectiveRate)
    .map((item, index, arr) => ({
      ...item,
      type: (index === arr.length - 1
        ? "worst"
        : index === 0
          ? "best"
          : "default") as Variant,
    }));

  return { data: sortedData, marketRate };
}
