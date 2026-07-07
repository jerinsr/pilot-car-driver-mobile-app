import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from './ui/utils';

interface OutlineButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

const OutlineButton = forwardRef<HTMLButtonElement, OutlineButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "bg-white relative rounded-lg flex items-center justify-center",
          "border border-[#d1d5db] hover:bg-gray-50 transition-colors",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

OutlineButton.displayName = 'OutlineButton';

export default OutlineButton;