"use server";

import prisma from "../lib/db";

export async function createOrganization(data: { name: string; walletAddress: string; collectionId: number }) {
  if (!data.name || !data.walletAddress || !data.collectionId) {
    throw new Error("Invalid organization data.");
  }

  try {
    // Check if the user exists
    let user = await prisma.user.findUnique({
      where: { walletAddress: data.walletAddress },
    });

    // If the user does not exist, create a new user
    if (!user) {
      user = await prisma.user.create({
        data: {
          walletAddress: data.walletAddress,
          collectionId: data.collectionId,
        },
      });
    }

    // Now create the organization and connect the user to it
    const organization = await prisma.organization.create({
      data: {
        name: data.name,
        walletAddress: data.walletAddress,
        collectionId: data.collectionId,
        members: {
          connect: { walletAddress: data.walletAddress }, // Connect the user to the organization
        },
      },
    });

    return organization;
  } catch (error) {
    console.error("Error creating organization:", error);
    throw new Error(`Failed to create organization. ${error instanceof Error ? error.message : error}`);
  }
}

export async function getOrganizations(address: string) {
  try {
    // Find organizations where the user is a member
    const organizations = await prisma.organization.findMany({
      where: {
        members: {
          some: {
            walletAddress: address, // Check if the user is a member
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Order by creation date, descending
      },
    });

    return organizations;
  } catch (error) {
    console.error("Error fetching organizations for user:", error);
    throw new Error("Failed to fetch organizations.");
  }
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
            reputation: true,
          },
          orderBy: {
            createdAt: "desc",
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
