"use client";

import { ReputationChart } from "@/components/ReputationChart";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, MessageSquarePlus, Star, ThumbsUp } from "lucide-react";

export default function MonochromeFeedbackUI() {
  const organizationName = "TechNova Industries";
  const reputationScore = 2;

  const feedbackItems = [
    {
      id: 1,
      title: "Bad work culture",
      content: "Work culture needs to improve",
      source: "Gmail",
      date: "December 15, 2024 1:30 PM",
      likes: 0,
    },
    // Placeholder items
    {
      id: 2,
      title: "Communication issues",
      content: "We need more transparent communication channels",
      source: "Internal Survey",
      date: "December 14, 2024 10:15 AM",
      likes: 5,
    },
    {
      id: 3,
      title: "Positive feedback",
      content: "Recent team-building activities have been great for morale",
      source: "Feedback Box",
      date: "December 13, 2024 3:45 PM",
      likes: 12,
    },
    {
      id: 4,
      title: "Work-life balance",
      content: "Consider implementing flexible working hours",
      source: "HR Portal",
      date: "December 12, 2024 9:00 AM",
      likes: 8,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="px-4 py-8">
        {/* Reputation Score */}
        <Card className="mb-8 bg-white/5 border-white/20 pt-4">
          <CardContent className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{organizationName}</h2>
              <p className="text-sm text-gray-300">Organization Reputation</p>
            </div>
            <div className="flex items-center space-x-2">
              <ReputationChart score={reputationScore} />
            </div>
          </CardContent>
        </Card>

        {/* Feedback List */}
        <div className="flex flex-col gap-6">
          {feedbackItems.map(item => (
            <Card key={item.id} className="overflow-hidden transition-all hover:shadow-lg border-white/40">
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
