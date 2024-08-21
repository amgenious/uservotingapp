"use client"
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
    Home,
    Package,
    ClipboardPenLine,
    MonitorCheck, Puzzle
  } from "lucide-react"

const SideBarLinks = () => {
    const pathname = usePathname();
  return (
    <div className="flex-1 pt-5">
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
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
  </div>
  )
}

export default SideBarLinks
