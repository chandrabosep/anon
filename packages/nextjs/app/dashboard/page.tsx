"use client";

import React, { useState } from "react";
import { CreateOrganizationForm } from "@/components/organization/CreateOrganizationForm";
import { OrganizationCard } from "@/components/organization/OrganizationCard";
import { VerificationRequestCard } from "@/components/organization/VerificationRequestCard";
import { useAccount } from "wagmi";
import Image from "next/image";

function Dashboard() {
  const { address, isConnected } = useAccount();
  const [organizations, setOrganizations] = useState<any[]>([
    {
      id: 1,
      title: "Organization 1",
      createdAt: new Date(),
    },
  ]);
  const [verificationRequests] = useState<any[]>([
    {
      id: "1",
      organizationId: "1",
      title: "Business License Verification",
      content: "Requesting verification of our business license and company registration documents.",
      status: "pending",
      createdAt: new Date(),
    },
    {
      id: "2",
      organizationId: "2",
      title: "Tax ID Verification",
      content: "Need verification of our tax identification number and related documentation.",
      status: "approved",
      createdAt: new Date(),
    },
  ]);

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
              {verificationRequests.map(request => (
                <VerificationRequestCard key={request.id} request={request} />
              ))}
            </div>
          </div>
        </div>
      </>
    </div>
  );
}

export default Dashboard;
