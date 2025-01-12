"use client";

import React, { useState } from "react";
import { acceptQuery } from "@/actions/queries.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useiExec } from "@/hooks/iExec/useiExec";
import { Check, Loader } from "lucide-react";

interface VerificationRequest {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export function VerificationRequestCard({
  request,
  collectionId,
}: {
  request: VerificationRequest;
  collectionId: number;
}) {
  const { setProtectedDataToSubscription } = useiExec();
  const [isLoading, setIsLoading] = useState(false);

  const onAccept = async () => {
    try {
      setIsLoading(true);
      console.log("Accepting request");

      const res = await setProtectedDataToSubscription(request.title, request.content, collectionId);
      console.log("res", res);
      if (res && res.data) {
        await acceptQuery(Number(request?.id), res.data);
        console.log("Request accepted:", res);
      } else {
        console.log("No data returned or an error occurred.");
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white/5 border-white/20">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">{request.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400 line-clamp-3">{request.content}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span className="text-sm text-gray-400">Submitted {new Date(request.createdAt).toLocaleDateString()}</span>
        <Button
          size="sm"
          disabled={isLoading}
          className={`flex items-center gap-2 ${
            isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          } text-white font-medium`}
          onClick={onAccept}
          title="Accept Request"
        >
          {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          {isLoading ? "Processing..." : "Accept"}
        </Button>
      </CardFooter>
    </Card>
  );
}
