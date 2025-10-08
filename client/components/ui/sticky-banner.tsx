"use client";
import React, { SVGProps, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import useUser from "@/hooks/useUser";

export const StickyBanner = ({
  className,
  children,
  hideOnScroll = false,
}: {
  className?: string;
  children: React.ReactNode;
  hideOnScroll?: boolean;
}) => {
  const [open, setOpen] = useState(true);
  const { scrollY } = useScroll();
  const {isAuthenticated} = useUser()

  useMotionValueEvent(scrollY, "change", (latest) => {
    console.log(latest);
    if (hideOnScroll && latest > 40) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  });

  if(isAuthenticated) return null;

  return (
    <motion.div
      className={cn(
        "sticky inset-x-0 top-0 z-40 flex w-full items-center justify-center bg-primary text-primary-foreground px-4",
        `${open ? "h-10": "h-0"}`,
        className,
      )}
      initial={{
        y: -100,
        opacity: 0,
      }}
      animate={{
        y: open ? 0 : -100,
        opacity: open ? 1 : 0,
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
    >
      {children}

      <motion.button
        initial={{
          scale: 0,
        }}
        animate={{
          scale: 1,
        }}
        className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <X className="size-5" />
      </motion.button>
    </motion.div>
  );
};

const CloseIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </svg>
  );
};

export default StickyBanner;