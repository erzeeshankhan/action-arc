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


// Fetching the projects to display on the organization main page, done wrt orgId 
export async function getProjects(orgId) {

    // Taking userId from auth()
    const { userId } = auth();

    // check
    if (!userId) {
        throw new Error('User is not authenticated');
    }

    // check if user is in the db
    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        },
    });

    if (!user) {
        throw new Error('User is not found');
    }

    const projects = await db.project.findMany({
        where: { organizationId: orgId },
        // ordering the projects in descending order wrt when its created (createdAt)
        orderBy: { createdAt: "desc" },
    })
    return projects;
}


// Action for deleting the projects

export async function deleteProject(projectId) {
    const { userId, orgId, orgRole } = auth();

    // check if user is authenticated
    if (!userId || !orgId) {
        throw new Error('User is not authenticated');
    }

    // check if the user is an organization admin
    if (orgRole !== 'org:admin') {
        throw new Error('Only organization admins can delete projects');
    }

    // check if the project exists
    const project = await db.project.findUnique({
        where: { id: projectId },
    });
    if (!project) {
        throw new Error('Project not found');
    }


    // delete the project
    await db.project.delete({
        where: { id: projectId },
    });

    return { success: true };
}
