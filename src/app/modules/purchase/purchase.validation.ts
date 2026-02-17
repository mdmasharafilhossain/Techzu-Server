import z from "zod";

export const purchaseSchema = z.object({
    
    userId: z.string().min(1, "User ID is required"),
    reservationId: z.string().min(1, "Reservation ID is required"),
});