"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getCollectionIdByWalletAddress } from "@/actions/organization.action";
import AddQuery from "@/components/AddQuery";
import { ReputationChart } from "@/components/ReputationChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useiExec } from "@/hooks/iExec/useiExec";
import { useGlobalState } from "@/services/store/store";
import { ArrowUp, MessageSquarePlus, PlusCircle, ThumbsUp, Users } from "lucide-react";
import { useAccount } from "wagmi";

export default function MonochromeFeedbackUI() {
  const { isConnected, address } = useAccount();
  const [organization, setOrganization] = useState<any | null>(null);
  const [subscribedData, setSubscribedData] = useState<any | null>(null);
  const reputationScore = 2;

  const { setCollectionId } = useGlobalState();

  const { getProtectedData } = useiExec();

  const feedbackItems = [
    {
      id: 1,
      title: "Bad work culture",
      content: "Work culture needs to improve",
      source: "Gmail",
      date: "December 15, 2024 1:30 PM",
      likes: 0,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (address) {
        try {
          // Fetch the organization based on wallet address
          const fetchedOrganization = await getCollectionIdByWalletAddress(address);
          console.log("fetchedOrganization", fetchedOrganization);
          setOrganization(fetchedOrganization);
          setCollectionId(fetchedOrganization?.collectionId);
          // Fetch the subscribed data once the organization is fetched
          if (fetchedOrganization?.collectionId) {
            // const data = await getSubscribedData(fetchedOrganization.collectionId);
            const data = await getProtectedData(fetchedOrganization.collectionId);

            setSubscribedData(data);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    

    if (isConnected) {
      fetchData();
    }
  }, [address, isConnected]);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Image src="/art.svg" alt="InsightAnon" width={500} height={500} className="w-48" />
        <span className="text-gray-400 text-xl font-medium">Connect your wallet to view queries.</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="px-4 py-8">
        {/* Reputation Score */}
        <Card className="bg-[#10141D] border-white/20 pt-4">
          <CardContent className="flex items-center justify-between">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold capitalize">
                {organization?.name} <span className="text-gray-300 text-base">({organization?.collectionId})</span>
              </h2>

              <div className="bg-gray-300/10 rounded-sm px-4 py-1 flex items-center gap-2 w-fit">
                <Users className="size-4" />
                <span className="text-gray-300 ">{organization?.members?.length || 0}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ReputationChart score={reputationScore} />
            </div>
          </CardContent>
        </Card>
        <Separator className="w-full bg-white/20 my-4" />
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Voice of the People</h2>
          <AddQuery collectionId={organization?.collectionId} />
        </div>
        {/* Feedback List */}
        <div className="max-h-[calc(100svh-9.5rem*2)] scrollbar-thin overflow-y-auto flex flex-col gap-6 pr-2">
          {feedbackItems.map(item => (
            <Card key={item.id} className="hover:shadow-lg border-white/40">
              <CardContent className="p-0">
                <div className="flex items-center justify-between border-b border-white/40 p-4">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-300">{item.date}</p>
                </div>
                <div className="p-4">
                  <p className="mb-4 text-gray-200">{item.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="h-4 w-4 text-gray-300" />
                        <span className="text-sm font-medium">{item.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageSquarePlus className="h-4 w-4 text-gray-300" />
                        <span className="text-sm font-medium">0</span>
                      </div>
                    </div>
                    <button className="rounded-full bg-gray-200 p-2 text-black transition-colors hover:bg-gray-300">
                      <ArrowUp className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
