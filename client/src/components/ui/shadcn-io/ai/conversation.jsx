'use client';;
import { Button } from '@repo/shadcn-ui/components/ui/button';
import { ArrowDownIcon } from 'lucide-react';
import { useCallback } from 'react';
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom';
import { cn } from '@/lib/utils';

export const AIConversation = ({
  className,
  ...props
}) => (
  <StickToBottom
    className={cn('relative flex-1 overflow-y-auto', className)}
    initial="smooth"
    resize="smooth"
    role="log"
    {...props} />
);

export const AIConversationContent = ({
  className,
  ...props
}) => (
  <StickToBottom.Content className={cn('p-4', className)} {...props} />
);

export const AIConversationScrollButton = () => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  const handleScrollToBottom = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  return (!isAtBottom && (<Button
    className="absolute bottom-4 left-[50%] translate-x-[-50%] rounded-full"
    onClick={handleScrollToBottom}
    size="icon"
    type="button"
    variant="outline">
    <ArrowDownIcon className="size-4" />
  </Button>));
};
