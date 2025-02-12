"use server";

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
};


// Logic for getting issue for a particular sprint
export async function getIssuesForSprint(sprintId) {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        throw new Error("Unauthorized");
    }

    const issues = await db.issue.findMany({
        where: { sprintId: sprintId },
        orderBy: [{ status: "asc" }, { order: "asc" }],
        include: {
            assignee: true,
            reporter: true,
        },
    });

    return issues;
}


// Logic to handle the issue cards api calls when the cards change their indexes/ or cards are moved here and there in other columns
// we will use the concept of "Transaction" in prisma 
export async function updateIssueOrder(updatedIssues) {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        throw new Error("Unauthorized");
    }

    // Start a transaction
    await db.$transaction(async (prisma) => {
        // Update each issue
        for (const issue of updatedIssues) {
            await prisma.issue.update({
                where: { id: issue.id },
                data: {
                    status: issue.status,
                    order: issue.order,
                },
            });
        }
    });

    return { success: true };
}


// Logic to delete an issue
export async function deleteIssue(issueId) {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const issue = await db.issue.findUnique({
        where: { id: issueId },
        include: { project: true },
    });

    if (!issue) {
        throw new Error("Issue not found");
    }

    if (
        issue.reporterId !== user.id &&
        !issue.project.adminIds.includes(user.id)
    ) {
        throw new Error("You don't have permission to delete this issue");
    }

    await db.issue.delete({ where: { id: issueId } });

    return { success: true };
}

// Logic to update an issue
export async function updateIssue(issueId, data) {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        throw new Error("Unauthorized");
    }

    try {
        const issue = await db.issue.findUnique({
            where: { id: issueId },
            include: { project: true },
        });

        if (!issue) {
            throw new Error("Issue not found");
        }

        if (issue.project.organizationId !== orgId) {
            throw new Error("Unauthorized");
        }

        const updatedIssue = await db.issue.update({
            where: { id: issueId },
            data: {
                status: data.status,
                priority: data.priority,
            },
            include: {
                assignee: true,
                reporter: true,
            },
        });

        return updatedIssue;
    } catch (error) {
        throw new Error("Error updating issue: " + error.message);
    }
}