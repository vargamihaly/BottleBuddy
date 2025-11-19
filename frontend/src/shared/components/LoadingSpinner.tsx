import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const LoadingSpinner = ({ size = 'md', className, text }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <Loader2 className={cn('animate-spin text-green-600', sizeClasses[size])} />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );
};

export const FullPageLoader = ({ text = 'Loading...' }: { text?: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
    <LoadingSpinner size="lg" text={text} />
  </div>
);
