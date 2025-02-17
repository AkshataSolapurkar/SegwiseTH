"use client";

import { Sidebar } from "@/components/slider";
import Header from "../../components/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative bg-background">
      <Sidebar />
      <div className="relative md:ml-20 overflow-hidden">
        <main className="px-4 pt-3 md:p-8">
          <div className="md:ml-0 ml-12">
            <Header/>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}