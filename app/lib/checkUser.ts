import { currentUser } from "@clerk/nextjs/server";
import { db } from "./db";

export const checkUser = async () => {
    const user = await currentUser();
    if (!user) {
        return null;
    }

    const loggedInUser = await db.user.findUnique({
        where: {
            clerkUserId: user.id,
        },
    });

    if (!loggedInUser) {
        // Create the user if they don't exist in the database
        const newUser = await db.user.create({
            data: {
                clerkUserId: user.id,
                name: `${user.firstName} ${user.lastName}`,
                imageUrl: user.imageUrl,
                email: user.emailAddresses[0].emailAddress,
            },
        });
        return newUser;
    }

    return loggedInUser;
}