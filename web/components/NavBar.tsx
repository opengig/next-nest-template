"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { BluetoothIcon } from "lucide-react";
import { usePathname } from "next/navigation";

const NavBar = () => {
  const pathname = usePathname();
  const isDashboard = pathname?.includes("/dashboard");
  if (isDashboard) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-14 items-center">
        <Link
          href={isDashboard ? "/dashboard" : "/"}
          className="flex items-center space-x-2 mr-4"
          prefetch={false}
        >
          <BluetoothIcon className="h-6 w-6" />
          <span className="font-bold">My Inc</span>
        </Link>
        <nav className="flex-1 flex items-center justify-end space-x-4 md:space-x-6">
          <Button asChild variant="ghost">
            <Link href={"/login"}>Login</Link>
          </Button>
          <Button asChild>
            <Link href={"/register"}>Sign Up</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
