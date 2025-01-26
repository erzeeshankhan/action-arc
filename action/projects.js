"use server"


import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function createProject(data) {
    // Adding some checks / Verifications
    const { userId, orgId } = auth();
    if (!userId) {
        throw new Error('User is not authenticated');
    }
    if (!orgId) {
        throw new Error('Nor Organization selected');
    }

    // checking if the user is a member of this organization or not / part of the membership array
    const { data: membershipList } =
        await clerkClient().organizations.getOrganizationMembershipList({
            organizationId: orgId,
        });


    const userMembership = membershipList.find(
        (membership) => membership.publicUserData.userId === userId
    );

    // check if the user is admin of the organization
    if (!userMembership || userMembership.role !== "org:admin") {
        throw new Error("Only organization admins can create projects");
    }

    // if above case is not true then--
    try {
        const project = await db.project.create({
            data: {
                name: data.name,
                key: data.key,
                description: data.description,
                organizationId: orgId,
            }
        });
        return project;
    } catch (error) {
        throw new Error("Error creating project: " + error.message);
    }
}
