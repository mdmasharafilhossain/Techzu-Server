import z from "zod";

export const reserveSchema = z.object({

    userId: z.string().min(1, "User ID is required"),
    dropId: z.string().min(1, "Drop ID is required"),
});