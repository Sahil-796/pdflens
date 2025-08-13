'use client';;
import { BookIcon, ChevronDownIcon } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

export const AISources = ({
  className,
  ...props
}) => (
  <Collapsible
    className={cn('not-prose mb-4 text-primary text-xs', className)}
    {...props} />
);

export const AISourcesTrigger = ({
  className,
  count,
  children,
  ...props
}) => (
  <CollapsibleTrigger className="flex items-center gap-2" {...props}>
    {children ?? (
      <>
        <p className="font-medium">Used {count} sources</p>
        <ChevronDownIcon className="h-4 w-4" />
      </>
    )}
  </CollapsibleTrigger>
);

export const AISourcesContent = ({
  className,
  ...props
}) => (
  <CollapsibleContent className={cn('mt-3 flex flex-col gap-2', className)} {...props} />
);

export const AISource = ({
  href,
  title,
  children,
  ...props
}) => (
  <a
    className="flex items-center gap-2"
    href={href}
    rel="noreferrer"
    target="_blank"
    {...props}>
    {children ?? (
      <>
        <BookIcon className="h-4 w-4" />
        <span className="block font-medium">{title}</span>
      </>
    )}
  </a>
);
