import { forwardRef, useId } from 'react';
import { cn } from '@/utils';
import { FormItemContext } from './contexts';

type FormItemProps = React.HTMLAttributes<HTMLDivElement>;

const FormItem = forwardRef<HTMLDivElement, FormItemProps>(({ className, ...props }, ref) => {
  const id = useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn('space-y-2', className)} {...props} />
    </FormItemContext.Provider>
  );
});

FormItem.displayName = 'FormItem';

export { FormItem };
