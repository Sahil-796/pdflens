"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { CommandPaletteProvider } from "./CommandPaletteProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <CommandPaletteProvider>
          {children}
          <Toaster position="top-center" richColors />
        </CommandPaletteProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
