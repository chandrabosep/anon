"use server";

import prisma from "../lib/db";
import { analyzeSentiment } from "./analyze-sentiment";

export async function createQuery(data: { title: string; content: string; collectionId: number }) {
  if (!data.title || !data.content || !data.collectionId) {
    throw new Error("Invalid query data.");
  }

  const organization = await prisma.organization.findUnique({
    where: { collectionId: data.collectionId },
  });

  if (!organization) {
    throw new Error("Organization not found. Cannot create query.");
  }

  try {
    const query = await prisma.query.create({
      data: {
        title: data.title,
        content: data.content,
        organizationId: organization.id,
      },
    });

    console.log("query", query);
    return query;
  } catch (error) {
    console.error("Error creating query:", error);
    throw new Error("Failed to create query. Please try again later.");
  }
}

export async function getQueries(walletAddress: string) {
  const organization = await prisma.organization.findFirst({
    where: { walletAddress },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!organization) {
    throw new Error("Organization not found. Cannot get queries.");
  }

  const queries = await prisma.query.findMany({
    where: {
      organizationId: organization.id,
      status: "PENDING",
    },
  });

  return queries;
}

export async function acceptQuery(queryId: number, protectedDataAddress: string, organizationId: number, content: string) {
  await prisma.query.update({
    where: { id: queryId },
    data: { status: "APPROVED", protectedDataAddress },
  });

  const rating = analyzeSentiment(content);

  await prisma.organization.update({
    where: { id: organizationId },
    data: {
      reputation: {
        increment: rating,
      },
    },
  });
}

export async function getAcceptedQueriesByCollectionId(collectionId: number) {
  const organization = await prisma.organization.findFirst({
    where: { collectionId },
  });

  if (!organization) {
    return [];
  }

  const queries = await prisma.query.findMany({
    where: {
      organizationId: organization.id,
      status: "APPROVED",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return queries;
}
