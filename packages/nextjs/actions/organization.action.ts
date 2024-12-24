"use server";

import prisma from "../lib/db";

export async function createOrganization(data: {
  name: string;
  walletAddress: string;
  collectionId: string;
  collectionHash: string;
}) {
  if (!data.name || !data.walletAddress) {
    throw new Error("Invalid organization data.");
  }

  try {
    const organization = await prisma.organization.create({
      data: {
        name: data.name,
        walletAddress: data.walletAddress,
        collectionId: `col-${crypto.randomUUID()}`,
        collectionHash: crypto.randomUUID(),
      },
    });

    return organization;
  } catch (error) {
    console.error("Error creating organization:", error);
    throw new Error("Failed to create organization.");
  }
}
