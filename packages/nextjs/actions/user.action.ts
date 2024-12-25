"use server";

import prisma from "../lib/db";

export async function addUserToOrganization(data: { walletAddress: string; collectionId: number }) {
    try {
        // Ensure the user exists (create or fetch)
        const user = await prisma.user.upsert({
            where: { walletAddress: data.walletAddress },
            update: {},
            create: { walletAddress: data.walletAddress },
        });

        // Find the organization using the collectionId
        const organization = await prisma.organization.findUnique({
            where: { collectionId: data.collectionId },
        });

        if (!organization) {
            throw new Error("Organization not found for the given collectionId.");
        }

        // Add the user to the organization
        const updatedOrganization = await prisma.organization.update({
            where: { id: organization.id }, // Use the organization's unique ID
            data: {
                members: {
                    connect: { id: user.id },
                },
            },
        });

        return {
            user,
            organization: updatedOrganization,
        };
    } catch (error) {
        console.error("Error adding user to organization:", error);
        throw new Error("Failed to add user to organization.");
    }
}
