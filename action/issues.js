// All the actions related to issues are defined here

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function createIssue(projectId, data) {
    // Auth checks
    const { userId, orgId } = auth();
    if (!userId || !orgId) {
        throw new Error('User is not authenticated');
    }
    // create the info for user from our db
    let user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });


}