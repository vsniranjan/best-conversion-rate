import ComparisonCard from "./ComparisonCard";

import { compareAllRates } from "@/lib/compare";

type Props = {
  amtUSD: number;
};

const ComparisonField = async ({ amtUSD }: Props) => {
  const content = await compareAllRates(amtUSD);

  return (
    <>
      <p className='text-muted text-sm mt-14 mb-2 pl-2'>Comparison Results</p>
      <p className='text-xs text-gray-500 pl-2 mb-4'>
        {`Mid-market rate: ₹${content.marketRate.rate} / USD | Last updated ${content.marketRate.date}`}
      </p>

      <div className='flex flex-wrap gap-4'>
        {content.data.map((dataPoint) => (
          <ComparisonCard key={dataPoint.name} data={dataPoint} />
        ))}
      </div>
    </>
  );
};

export default ComparisonField;
