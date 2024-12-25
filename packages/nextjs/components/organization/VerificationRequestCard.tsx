'use client'

import React from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from 'lucide-react'
import { acceptQuery } from "@/actions/queries.action"

interface VerificationRequest {
  id: string
  title: string
  content: string
  createdAt: string
}

export function VerificationRequestCard({ request }: { request: VerificationRequest }) {
  const onAccept = async () => {
    console.log("Accepting request")
    await acceptQuery(request?.id)
  }

  return (
    <Card className="bg-white/5 border-white/20">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">{request.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400 line-clamp-3">{request.content}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span className="text-sm text-gray-400">
          Submitted {new Date(request.createdAt).toLocaleDateString()}
        </span>
        <Button 
          size="sm"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium"
          onClick={onAccept}
          title="Accept Request"
        >
          <Check className="w-4 h-4" />
          Accept
        </Button>
      </CardFooter>
    </Card>
  )
}

