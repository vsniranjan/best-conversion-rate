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

type Variant = "best" | "default" | "worst";

export async function compareAllRates(amtUSD: number) {
  const [idfcRate, iobRate, mulyaRate, skydoRate, infinityAppRate, marketRate] =
    await Promise.all([
      getIDFCRate(),
      fetchIOBRates(),
      fetchMulyaRate(),
      fetchSkydoRate(),
      fetchInfinityAppRates(),
      getMarketRate(),
    ]);

  const skydo = calcSkydo(amtUSD, skydoRate.fx_rate);
  const mulya = calcMulya(amtUSD, mulyaRate.fx_rate);
  const infinityApp = calcInfinityApp(amtUSD, infinityAppRate.fx_rate);

  // iob and idfc needs the current mid market rate to get effective usd
  // hence we need to pass a mid market rate, it can rate from skydo/mulya/infinity app
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
