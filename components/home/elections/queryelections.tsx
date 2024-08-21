'use client'
import { Loader, Package, Pencil, Search, Trash } from 'lucide-react'
import React,{useState} from 'react'
import {
    collection,
    query,
    where,
    onSnapshot,
    getDocs,
  } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { useUser } from '@clerk/clerk-react';
import VotePage from './vote';
import { Button } from '@/components/ui/button';


const QueryElections = () => {
  const {user}=useUser()
  const [data2, setData2] = useState(false);
  const [data3, setData3] = useState(false);
  const [data4, setData4] = useState(false);
    const [uniquecode, setUniquecode] = useState("")
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const handleClick = async (e: any) => {
      e.preventDefault();
      const colRef = collection(db, 'elections');
      const q = query(colRef, where('uniqueid', '==', uniquecode));
  
      const unsubscribeSnapshot = onSnapshot(q, (snapShot) => {
          setLoading(true);
          setData([]);
          let list: any = [];
          const currentDateTime = new Date();
  
          snapShot.docs.forEach((doc) => {
              const data = doc.data();
              const endDateAndTime = new Date(data.enddateandtime);
              if (currentDateTime > endDateAndTime) {
                  data.statusMessage = "Election ended";
                  setData4(true)
              }else{
                list.push({ id: doc.id, ...data });
              }
          });
  
          setData(list);
          setLoading(false);
      });
  
      return () => {
          unsubscribeSnapshot();
      };
  }
      const checkvalidity =async ()=>{
        const colRef = collection(db, 'votes');
        const q = query(
            colRef,
            where('useremail', '==', user?.primaryEmailAddress?.emailAddress),
          );
          const querySnapshot = await getDocs(q);
            if(querySnapshot.docs.length == 0){
              setData3(true)
            }else{
              setData2(true)
            }
    }
  return (
    <div className=' flex flex-col gap-5 items-center pt-5'>
    <div className='p-5 w-fit rounded-md'>
      <div>
       
       <Button onClick={checkvalidity} className='mb-4'>Elections</Button>
      {
        data3 ? 
        <div className='flex justify-center items-center gap-3 mb-5'>
        <input className="border-primary border-2 rounded-sm p-2 w-full" placeholder="Election Code" type="text" onChange={(e) => setUniquecode(e.target.value)} />
        <div className='bg-primary p-3 rounded-md'>
        <Search className='text-white cursor-pointer'
        onClick={handleClick}
        />
        </div>
        </div> :<></>
      }
       <Card className='p-3 border-none'>
      {
       data4 ? <><p>Election has ended</p></>:<></>
      }
        {
          data2 ? <><p>Not eligible to vote</p></>:<></>
        }
      {data?.length > 0 && loading == false ? (
            data.map((item: any) => (
             <CardContent className="grid gap-8" key={item.id} >
             <div className="flex justify-between items-center">
             <div className="flex items-center gap-4">
               <Avatar className="hidden h-10 w-10 sm:flex">
                 <AvatarImage src="" alt="Avatar" />
                 <AvatarFallback><Package /></AvatarFallback>
               </Avatar>
               <div className="grid gap-1">
                 <p className="text-lg font-bold leading-none">{item.noc}</p>
                 <p className="text-lg font-medium leading-none">{item.name}</p>
                 <div className="flex gap-2 items-center">
                 <p className="text-sm text-muted-foreground">Total Candidates {item.candidates.length}</p>
                 </div>
               </div>
             </div>
             </div>
             <div className="flex items-center gap-4"> 
              <VotePage uniqueid={uniquecode} />
                 </div>
           </CardContent>
            ))
) : loading ? (
  <Loader
    size={40}
    className="animate-spin ml-2 text-primary text-center"
  />
) : (
 <></>
)
}
    </Card>
    </div>
    </div>
    </div>
  
  )
}

export default QueryElections