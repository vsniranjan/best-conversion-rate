import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export function AmountInput() {
  return (
    <Field className='mt-16'>
      <FieldLabel htmlFor='amount-usd' className='text-sm text-gray-500'>
        Enter the amount you're receiving
      </FieldLabel>

      <div className='flex items-center gap-4'>
        <InputGroup className='max-w-96 h-14 border-blue-800 bg-white has-[[data-slot=input-group-control]:focus-visible]:border-blue-600 has-[[data-slot=input-group-control]:focus-visible]:ring-blue-600/30'>
          <InputGroupInput
            id='amount-usd'
            type='number'
            min={0}
            className='text-primary font-medium text-2xl!'
          />

          <InputGroupAddon className='gap-3 text-primary ml-2'>
            <span className='text-xs font-medium'>USD</span>
            <div className='h-6 w-px bg-primary' />
          </InputGroupAddon>
        </InputGroup>

        <span className='text-xs text-gray-500'>
          Mid-market rate: ₹83.42 / USD
        </span>
      </div>
    </Field>
  );
}
