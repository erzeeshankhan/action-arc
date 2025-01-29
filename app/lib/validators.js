// This file contains the schema for the react hook form 


import { z } from "zod";

export const projectSchema = z.object({
    name: z
        .string()
        .min(1, "Project name is required")
        .max(100, "project name must be <100"),

    key: z
        .string()
        .min(2, "Project key must be atleast 2 charecters")
        .max(10, "Project key must be 10 charecters or less"),

    descriptiom: z
        .string()
        .max(500, "Project key must be 500 charecters or less")
        .optional(),
});


export const sprintSchema = z.object({
    name: z
        .string()
        .min(1, "Sprint name is required")
        .max(100, "project name must be <100"),

    startDate: z.date(),
    endDate: z.date(),

}); 