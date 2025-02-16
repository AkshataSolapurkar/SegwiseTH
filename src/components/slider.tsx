"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import logo from "../../public/Group.png"
import {
  VideoIcon,
  BellDot,
  Settings,
  Menu,
  LogOut,
  Home
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: VideoIcon, label: "Analytics", href: "/analytics" },
  { icon: BellDot, label: "Users", href: "/dashboard/users" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function Sidebar() {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      setIsOpen(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden text-[#7f7f7f] hover:text-[#6a7554]"
        onClick={toggleSidebar}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={cn(
          "fixed top-0 left-0 h-full bg-[#222222] px-4 py-8 border-r border-[#2b2b2b] z-50",
          "transition-all duration-300",
          isMobile ? (isOpen ? "w-64" : "w-0") : "",
          "lg:w-20"
        )}
      >
        <Image src={logo} className="mx-auto" alt="logo" width={40} height={40}/>
        <ScrollArea className="h-full">
          <div className="flex-col flex gap-5 py-4">
            {menuItems.map(({ icon: Icon, label, href }) => (
              <Link key={href} href={href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "",
                    isMobile ? "justify-start" : "justify-center",
                    "hover:bg-[#2b2b2b] hover:text-[#6a7554]",
                    pathname === href 
                      ? "bg-[#e2fa99] text-[#6a7554]" 
                      : "bg-[#2b2b2b] text-[#7f7f7f]"
                  )}
                  title={label}
                >
                  <Icon className="h-5 w-5" />
                  {isMobile && isOpen && (
                    <span className="ml-3">{label}</span>
                  )}
                </Button>
              </Link>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4">
          <Button
            variant="ghost"
            className={cn(
              "w-full",
              isMobile ? "justify-start" : "justify-center",
              "bg-[#2b2b2b] text-[#7f7f7f] hover:bg-[#2b2b2b] hover:text-[#6a7554]"
            )}
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
            {isMobile && isOpen && (
              <span className="ml-3">Logout</span>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}