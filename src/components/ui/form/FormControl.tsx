import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import { useFormField } from '.';

type FormControlElement = React.ElementRef<typeof Slot>;
type FormControlProps = React.ComponentPropsWithoutRef<typeof Slot>;

const FormControl = forwardRef<FormControlElement, FormControlProps>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  );
});

FormControl.displayName = 'FormControl';

export { FormControl };
