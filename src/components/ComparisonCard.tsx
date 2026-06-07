import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Variant = "best" | "default" | "worst";
type cardProps =
  | {
      name: string;
      receivingAmtINR: number;
      totalFee: number;
      effectiveRate: number;
      type: Variant;
      status: "ok";
    }
  | {
      name: string;
      status: "error";
    };

const ComparisonCard = ({ data }: { data: cardProps }) => {
  const bgColor = {
    best: "bg-brand-green/30",
    default: "bg-white",
    worst: "bg-brand-red/15",
  };

  const amtColor = {
    best: "text-brand-green",
    default: "text-primary",
    worst: "text-brand-red",
  };

  const ringColor = {
    best: "ring-brand-green",
    default: "ring-primary/50",
    worst: "ring-brand-red",
  };

  if (data.status === "error")
    return (
      <Card className='w-full sm:flex-1 min-w-0 bg-muted/30 ring-muted'>
        <CardHeader>
          <h3 className='text-center text-primary text-base font-semibold'>
            {data.name}
          </h3>
        </CardHeader>
        <Separator className='bg-black mx-6 w-auto!' />
        <CardContent className='flex-1 text-center space-y-4 flex flex-col items-center justify-center py-6'>
          <i className='ti ti-wifi-off text-muted-foreground text-2xl' />
          <p className='text-muted-foreground text-sm'>Unavailable</p>
        </CardContent>
      </Card>
    );
  const formatedReceivingAmt = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(data.receivingAmtINR);

  const formatedTotalFee = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(data.totalFee);

  return (
    <Card
      className={`w-full sm:flex-1 min-w-0 ${bgColor[data.type]} ${ringColor[data.type]}`}
    >
      <CardHeader>
        <h3 className='text-center text-primary text-base font-semibold'>
          {data.name}
        </h3>
      </CardHeader>

      <Separator className='bg-black mx-6 w-auto!' />

      <CardContent className='flex-1 text-center space-y-4'>
        <section>
          <p className='text-primary text-[8px] tracking-widest'>YOU RECEIVE</p>
          <p className={`text-2xl font-semibold ${amtColor[data.type]}`}>
            {`₹ ${formatedReceivingAmt}`}
          </p>
        </section>

        <section>
          <p className='text-primary text-[8px] tracking-widest'>CHARGES</p>
          <p className='text-brand-red text-sm tracking-widest '>{`₹${formatedTotalFee}`}</p>
        </section>

        <section>
          <p className='text-muted text-[8px] tracking-widest'>
            EFFECTIVE RATE
          </p>
          <p className='text-muted text-[10px] tracking-widest '>
            {`₹${data.effectiveRate} / USD`}
          </p>
        </section>
      </CardContent>
    </Card>
  );
};

export default ComparisonCard;
