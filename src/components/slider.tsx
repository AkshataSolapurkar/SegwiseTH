"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import logo from "../../public/Group.png"
import { VideoIcon, BellDot, Settings, Menu, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Image from "next/image"

const menuItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: VideoIcon, label: "Reports", href: "/report" },
  { icon: BellDot, label: "Notify", href: "/notify" },
  { icon: Settings, label: "Settings", href: "/setting" },
]

export function Sidebar() {
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsOpen(window.innerWidth >= 768)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-[60] md:hidden text-[#7f7f7f] hover:text-[#6a7554]"
        onClick={toggleSidebar}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[50]" onClick={toggleSidebar} />
      )}

      <div
        className={cn(
          "fixed flex flex-col justify-start top-0 left-0 h-full bg-[#222222] lg:px-4 py-8 border-r border-[#2b2b2b] z-[60]",
          "transition-all duration-300 ease-in-out",
          isMobile ? (isOpen ? "w-64" : "-translate-x-full") : "w-64",
          "md:w-20 md:translate-x-0",
        )}
      >
        <Image src={logo || "/placeholder.svg"} className="mx-auto" alt="logo" width={40} height={40} />
        <ScrollArea className="h-full">
          <div className="flex-col flex gap-5 lg:px-0 px-2 md:px-3 py-6">
            {menuItems.map(({ icon: Icon, label, href }) => (
              <Link className="lg:flex lg:flex-col lg:items-center" key={href} href={href}>
                
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full",
                    isMobile ? "justify-start" : "justify-center",
                    "hover:bg-[#2b2b2b] hover:text-[#6a7554]",
                    pathname === href ? "bg-[#e2fa99] text-[#6a7554]" : "bg-[#2b2b2b] text-[#7f7f7f]",
                  )}
                  title={label}
                >
                  <Icon className="h-5 w-5" />
                  {(isMobile || !isOpen) && <span className="ml-2">{label}</span>}
                </Button>
                <span className="text-xs pt-3 text-[#7f7f7f] hidden md:block">{label}</span>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
    </>
  )
}

