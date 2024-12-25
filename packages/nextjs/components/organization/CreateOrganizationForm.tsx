"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { createOrganization } from "@/actions/organization.action";
import { addUserToOrganization } from "@/actions/user.action";
import { useiExec } from "@/hooks/iExec/useiExec";
import { Plus } from "lucide-react";
import { useAccount } from "wagmi";

export function CreateOrganizationForm() {
  const [title, setTitle] = useState("");
  const { address } = useAccount();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [collectionId, setCollectionId] = useState("");
  const router = useRouter();

  const { createCollectionAndSubscribe, subscribeToOrganization } = useiExec();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title.trim() || !address) {
      setError("Please provide Title");
      return;
    }

    setLoading(true);
    try {
      setLoading(true);
      await createCollectionAndSubscribe().then(async res => {
        await createOrganization({
          name: title,
          walletAddress: address,
          // @ts-ignore 
          collectionId: res?.collection.collectionId,
        });
        return res;
      });
      setTitle("");
    } catch (error) {
      console.error(error);
      setError("Failed to create organization. Please try again.");
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

  const handleJoin = async () => {
    setJoinLoading(true);
    await subscribeToOrganization(Number(collectionId)).then(async () => {
      await addUserToOrganization({
        walletAddress: address as string,
        collectionId: Number(collectionId),
      });
    });
    router.refresh();
    setJoinLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader className="grid grid-cols-2 gap-4">
          <CardTitle>Create Organization</CardTitle>
          <CardTitle>Join Organization</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="flex gap-3">
            <Input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Organization Title"
            />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              {loading ? (
                "Creating..."
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Create
                </>
              )}
            </Button>
          </div>
          <div className="flex gap-3">
            <Input
              placeholder="Organization ID"
              value={collectionId}
              onChange={e => setCollectionId(e.target.value)}
            />
            <Button onClick={handleJoin} type="button" className="bg-blue-600 hover:bg-blue-700 text-white">
              {joinLoading ? (
                "Joining..."
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Join
                </>
              )}
            </Button>
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </CardContent>
      </Card>
    </form>
  );
}
