import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Variant = "best" | "default" | "worst";

const ComparisonCard = ({ variant = "best" }: { variant: Variant }) => {
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

  return (
    <>
      <Card
        className={`w-full sm:flex-1 min-w-0 ${bgColor[variant]} ${ringColor[variant]}`}
      >
        <CardHeader>
          <CardTitle className='text-center text-primary'>Skydo</CardTitle>
        </CardHeader>

        <Separator className='bg-black mx-6 w-auto!' />

        <CardContent className='flex-1 text-center space-y-4'>
          <section>
            <p className='text-primary text-[8px] tracking-widest'>
              YOU RECEIVE
            </p>
            <p className={`text-2xl font-semibold ${amtColor[variant]}`}>
              ₹79,249
            </p>
          </section>

          <section>
            <p className='text-primary text-[8px] tracking-widest'>CHARGES</p>
            <p className='text-brand-red text-sm tracking-widest '>₹4,171</p>
          </section>

          <section>
            <p className='text-muted text-[8px] tracking-widest'>
              EFFECTIVE RATE
            </p>
            <p className='text-muted text-[10px] tracking-widest '>
              ₹79.25 / USD
            </p>
          </section>
        </CardContent>
      </Card>
    </>
  );
};

export default ComparisonCard;
