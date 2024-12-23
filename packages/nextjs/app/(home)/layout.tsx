"use client";

import { useAccount } from "wagmi";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-svh flex flex-col md:flex-row">
      <main>{children}</main>
    </div>
  );
}
