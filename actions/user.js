"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { generateIndustryInsights } from "./dashboard";


export async function UpdateUser(data) { 
    const { userId } = await auth()
    if(!userId) {
        throw new Error("User not authenticated");
    }   

    const user = await db.user.findUnique({
        where: { clerkUserId: userId,},
    });

    if (!user) throw new Error("User not found");
    

    try {
        const result = await db.$transaction(
            async (tx) => {
                //find if industry exists
                let industryInsight = await tx.industryInsight.findUnique({
                    where: { industry: data.industry },
                })
                //If industry does not exist, create it with default values
                if(!industryInsight) {
                   const insights = await generateIndustryInsights(data.industry);
                           
                            industryInsight = await db.industryInsight.create({
                               data: {
                                   industry: data.industry,
                                   ...insights,
                                   nextUpdate: new Date(Date.now() +7* 24 * 60 * 60 * 1000), // 7 days  from now
                               }
                           })
                }
                //update user with new data
                const updatedUser = await tx.user.update({
                    where: { id: user.id },
                    data: {
                        industry: data.industry,
                        experience: data.experience,
                        bio: data.bio,
                        skills: Array.isArray(data.skills) ? data.skills : data.skills?.split(',').map(s => s.trim()).filter(Boolean),
                    },
                });
                return { user: updatedUser, industryInsight };
        }, {
            timeout:10000,
        })
       return {succes:true , ...result};

    } catch (error) {
        console.error("Error updating user and industry :", error.message);
        throw new Error("Failed to update user profile"+ error.message);
    }
}


export async function getUserOnboardingStatus() { 
    const { userId } = await auth()
    if(!userId) {
        throw new Error("User not authenticated");
    }   

    const user = await db.user.findUnique({
        where: { clerkUserId: userId,},
    });

    if (!user) throw new Error("User not found");

    try {
        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
            select: { industry: true, }
        })
    return{ isOnboarded:!!user.industry, };

    }catch (error) {
        console.error("Error checking onboarding status:", error.message);
        throw new Error("Failed to check onboarding status");
    }
}