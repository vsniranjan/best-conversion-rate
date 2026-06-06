import ComparisonCard from "./ComparisonCard";

import { compareAllRates } from "@/lib/compare";

type Props = {
  amtUSD: number;
};

const ComparisonField = async ({ amtUSD }: Props) => {
  const content = await compareAllRates(amtUSD);

  return (
    <>
      <h2 className='text-muted text-sm mt-14 mb-2 pl-2'>Comparison Results</h2>
      <p className='text-xs text-gray-500 pl-2 mb-4'>
        {`Mid-market rate: ₹${content.marketRate.rate} / USD | Last updated ${content.marketRate.date}`}
      </p>

      <div className='flex flex-wrap gap-4' role="list" aria-label="Platform comparison cards">
        {content.data.map((dataPoint) => (
          <ComparisonCard key={dataPoint.name} data={dataPoint} />
        ))}
      </div>
    </>
  );
};

export default ComparisonField;
