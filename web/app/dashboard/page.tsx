"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const { data, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status == "loading") return;
    if (data) {
      router.push(`/dashboard/${data.user.role ?? "user"}`);
    } else {
      router.push("/login");
    }
  }, [data, router, status]);
  if (status === "loading") {
    return <div className="w-full text-center py-10">Loading...</div>;
  }
  return <div className="w-full text-center py-10">redirecting...</div>;
};

export default Page;
