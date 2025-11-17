import { CreditCardIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CallToAction() {
  return (
    <div className="relative mx-auto flex w-full max-w-3xl flex-col justify-between gap-y-6 rounded-4xl border bg-card px-4 py-8 shadow-sm md:py-10 dark:bg-card/50">
      <div className="space-y-2">
        <h2 className="text-center font-semibold text-lg tracking-tight md:text-2xl">
          Ready to Create Your First Professional PDF?
        </h2>
        <p className="text-balance text-center text-muted-foreground text-sm md:text-base">
          No credit card{" "}
          <CreditCardIcon className="inline-block size-4" />  required. 20 free credits daily.
        </p>
      </div>
      <div className="flex items-center justify-center gap-2">
        <Link href='/signup'>
          <Button className="shadow cursor-pointer" variant="secondary">
            Start Creating Free
          </Button>
        </Link>
        <Link href='/pricing'>
          <Button className="shadow cursor-pointer">
            View Pricing
          </Button>
        </Link>
      </div>
    </div>
  );
}
