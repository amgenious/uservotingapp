'use client'
import React from 'react'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
    Car,
    ClipboardPenLine,
    Home,
    LogOut,
    Menu,
    MonitorCheck,
    Package,
    Puzzle,
  } from "lucide-react";
  import Link from "next/link";
import { Togglebtn } from '../ui/togglebtn';
import { UserButton } from '@clerk/nextjs';


const NavBar= () => {
    const pathname = usePathname();
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-primary px-4 lg:h-[60px] lg:px-6 sticky">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col bg-black">
          <nav className="grid gap-2 text-lg font-medium">
          <Link
        href="/home"
        className={clsx("flex items-center gap-3 rounded-lg px-3 py-2 text-secondary-foreground transition-all",
        {
          'bg-primary': pathname === "/home",
        },
        ) 
        }
      >
        <Home className="h-4 w-4" />
        Home
      </Link>
      {/* <Link
        href="/home/elections"
        className={clsx("flex items-center gap-3 rounded-lg px-3 py-2 text-secondary-foreground transition-all",
        {
          'bg-primary text-white text-muted': pathname === "/home/elections",
        },
        ) 
        }
      >
        <Package className="h-4 w-4" />
        Elections
      </Link> */}
      <Link
        href="/home/resultsreview"
        className={clsx("flex items-center gap-3 rounded-lg px-3 py-2 text-secondary-foreground transition-all",
        {
          'bg-primary text-white text-muted': pathname === "/home/resultsreview",
        },
        ) 
        }
      >
        <MonitorCheck className="h-4 w-4" />
        Results Review
      </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className='w-full flex justify-end items-center'>
        <div className='flex gap-3'>
        <Togglebtn />
        <UserButton />
        </div>
      </div>
      
    </header>
  )
}

export default NavBar
