import { Suspense } from "react";
import { AmountInput } from "@/components/AmountInput";
import ComparisonField from "@/components/ComparisonField";
import WorkingField from "@/components/WorkingField";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ amt: string }>;
}) {
  const { amt } = await searchParams;
  const amtUSD = parseFloat(amt ?? "1000");
  return (
    <>
      <h1 className='text-6xl font-bold text-primary leading-15'>
        Stop loosing money on
        <br />
        international transfers.
      </h1>
      <p className='mt-4 text-muted'>
        Compare forex charges across Skydo, Mulya, Infinity App, IDFC First
        Bank, and IOB.
      </p>

      <AmountInput />
      <Suspense
        key={amtUSD}
        fallback={
          <p className='text-muted text-sm mt-14 mb-8 pl-2 animate-pulse'>
            Fetching latest rates…
          </p>
        }
      >
        <ComparisonField amtUSD={amtUSD} />
      </Suspense>
      <WorkingField />
    </>
  );
}
