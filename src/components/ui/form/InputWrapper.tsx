import { FormItem } from './FormItem';
import { FormLabel } from './FormLabel';
import { FormControl } from './FormControl';
import { FormDescription } from './FormDescription';
import { FormMessage } from './FormMessage';

type Props = {
  label?: string;
  description?: string;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  className?: string;
  isRequired?: boolean;
  children?: React.ReactNode;
};

export default function InputWrapper({
  label,
  description,
  leftSection,
  rightSection,
  className,
  isRequired,
  children,
}: Props) {
  return (
    <FormItem className={className}>
      {label && <FormLabel isRequired={isRequired}>{label}</FormLabel>}

      <div className="relative">
        {leftSection && <span className="absolute inset-y-0 left-2 flex w-10 items-center">{leftSection}</span>}

        <FormControl>{children}</FormControl>

        {rightSection && <span className="absolute inset-y-0 right-2 flex w-10 items-center">{rightSection}</span>}
      </div>

      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}
