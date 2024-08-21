import Getallclubs from '@/components/home/overview/getallclubs'
import React from 'react'

const HomePage = () => {
  return (
    <div className='flex flex-col flex-1 h-full w-full bg-secondary'>
    <div className='w-full p-3 h-fit bg-secondary'>
        <p className='text-3xl font-black'>Home</p>
        </div>
    <div className='p-3 h-full flex flex-col gap-5 border-[0.5px] border-primary bg-background rounded-xl'>
    <Getallclubs />
    </div>
   </div>
  )
}

export default HomePage