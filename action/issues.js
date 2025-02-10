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

    const lastIssue = await db.issue.findFirst({
        where: { projectId, status: data.status },
        // order by the order in descending order
        orderBy: { order: "desc" },
    });

    // get the order of the last issue and increment it by 1
    // if there is no issue then the order will be 0
    const newOrder = lastIssue ? lastIssue.order + 1 : 0;

    // create the new issue
    const issue = await db.issue.create({
        data: {
            title: data.title, // title of the issue
            description: data.description, // description of the issue
            status: data.status, // status of the issue
            priority: data.priority, // priority of the issue
            projectId: projectId, // project id of the issue
            sprintId: data.sprintId, // sprint id of the issue
            reporterId: user.id, // reporter id of the issue/ user id of the user who created the issue
            assigneeId: data.assigneeId || null, // assignee id of the issue
            order: newOrder, // order of the issue
        },
        // this will include the assignee and reporter details instantly
        include: {
            assignee: true,
            reporter: true,
        }
    });
    // return the created issue
    return issue;
}