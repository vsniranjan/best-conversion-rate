import WorkingCard from "./WorkingCard";

const WorkingField = () => {
  return (
    <>
      <p className='text-muted text-sm mt-14 mb-4 pl-2'>How it works</p>

      <div className='flex flex-col gap-4 md:flex-row'>
        <WorkingCard
          cardNo='01'
          cardShortDesc='Enter USD amount'
          cardLongDesc="Type in the amount you're expecting to receive from your client"
        />
        <WorkingCard
          cardNo='02'
          cardShortDesc='We fetch live rates'
          cardLongDesc='Mid-market rate from XE + scraped bank forex rates, updated every 30 mins.'
        />
        <WorkingCard
          cardNo='03'
          cardShortDesc='See the best option'
          cardLongDesc='All charges calculated. Best platform highlighted. No math needed.'
        />
      </div>
    </>
  );
};

export default WorkingField;
