import React from 'react'
import SideBarLinks from '../sidebar/sidebarlinks'
import { Button } from '../ui/button'
import { LogOut, Radar } from 'lucide-react'
import { SignOutButton } from "@clerk/nextjs";

const Sidebar = () => {
  return (
    <div className='hidden md:flex flex-col justify-between items-center p-5  h-full'>
      <div>
      <div className='flex justify-center items-center gap-5 w-full p-2'>
    <div className='bg-primary rounded-full w-16 h-16 flex justify-center items-center'><Radar className='text-black w-10 h-10' /></div>
   
</div>
      <SideBarLinks />     
      </div>
      <SignOutButton>
            <Button>
                <LogOut />
                <p className='ml-3'>
                Logout
                </p>
            </Button>
           </SignOutButton>
     </div>
  )
}

export default Sidebar