'use client'
import { Button } from '@/components/ui/button'
import React,{useState, useEffect} from 'react'
import { useUser } from '@clerk/clerk-react';
import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    serverTimestamp,
  } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ClipboardPenLine, Loader, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table, TableCaption } from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { Dialog, DialogTrigger, DialogTitle, DialogContent,DialogHeader, } from "@/components/ui/dialog";
import Image from 'next/image';
import { fingerprint } from '@/assets';
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation';

interface VoteProps {
    uniqueid: string;
  }
  interface BallotPaper {
    id: string;
    name: string;
    noc: string;
    candidates: Candidate[];
    portfolios: Portfolio[]; 
  }
  interface Candidate {
    fullname: string;
    imageUrl: string;
    port: string;
  }
  interface Portfolio {
    id: number;
    value: string;
  }  
  interface Item {
    portfolios: any; // Replace 'any' with the actual type if known
    candidates: Candidate[];
  }
  interface VotingTableProps {
    item: Item;
  }
  interface SelectedCandidates {
    [portfolioId: string]: Candidate;
  }
const VotePage:React.FC<VoteProps> =({uniqueid})=> {
    const [data1, setData1] = useState<BallotPaper[]>([]);
    const [loading1, setLoading1] = useState(false);
    const [voted, setVoted] = useState(false);
    const {user}=useUser()
    const router = useRouter();
    const {toast} = useToast()
    let me = user?.primaryEmailAddress?.emailAddress

    const handleClick =  async (e:any) => {
        e.preventDefault();
        const colRef = collection(db, 'ballotpapers');
        const q = query(
          colRef,
          where('uniqueid', '==', uniqueid),
        );
        const unsubscribeSnapshot = onSnapshot(q, (snapShot) => {
          setLoading1(true);
          let list: BallotPaper[] = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as BallotPaper);
        });
        setData1(list);
        setLoading1(false);
        });
        return () => {
          unsubscribeSnapshot();
        };
      }
      const getPortfolioValue = (
        portId: string,
        portfolios: Portfolio[]
      ): string => {
        const portfolio = portfolios.find((p) => p.id === Number(portId));
        return portfolio ? portfolio.value : "Unknown";
      };
      const [selectedCandidates, setSelectedCandidates] = useState<SelectedCandidates>({});

      const handleRowClick = (portfolioId: string, candidate: Candidate) => {
        setSelectedCandidates((prevState) => ({
          ...prevState,
          [portfolioId]: candidate,
        }));
      };
      const handleSubmitVote = async(item: BallotPaper) => {
        setVoted(true)
        const voted:any = [];
        Object.keys(selectedCandidates).forEach((portfolioId) => {
          const candidate = selectedCandidates[portfolioId];
          const voteEntry = {
            Portfolio: getPortfolioValue(candidate.port, item.portfolios),
            CandidateName: candidate.fullname,
            Approved: true,
          };
          voted.push(voteEntry);
        });
        try{
          await addDoc(collection(db,"votes"),{
            useremail:me,
            uniqueid:uniqueid,
            voted:voted,
            timeStamps: serverTimestamp(),
          })
          toast(
            {
              title:"Voted Successfully",
            }
          )
          router.push("/home")
        }
        catch(error){

        }
        
      };
  return (
    <div className='flex flex-col'>
        <p> You are eligible to vote. Click <span className='underline italic cursor-pointer' onClick={handleClick}>here</span>  </p>
        <Card>
      {
        data1?.length > 0 && loading1 == false ?
        (
         data1.map((item) => (

          <CardContent className="grid gap-8" key={item.id}>
            <div className="flex justify-between items-center">
              <div className="flex items-center justify-center ">
                <Avatar className="hidden h-10 w-10 sm:flex justify-center items-center">
                  <AvatarImage src="" alt="Avatar" />
                  <AvatarFallback>
                    <ClipboardPenLine />
                  </AvatarFallback>
                </Avatar>
                <Dialog>
                  <DialogTrigger asChild>
                    <DialogTitle className="cursor-pointer underline">
                      {item.name}
                    </DialogTitle>
                  </DialogTrigger>
                  <DialogContent className="w-fit h-fit">
                    <DialogHeader>
                      <DialogTitle>{item.noc}</DialogTitle>
                    </DialogHeader>
                    <p>{item.name}</p>
                    <Table className='w-full'>
                    <TableCaption>
                      {
                        voted ? <><Button disabled className='bg-green-700 hover:bg-green-500'>Voted</Button></>:
                      <Button onClick={() => handleSubmitVote(item)}>Submit Vote</Button>
                      }
                      </TableCaption>
                      <TableHeader className='w-[100px]'>
                        <TableRow>
                          <TableHead className="w-[100px]">
                            Portfolios
                          </TableHead>
                          <TableHead className="w-[100px] text-center">
                            Candidate Picture
                          </TableHead>
                          <TableHead className="w-[100px] text-center">
                            Candidate Name
                          </TableHead>
                          <TableHead className="w-[100px] text-center">
                            Vote
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {item.candidates.map((candidate, index) => (
                          <TableRow key={index}
                          onClick={() => handleRowClick(candidate.port, candidate)}
                          >
                            <TableCell className="font-medium border">
                              <p className="text-center p-1">
                                {getPortfolioValue(
                                  candidate.port,
                                  item.portfolios
                                )}
                              </p>
                            </TableCell>
                            <TableCell className='border'>
                              <Avatar>
                                <AvatarImage
                                  src={candidate.imageUrl}
                                  alt="Avatar"
                                  className="object-contain w-20 h-20"
                                />
                                <AvatarFallback>
                                  <User />
                                </AvatarFallback>
                              </Avatar>
                            </TableCell>
                            <TableCell className='border'>
                              <p className="text-center p-1">
                                {candidate.fullname}
                              </p>
                            </TableCell>
                            <TableCell className='border'>
                              <p className="text-center p-1">
                              {selectedCandidates[candidate.port] &&
                  selectedCandidates[candidate.port].fullname === candidate.fullname && (
                    <Image className="object-contain w-20 h-20" src={fingerprint} alt='fingerprint' />
                )}
                              </p>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex items-center gap-4 z-10">
              </div>
            </div>
          </CardContent>
        ))
        ):loading1 ?
        (<>
         <Loader
          size={40}
          className="animate-spin ml-2 text-primary text-center"
          />
        </>) : (
        <></>
      )}
      </Card>
    </div>
  )
}

export default VotePage