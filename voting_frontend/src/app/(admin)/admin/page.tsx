"use client";

import { useAuthStore } from "@/lib/authStore";
import { usePathname, useRouter } from "next/dist/client/components/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const route = usePathname();
  const router = useRouter();
  const { isAdmin, isLoggedIn } = useAuthStore();
  useEffect(() => {
    if (!isAdmin || !isLoggedIn) {
      router.push("/admin/login");
    } else if (route === "/admin") {
      router.push("/admin/dashboard");
    }
  }, [isAdmin, isLoggedIn, route, router]);

  return <div>page</div>;
};

export default Page;
