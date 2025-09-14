"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import ThemeStyle from "@/components/ThemeStyle";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";

export default function CurrentUser() {

  return (
    <>
      {/* <SignedIn>
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent transition">
                <img
                  src={user.imageUrl}
                  alt="User Avatar"
                  className="h-8 w-8 rounded-full border border-border"
                />
                <span className="font-medium">{user.firstName}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={6} className="w-56">
              <DropdownMenuLabel>
                <span className="text-sm text-muted-foreground truncate">
                  {user.primaryEmailAddress?.emailAddress}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <div className="flex items-center gap-2 px-2 py-1.5">
                  <span>Style: </span>
                  <ThemeStyle />
                </div>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />
              <div className="px-2 py-1.5">
                <SignOutButton>
                  <Button variant="destructive" size="sm" className="w-full">
                    Logout
                  </Button>
                </SignOutButton>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SignedIn>

      <SignedOut>
        <SignInButton mode="modal">
          <Button variant="default" size="sm">
            Sign In
          </Button>
        </SignInButton>
      </SignedOut> */}
    </>
  );
}