import { z } from 'zod';
export const OnboardingSchema = z.object({
    industry: z.string({
       required_error: 'Industry is required',
    }),
    subIndustry: z.string({
         required_error: 'Sub industry is required',    
    }),
    bio: z.string().max(500).optional(),
    experience: z.string().transform((val) => parseInt(val, 10)).pipe(
        z.number().min(0, "Experience must be a non-negative number").
            max(50, "Experience must be less than or equal to 50 years")
    ),
    skills: z.string().transform((val)=> val?val.split(',').map(skill => skill.trim()).filter(Boolean):undefined), 
})