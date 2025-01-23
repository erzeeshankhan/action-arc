"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getOrganization(slug){
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
};