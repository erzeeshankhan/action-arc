"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getOrganization(slug) {
    // we will get the user from the clerk Auth
    const { userId } = auth();

    // if user is not logged in throw this error
    if (!userId) {
        throw new Error('User is not authenticated');
    }

    // check if user exist in our database or not
    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    // is user doesnt exist throw error
    if (!user) {
        throw error("User not found");
    }

    // Getting the organiization details
    const organization = await clerkClient().organizations.getOrganization({
        slug,
    })

    if (!organization) {
        return null;
    }

    // checking if the user who is trying to fetch our organization is actually a member of this organization or not
    // getting the membership array of the organization
    const { data: membership } = await clerkClient().organizations.getOrganizationMembershipList({
        organizationId: organization.id,
    })

    // checking if the user is a member of this organization or not / part of the membership array
    const userMembership = membership.find(
        (member) => member.publicUserData.userId === userId
    );

    if (!userMembership) {
        return null;
    }

    return organization;
};


// getting the organization users for ussue assignee and reporter
export async function getOrganizationUsers(orgId) {
    const { userId } = auth();
    if (!userId) {
        throw new Error('User is not authenticated');
    }

    const user = await db.user.findMany({
        where: { clerkUserId: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const organizationMemberships =
        await clerkClient().organizations.getOrganizationMembershipList({
            organizationId: orgId,
        });

    const userIds = organizationMemberships.data.map(
        (member) => member.publicUserData.userId
    );

    const users = await db.user.findMany({
        where: { clerkUserId: { in: userIds } },
    });

    return users;

}