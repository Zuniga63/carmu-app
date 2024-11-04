import { forwardRef } from 'react';
import { cn } from '@/utils';
import { useFormField } from '.';

type FormDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

const FormDescription = forwardRef<HTMLParagraphElement, FormDescriptionProps>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p ref={ref} id={formDescriptionId} className={cn('text-[0.8rem] text-muted-foreground', className)} {...props} />
  );
});
FormDescription.displayName = 'FormDescription';

export { FormDescription };
