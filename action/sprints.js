"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function createSprint(projectId, data) {


    // check if the user is authenticated
    const { userId, orgId } = auth();
    if (!userId || !orgId) {
        throw new Error('User is not authenticated');
    }

    // sprint creation bug was by adding the include: { sprints: {orderBy: {createdAt: "desc" } } } in the findUnique method of the project 
    const project = await db.project.findUnique({
        where: { id: projectId },
        include: { sprints: { orderBy: { createdAt: "desc" } } },
    });

    if (!project || project.organizationId !== orgId) {
        throw new Error("Project not found");
    }


    // create a new sprint
    const sprint = await db.sprint.create({
        data: {
            name: data.name,
            startDate: data.startDate,
            endDate: data.endDate,
            status: "PLANNED",
            projectId: projectId,
        },
    });

    return sprint;

}


export async function updateSprintStatus(sprintId, newStatus) {
    // Authentication check
    const { userId, orgId, orgRole } = auth();
    if (!userId || !orgId) {
        throw new Error('User is not authenticated');
    }

    try {
        // Fetch sprint with project details
        const sprint = await db.sprint.findUnique({
            where: { id: sprintId },
            include: { project: true },
        });

        // Validate sprint existence and organization access
        if (!sprint) {
            throw new Error("Sprint not found");
        }

        if (sprint.project.organizationId !== orgId) {
            throw new Error("Unauthorized");
        }

        // Only allow admins
        if (orgRole !== "org:admin") {
            throw new Error('Only Admins can make this change');
        }

        const now = new Date();
        const startDate = new Date(sprint.startDate);
        const endDate = new Date(sprint.endDate);

        // Prevent starting sprint outside its range or if already completed
        if (newStatus === "ACTIVE" && (now < startDate || now > endDate)) {
            throw new Error("Cannot start sprint outside of its date range");
        }


        // Prevent completing sprint if it's not active
        if (newStatus === "COMPLETED" && sprint.status !== "ACTIVE") {
            throw new Error('Can only complete an active sprint');
        }

        // Update sprint status
        const updatedSprint = await db.sprint.update({
            where: { id: sprintId },
            data: { status: newStatus },
        });

        return { success: true, sprint: updatedSprint };
    } catch (error) {
        console.error("Error updating sprint status:", error);
        throw new Error("Failed to update sprint status. Please try again.");
    }
}
