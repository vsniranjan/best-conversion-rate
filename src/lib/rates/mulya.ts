type MulyaRateResponse = {
  message: string;
  details: {
    rate: number;
  };
};

export async function fetchMulyaRate() {
  const res = await fetch("https://app.mulya.co/api/site/liveRate/USDINR", {
    headers: {
      Referer: "https://app.mulya.co",
      Origin: "https://app.mulya.co",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch Mulya rates! ${res.status}`);
  }

  const data: MulyaRateResponse = await res.json();

  const fx_rate = data.details.rate;

  return { fx_rate, api_timestamp: new Date().toISOString() };
}
