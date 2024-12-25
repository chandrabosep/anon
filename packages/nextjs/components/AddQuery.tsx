"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { createQuery } from "@/actions/queries.action";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { DM_Sans } from "next/font/google";

const font = DM_Sans({
  subsets: ["latin"],
});


export default function AddQuery({ collectionId }: { collectionId: number }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createQuery({ title, content, collectionId });
    setTitle("");
    setContent("");
    setOpen(false);
  };

  const onCancel = () => {
    setTitle("");
    setContent("");
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen} className={`${font.className}`}>
        <DialogTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <PlusCircle className="size-5" />
            Add Query
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Query</DialogTitle>
            <DialogDescription className="text-gray-300">Please fill in the details for your new query.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                Query Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter query title"
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">
                Query Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder="Enter your query details"
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">Submit Query</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
