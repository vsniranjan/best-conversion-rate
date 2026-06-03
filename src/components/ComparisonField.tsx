import ComparisonCard from "./ComparisonCard";

const variants = ["best", "default", "default", "default", "worst"] as const;

const ComparisonField = () => {
  return (
    <>
      <p className='text-muted text-sm mt-14 mb-8 pl-2'>Comparison Results</p>

      <div className='flex gap-4'>
        {variants.map((variant, i) => (
          <ComparisonCard key={i} variant={variant} />
        ))}
      </div>
    </>
  );
};

export default ComparisonField;
