import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  showSubtitle?: boolean;
  className?: string;
}

export const Logo = ({
  size = "md",
  showText = false,
  showSubtitle = false,
  className,
}: LogoProps) => {
  const sizeClasses = {
    sm: {
      icon: "size-4",
      box: "size-8",
      text: "text-sm",
      subtitle: "text-[9px]",
    },
    md: {
      icon: "size-5",
      box: "size-9",
      text: "text-base",
      subtitle: "text-[10px]",
    },
    lg: {
      icon: "size-6",
      box: "size-11",
      text: "text-lg",
      subtitle: "text-xs",
    },
  }[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-full",
          "bg-linear-to-br from-primary to-primary/80",
          "text-primary-foreground shadow-sm transition-all duration-200",
          "hover:shadow-md",
          sizeClasses.box,
        )}
      >
        <Image
          src="/og-image.png"
          alt="App Icon"
          width={100}
          height={100}
          className={cn(
            "w-full h-full object-cover rounded-md transition-all duration-200",
          )}
        />{" "}
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={cn(
              "font-bold tracking-tight text-primary",
              sizeClasses.text,
            )}
          >
            ZendraPdf
          </span>
          {showSubtitle && (
            <span
              className={cn(
                "text-muted-foreground font-medium",
                sizeClasses.subtitle,
              )}
            >
              AI PDF Assistant
            </span>
          )}
        </div>
      )}
    </div>
  );
};
