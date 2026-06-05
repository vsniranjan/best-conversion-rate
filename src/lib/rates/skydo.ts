type SkydoRate = {
  fx_rate: number;
  api_timestamp: string;
  base: string;
  target: string;
};

type SkydoRateList = SkydoRate[];

export async function fetchSkydoRate() {
  const res = await fetch("https://www.skydo.com/api/fxratelist");

  if (!res.ok) {
    throw new Error(`Failed to fetch Skydo rate! ${res.status}`);
  }

  const data: SkydoRateList = await res.json();

  const rateINR = data.find((x) => x.base === "USD" && x.target === "INR");

  if (!rateINR) {
    throw new Error("INR rate not found!");
  }

  const { fx_rate, api_timestamp } = rateINR;
  return { fx_rate, api_timestamp };
}
