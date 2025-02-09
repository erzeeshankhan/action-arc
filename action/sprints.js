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