import { currentUser } from "@clerk/nextjs/server"
import { db } from "./prisma";

export const checkUser = async () => { 
    const user = await currentUser();

    if(!user) {
        return null;
    }

    try {
        // Find by clerkUserId, not id
        const loggedInUser = await db.user.findUnique({
            where: {
                clerkUserId: user.id
            }
        });
        if (loggedInUser) {
            return loggedInUser;
        }
        // Let Prisma generate id, and provide clerkUserId
        const newUser = await db.user.create({
            data: {
                clerkUserId: user.id,
                name: user.fullName,
                imageUrl: user.imageUrl,
                email: user.emailAddresses[0].emailAddress,
            }
        });
        return newUser;
    } catch (error) {
        console.error(error);
    }
}