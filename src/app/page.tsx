import { Suspense } from "react";
import { AmountInput } from "@/components/AmountInput";
import ComparisonField from "@/components/ComparisonField";
import WorkingField from "@/components/WorkingField";
import Feedback from "@/components/Feedback";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ amt?: string }>;
}) {
  const { amt } = await searchParams;

  const parsedAmt = Number(amt);

  const amtParam =
    typeof amt === "string" && Number.isFinite(parsedAmt) && parsedAmt > 0
      ? amt
      : "1000";

  const amtUSD = Number(amtParam);
  return (
    <>
      <header>
        <h1 className='text-6xl font-bold text-primary leading-15'>
          Stop losing money on
          <br />
          international transfers.
        </h1>
        <p className='mt-4 text-muted'>
          Compare forex charges across Skydo, Mulya, Infinity App, IDFC First
          Bank, and IOB.
        </p>
      </header>

      <AmountInput amtParam={amtParam} />

      <section aria-label='Forex rate comparison results'>
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
      </section>

      <section aria-label='How Rate Radar works'>
        <WorkingField />
      </section>

      <footer className='mt-20 border-t border-gray-200/80'>
        <Feedback />
        <div className='py-8 px-2 text-center space-y-4'>
          {/* Brand line */}
          <p className='text-sm text-primary font-semibold tracking-tight'>
            Rate Radar
          </p>

          {/* Tagline */}
          <p className='text-xs text-muted max-w-md mx-auto leading-relaxed'>
            Free, open-source USD → INR comparison tool.
            <span className='mx-1.5 text-gray-300'>·</span>
            Compare forex charges across Skydo, Mulya, Infinity App, IDFC First
            Bank, and IOB — find the best effective rate after all fees,
            markups, and GST.
          </p>

          {/* Disclaimer */}
          <p className='text-[11px] text-gray-400 max-w-sm mx-auto leading-relaxed'>
            Rates are for informational purposes only. Always verify with the
            provider before making financial decisions.
          </p>
        </div>
      </footer>
    </>
  );
}
