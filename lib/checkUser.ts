import { currentUser } from "@clerk/nextjs/server";
import { db } from "./db";

export const checkUser = async () => {
    try {
        console.log('🔍 checkUser: Starting user authentication check...');
        
        const user = await currentUser();
        if (!user) {
            console.log('❌ checkUser: No user found from Clerk authentication');
            return null;
        }

        console.log(`✅ checkUser: User authenticated - ID: ${user.id}, Name: ${user.firstName} ${user.lastName}`);

        try {
            const loggedInUser = await db.user.findUnique({
                where: {
                    clerkUserId: user.id,
                },
            });

            if (!loggedInUser) {
                console.log('📝 checkUser: User not found in database, creating new user record...');
                
                try {
                    const newUser = await db.user.create({
                        data: {
                            clerkUserId: user.id,
                            name: `${user.firstName} ${user.lastName}`,
                            imageUrl: user.imageUrl,
                            email: user.emailAddresses[0].emailAddress,
                        },
                    });
                    console.log(`✅ checkUser: New user created successfully - DB ID: ${newUser.id}`);
                    return newUser;
                } catch (createError) {
                    console.error('❌ checkUser: Failed to create new user in database:', createError);
                    throw createError;
                }
            }

            console.log(`✅ checkUser: Existing user found in database - DB ID: ${loggedInUser.id}`);
            return loggedInUser;
        } catch (dbError) {
            console.error('❌ checkUser: Database operation failed:', dbError);
            throw dbError;
        }
    } catch (error) {
        console.error('❌ checkUser: Unexpected error during user check:', error);
        throw error;
    }
}