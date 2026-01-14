"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { IconLogout, IconUser } from "@tabler/icons-react";
import { Suspense } from "react";
import { toast } from "sonner";
import { useAuth } from "@/provider/auth";
import { useNavigate } from "@tanstack/react-router";
import { authClient } from "@/lib/auth";
import { UserAvatar } from "@/components/shared/avatar";

function UserNavDropdownContent() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("Successfully logged out.");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  if (!user) {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="relative h-10 w-10 cursor-pointer overflow-hidden rounded-full border-0 p-0"
          variant="outline"
        >
          <UserAvatar
            displayValue={user.name}
            name={user.name}
            radius={100}
            size={40}
            style="shape"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="mt-1 mr-1 w-60 bg-white pb-2"
        sideOffset={10}
      >
        <DropdownMenuLabel className="font-satoshi-regular">
          <div className="flex flex-col gap-1">
            <p className="py-0.5 font-semibold text-secondary-foreground text-sm uppercase leading-none">
              {user.name}
            </p>
            <p className="py-0.5 font-normal text-[13px] text-muted-foreground leading-none">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="space-y-1 my-1">
          <DropdownMenuItem
            className="group h-11 cursor-pointer text-sm"
            onClick={() => navigate({ to: "/(dashboard)/account" })}
          >
            <Button className="bg-accent group-hover:bg-white" size="icon-sm" variant="ghost">
              <IconUser className="size-6 shrink-0 stroke-[1.5px] text-primary transition-colors duration-200" />
            </Button>
            Account
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="mx-1.75 mt-2 flex cursor-pointer items-center justify-center border border-primary py-1.5 font-satoshi-regular text-[15px] text-primary"
            onClick={handleLogout}
          >
            Logout
            <IconLogout className="size-5 shrink-0 stroke-[1.5px] text-primary ml-2" />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function UserNavDropdown() {
  return (
    <Suspense fallback={<Skeleton className="h-10 w-10 rounded-full" />}>
      <UserNavDropdownContent />
    </Suspense>
  );
}
