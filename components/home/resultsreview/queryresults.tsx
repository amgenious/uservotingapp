'use client'
import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Search } from "lucide-react";
import {
  ClipboardPenLine,
  Loader,
  User,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Candidate {
  fullname: string;
  imageUrl: string;
  port: string;
  voteCount?: number; 
  votePercentage?: number;
}

interface BallotPaper {
  id: string;
  name: string;
  noc: string;
  candidates: Candidate[];
  portfolios: Portfolio[];
}

interface Portfolio {
  id: number;
  value: string;
}

const QueryResults = () => {
  const [uniquecode, setUniquecode] = useState("");
  const [data, setData] = useState<BallotPaper[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalVoters, setTotalVoters] = useState(0);
  const colRef = collection(db, "ballotpapers");

  const getItems = async () => {
    setLoading(true);
    try {
      const q1 = query(
        colRef,
        where("uniqueid", "==", uniquecode),
      );
      const unsubscribeSnapshot = onSnapshot(q1, (snapShot) => {
        let list: BallotPaper[] = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as BallotPaper);
        });

        if (list.length > 0) {
          // If ballot papers are found, fetch votes and count them
          getVotes(list);
        } else {
          setLoading(false);
        }
      });
      return () => {
        unsubscribeSnapshot();
      };
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const getVotes = async (ballotPapers: BallotPaper[]) => {
    const votesRef = collection(db, "votes");
    const q2 = query(votesRef, where("uniqueid", "==", uniquecode));

    onSnapshot(q2, (snapShot) => {
      const votes: { [key: string]: number } = {};
      let totalVotersCount = 0;

      snapShot.docs.forEach((doc) => {
        totalVotersCount++; // Increment total voters count
        const voteData = doc.data();
        voteData.voted.forEach((vote: any) => {
          if (vote.Approved) {
            if (!votes[vote.CandidateName]) {
              votes[vote.CandidateName] = 0;
            }
            votes[vote.CandidateName]++;
          }
        });
      });

      setTotalVoters(totalVotersCount); // Update total voters state

      const updatedData = ballotPapers.map((ballotPaper) => {
        const updatedCandidates = ballotPaper.candidates.map((candidate) => {
          const voteCount = votes[candidate.fullname] || 0;
          const votePercentage = totalVotersCount > 0 ? (voteCount / totalVotersCount) * 100 : 0;

          return {
            ...candidate,
            voteCount, // Assign the vote count
            votePercentage, // Assign the vote percentage
          };
        });

        return { ...ballotPaper, candidates: updatedCandidates };
      });

      setData(updatedData);
      setLoading(false);
    });
  };

  const getPortfolioValue = (
    portId: string,
    portfolios: Portfolio[]
  ): string => {
    const portfolio = portfolios.find((p) => p.id === Number(portId));
    return portfolio ? portfolio.value : "Unknown";
  };

  return (
    <div className="flex flex-col gap-5 items-center pt-5">
      <div className="p-5 border w-fit rounded-md">
        <div>
          <p className="text-primary text-xl font-bold mb-4">
            Search Elections Results by Code
          </p>
          <div className="flex justify-center items-center gap-3 mb-5">
            <input
              className="border-primary border-2 rounded-sm p-2 w-full"
              placeholder="Election Code"
              type="text"
              onChange={(e) => setUniquecode(e.target.value)}
            />
            <div className="bg-primary p-3 rounded-md" onClick={getItems}>
              <Search className="text-white cursor-pointer" />
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle> Elections Results</CardTitle>
            </CardHeader>
            {data.length > 0 && !loading ? (
              data.map((item) => (
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
                        <DialogContent className="w-full">
                          <DialogHeader>
                            <DialogTitle>{item.noc}</DialogTitle>
                          </DialogHeader>
                          <p>{item.name}</p>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[100px]">
                                  Portfolios
                                </TableHead>
                                <TableHead className="w-[100px]">
                                  Candidate Picture
                                </TableHead>
                                <TableHead className="w-[100px]">
                                  Candidate Name
                                </TableHead>
                                <TableHead className="w-[50px]">
                                  Votes
                                </TableHead>
                                <TableHead className="w-[100px]">
                                  Vote Percentage
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {item.candidates.map((candidate, index) => (
                                <TableRow key={index}>
                                  <TableCell className="font-medium border">
                                    <p className="text-center p-1">
                                      {getPortfolioValue(
                                        candidate.port,
                                        item.portfolios
                                      )}
                                    </p>
                                  </TableCell>
                                  <TableCell className="border">
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
                                  <TableCell className="border">
                                    <p className="text-center p-1">
                                      {candidate.fullname}
                                    </p>
                                  </TableCell>
                                  <TableCell className="border">
                                    <p className="text-center p-1">
                                      {candidate.voteCount || 0} 
                                    </p>
                                  </TableCell>
                                  <TableCell className="border">
                                    <p className="text-center p-1">
                                      {candidate.votePercentage?.toFixed(2) || 0}% 
                                    </p>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          <p>Total Voters: {totalVoters}</p>
                        </DialogContent>
                      </Dialog>
                    </div>
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
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QueryResults;
