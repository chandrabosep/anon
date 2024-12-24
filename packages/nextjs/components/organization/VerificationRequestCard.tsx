"use client";

import React from "react";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { Card } from "../ui/card";

interface VerificationRequestCardProps {
  request: any;
}

export function VerificationRequestCard({ request }: any) {
  const statusColors = {
    pending: "text-yellow-600",
    approved: "text-green-600",
    rejected: "text-red-600",
  };

  const StatusIcon = {
    pending: Clock,
    approved: CheckCircle,
    rejected: XCircle,
  }[request.status as keyof typeof statusColors] as any;

  return (
    <Card className="bg-white/5 rounded-lg shadow-md p-6 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{request.title}</h3>
        <div className={`flex items-center gap-2 ${statusColors[request.status as keyof typeof statusColors]}`}>
          <StatusIcon className="w-5 h-5" />
          <span className="text-sm capitalize">{request.status}</span>
        </div>
      </div>
      <p className="text-gray-400 mb-4">{request.content}</p>
      <div className="text-sm text-gray-300">Submitted {new Date(request.createdAt).toLocaleDateString()}</div>
    </Card>
  );
}
