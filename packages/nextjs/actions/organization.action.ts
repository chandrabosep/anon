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
    orderBy: {
      createdAt: 'desc',
    },
  });
  return organization;
}

export async function getCollectionIdByWalletAddress(walletAddress: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        walletAddress: walletAddress,
      },
      include: {
        organizations: {
          select: {
            name: true,
            collectionId: true,
            members: true, // Include the members to get their count
          },
          orderBy: {
            createdAt: 'desc', 
          },
          take: 1, 
        },
      },
    });

    if (!user || user.organizations.length === 0) {
      throw new Error("No organizations found for this user.");
    }

    const recentOrganization = user.organizations[0];
    const totalMembers = recentOrganization.members.length; // Get the number of members

    return {
      ...recentOrganization,
      totalMembers, // Add totalMembers to the returned object
    };
  } catch (error) {
    console.error("Error finding user by wallet address:", error);
    throw new Error(`Error fetching user: ${error}`);
  }
}
