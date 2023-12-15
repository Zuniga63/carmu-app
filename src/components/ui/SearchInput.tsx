import { forwardRef } from 'react';
import { Input, InputProps } from './Input';
import { cn } from '@/lib/utils';
import { IconLoader2, IconSearch } from '@tabler/icons-react';

type Props = InputProps & {
  isLoading?: boolean;
};

const SearchInput = forwardRef<HTMLInputElement, Props>(
  ({ className, isLoading, type = 'search', role = 'search', ...props }, ref) => {
    return (
      <div className={cn('relative', className)}>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          {isLoading ? (
            <IconLoader2 className="animate-spin" size={14} stroke={1.5} />
          ) : (
            <IconSearch size={14} stroke={1.5} />
          )}
        </div>
        <Input ref={ref} {...props} className="pl-10" type={type} role={role} />
      </div>
    );
  },
);

SearchInput.displayName = 'SearchInput';

export default SearchInput;
