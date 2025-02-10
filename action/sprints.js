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
    // auth checks
    const { userId, orgId, orgRole } = auth();
    if (!userId || !orgId) {
        throw new Error('User is not authenticated');
    }

    try {
        const sprint = await db.sprint.findUnique({
            where: { id: sprintId },
            include: { project: true },
        });

        if (!sprint || sprint.project.organizationId !== orgId) {
            throw new Error('Sprint not found');
        }
        if (orgRole !== "org:admin") {
            throw new Error('Only Admins can make this change');
        }
        if (orgRole === "org:member") {
            throw new Error('You are not authorized to make this change');
        }
        const now = new Date();
        const startDate = new Date(sprint.startDate);
        const endDate = new Date(sprint.endDate);

        // if sprint is ended and user is trying to make changes to it
        if (newStatus === "ACTIVE" && (now < startDate || now > endDate)) {
            throw new Error('Cannot start sprint outside of sprint date range');
        }
        // if user is trying to complete the sprint and sprint is not active
        if(newStatus === "COMPLETED" && sprint.status !== "ACTIVE"){
            throw new Error('Can only end an active sprint');
        }

        const updatedSprint = await db.sprint.update({
            where: { id: sprintId },
            data: { status: newStatus },

        });

        return {success: true, updatedSprint};
    } catch (error) {
        throw new Error(error.message);
    }
}