"use server";

import prisma from "../lib/db";

export async function createOrganization(data: { name: string; walletAddress: string; collectionId: number }) {
  if (!data.name || !data.walletAddress) {
    throw new Error("Invalid organization data.");
  }

  try {
    const organization = await prisma.organization.create({
      data: {
        name: data.name,
        walletAddress: data.walletAddress,
        collectionId: data.collectionId,
      },
    });

    return organization;
  } catch (error) {
    console.error("Error creating organization:", error);
    throw new Error("Failed to create organization.");
  }
}

export async function getOrganizations(address: string) {
  const organization = await prisma.organization.findMany({
    where: { walletAddress: address },
  });
  return organization;
}

export async function getCollectionIdByWalletAddress(walletAddress: string) {
  try {
    const organization = await prisma.organization.findFirst({
      where: {
        walletAddress: walletAddress,
      },
      select: {
        name: true,
        collectionId: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!organization) {
      throw new Error("Organization not found for this wallet address.");
    }

    return organization;
  } catch (error) {
    throw new Error(`Error fetching collectionId: ${error}`);
  }
}
