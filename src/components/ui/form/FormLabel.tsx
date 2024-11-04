import { forwardRef } from 'react';
import { Root } from '@radix-ui/react-label';
import { useFormField } from '.';
import { Label } from '../Label';
import { cn } from '@/utils';

type FormLabelType = React.ElementRef<typeof Root>;
type FormLabelProps = React.ComponentPropsWithoutRef<typeof Root> & {
  isRequired?: boolean;
};

const FormLabel = forwardRef<FormLabelType, FormLabelProps>(({ className, isRequired = false, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(error && 'text-destructive', className)}
      isRequired={isRequired}
      htmlFor={formItemId}
      {...props}
    />
  );
});

FormLabel.displayName = 'FormLabel';

export { FormLabel };
