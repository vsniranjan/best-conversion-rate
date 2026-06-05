type ApiResponse = {
  date: string;
  base: string;
  quote: string;
  rate: number;
};

export async function getMarketRate() {
  const res = await fetch(
    "https://api.frankfurter.dev/v2/rates?base=USD&quotes=INR",
  );

  if (!res.ok) throw new Error(`Failed to fetch rates : ${res.status}`);

  const data: ApiResponse[] = await res.json();

  return data[0];
}
