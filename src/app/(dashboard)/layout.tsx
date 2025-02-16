"use client";

import { Sidebar } from "@/components/slider";
import Header from "../../components/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 lg:ml-20">
        <main className="px-4 py-3 md:p-8">
        <Header/>
          {children}
        </main>
      </div>
    </div>
  );
}