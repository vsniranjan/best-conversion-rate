type InfinityRateResponse = {
  base: "INR";
  timeStamp: number;
  rates: {
    USD: number;
    EUR: number;
    CAD: number;
    GBP: number;
    AUD: number;
    SGD: number;
    NZD: number;
    JPY: number;
    KWD: number;
    AED: number;
  };
};

export async function fetchInfinityAppRates() {
  const res = await fetch(
    "https://7udrjxdbzajtpwodsnnnagxqom0ckvmv.lambda-url.ap-south-1.on.aws/",
    {
      headers: {
        Referer: "https://tools.infinityapp.in",
        Origin: "https://tools.infinityapp.in",
      },
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch Infinity App rates! ${res.status}`);
  }

  const data: InfinityRateResponse = await res.json();

  const fx_rate = 1 / data.rates.USD;
  const api_timestamp = new Date(data.timeStamp * 1000).toISOString();

  return { fx_rate, api_timestamp };
}
