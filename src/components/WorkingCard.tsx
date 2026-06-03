import { Card, CardContent } from "@/components/ui/card";

type Props = {
  cardNo: string;
  cardShortDesc: string;
  cardLongDesc: string;
};

const WorkingCard = ({ cardNo, cardShortDesc, cardLongDesc }: Props) => {
  return (
    <Card className='flex-1 bg-[#F0F4FF]'>
      <CardContent className=' space-y-1'>
        <p className='text-6xl'>{cardNo}</p>
        <p className='text-sm text-primary font-semibold'>{cardShortDesc}</p>
        <p className='text-xs text-muted'>{cardLongDesc}</p>
      </CardContent>
    </Card>
  );
};

export default WorkingCard;
