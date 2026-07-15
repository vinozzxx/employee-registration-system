import { cn } from '@/utils/index';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-slate-100/10 bg-slate-100', className)}
      {...props}
    />
  );
}

export { Skeleton };
