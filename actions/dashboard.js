"use server"

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


export const generateIndustryInsights = async (industry) => {
    const prompt = `
    Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
    {
      "salaryRanges": [
        { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
      ],
      "growthRate": number,
      "demandLevel": "High" | "Medium" | "Low",
      "topSkills": ["skill1", "skill2"],
      "marketOutlook": "Positive" | "Neutral" | "Negative",
      "keyTrends": ["trend1", "trend2"],
      "recommendedSkills": ["skill1", "skill2"]
    }
    
    IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
    Include at least 5 common roles for salary ranges.
    Growth rate should be a percentage.
    Include at least 5 skills and trends.
  `;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanTest = text.replace(/```(?:json)?\n?/g, "").trim();
    const insights = JSON.parse(cleanTest);

    // Map demandLevel and marketOutlook to Prisma enums
    const demandLevelMap = {
        "High": "HIGH",
        "Medium": "MEDIUM",
        "Low": "LOW"
    };
    const marketOutlookMap = {
        "Positive": "POSITIVE",
        "Neutral": "NEUTRAL",
        "Negative": "NEGATIVE"
    };

    return {
        ...insights,
        demandLevel: demandLevelMap[insights.demandLevel] || "MEDIUM",
        marketOutlook: marketOutlookMap[insights.marketOutlook] || "NEUTRAL"
    };
}

export async function getIndustryInsights() {
       const { userId } = await auth()
        if(!userId) {
            throw new Error("User not authenticated");
        }   
    
        const user = await db.user.findUnique({
            where: { clerkUserId: userId, },
            include: { industryInsight: true }
        });
    
    if (!user) throw new Error("User not found");
    
    if (!user.industryInsight) {
        const insights = await generateIndustryInsights(user.industry);
        
        const industryInsight = await db.industryInsight.create({
            data: {
                industry: user.industry,
                ...insights,
                nextUpdate: new Date(Date.now() +7* 24 * 60 * 60 * 1000), // 7 days  from now
            }
        })
        return industryInsight;
    }
    return user.industryInsight;
}