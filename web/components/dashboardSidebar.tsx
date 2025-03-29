"use client";

import * as React from "react";
import { LogOut, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function SidebarComponent({
  pages,
  children,
}: {
  pages: { title: string; url: string }[];
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" className="py-3">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <div className="flex cursor-pointer items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={"https://github.com/shadcn.png"}
                      alt={session?.user?.name ?? "devTools"}
                    />
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 text-left leading-none">
                    <span className="text-base font-medium">
                      {session?.user?.name ?? "Loading"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      View profile
                    </span>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent className="my-3">
          <SidebarMenu className="gap-1">
            {pages.map((page) => (
              <SidebarMenuItem key={page.title}>
                <SidebarMenuButton
                  asChild
                  className="w-full justify-start px-4 py-2 text-base font-medium hover:bg-accent hover:text-accent-foreground"
                >
                  <Link href={page.url}>{page.title}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="absolute bottom-0 left-0 w-full border-t p-4">
          <Button
            variant="outline"
            className="w-full justify-start text-base"
            onClick={() => {
              signOut({ callbackUrl: "/login" });
            }}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 z-50 sticky top-0 shrink-0 items-center px-4 bg-neutral-50">
          <SidebarTrigger className="-ml-2 md:hidden" />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
