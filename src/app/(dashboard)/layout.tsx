"use client";

import { Sidebar } from "@/components/slider";
import Header from "../../components/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background">
      <Sidebar />
      <div className="md:ml-20 overflow-hidden">
        <main className="px-4 py-3 md:p-8">
        <Header/>
          {children}
        </main>
      </div>
    </div>
  );
}