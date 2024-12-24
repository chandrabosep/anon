"use client";

import React from "react";
import { Card, CardHeader } from "../ui/card";
import { Building2, Copy } from "lucide-react";
import CopyToClipboard from "react-copy-to-clipboard";

interface OrganizationCardProps {
  organization: any;
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  return (
    <Card className="bg-white/5 border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold ">{organization.title}</h3>
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <CopyToClipboard text={organization.id}>
              <span className="flex items-center gap-2">
                <p className="text-sm text-gray-300">Organization ID</p>
                <Copy className="w-4 h-4 text-gray-300" />
              </span>
            </CopyToClipboard>
          </div>
        </div>
        <div className="text-sm text-gray-300">Created {new Date(organization.createdAt).toLocaleDateString()}</div>
      </CardHeader>
    </Card>
  );
}
