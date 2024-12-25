"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getOrganizations } from "@/actions/organization.action";
import { getQueries } from "@/actions/queries.action";
import { CreateOrganizationForm } from "@/components/organization/CreateOrganizationForm";
import { OrganizationCard } from "@/components/organization/OrganizationCard";
import { VerificationRequestCard } from "@/components/organization/VerificationRequestCard";
import { useAccount } from "wagmi";

function Dashboard() {
  const { address, isConnected } = useAccount();
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [queries, setQueries] = useState<any[]>([]);

  const RecentOrgcollectionId = organizations[0]?.collectionId;

  useEffect(() => {
    const fetchOrganizations = async () => {
      const organizations = await getOrganizations(address as string);
      setOrganizations(organizations);
    };
    fetchOrganizations();

    const fetchQueries = async () => {
      if (address) {
        const queries = await getQueries(address as string);
        setQueries(queries);
      }
    };
    fetchQueries();
  }, [address]);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Image src="/art.svg" alt="InsightAnon" width={500} height={500} className="w-48" />
        <span className="text-gray-400 text-xl font-medium">Connect your wallet to view your organizations.</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <>
        <CreateOrganizationForm />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 mt-8">
          <div>
            <h2 className="text-2xl font-semibold  mb-4">Your Organizations</h2>
            <div className="grid gap-4">
              {organizations.map(org => (
                <OrganizationCard key={org.id} organization={org} />
              ))}
              {organizations.length === 0 && (
                <p className="text-gray-500 text-center py-8">No organizations yet. Create one to get started!</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold  mb-4">Verification Requests</h2>
            <div className="grid gap-4">
              {queries.map(query => (
                <VerificationRequestCard key={query.id} request={query} collectionId={RecentOrgcollectionId} />
              ))}
              {queries.length === 0 && (
                <p className="text-gray-500 text-center py-8">{`No organizations found. You haven't created any organizations yet`}</p>
              )}
            </div>
          </div>
        </div>
      </>
    </div>
  );
}

export default Dashboard;
