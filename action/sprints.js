"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function createSprint( projectId, data ) {


    // check if the user is authenticated
    const { userId, orgId } = auth();
    if ( !userId || !orgId ) {
        throw new Error('User is not authenticated');
    }

    const project = await db.project.findUnique({
        where: {
            id: projectId
        },
    });

    if (!project || project.organizationid !== orgId) {
        return null;
    }


    // create a new sprint
    const sprint = await db.sprint.create({
        data: {
            name: data.name,
            startDate: data.startDate,
            endDate: data.endDate,
            status: "PLANNED",
            projectId,
        }
    });

    return sprint;

}