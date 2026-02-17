import { prisma } from "../../config/db";
import { getIO } from "../../socket";
import { AppError } from "../../utils/helper/AppError";


export const purchaseService = async (userId: string,reservationId: string) =>{

   if (!userId) {
       throw AppError.badRequest("User ID is required");
   }
 if (!reservationId) {
       throw AppError.badRequest("Reservation ID is required");
  }
  return prisma.$transaction(async (transaction) => {
const reservationRecord = await transaction.reservation.findUnique({
      where: { id: reservationId }
    });
 if (!reservationRecord || reservationRecord.userId !== userId) {
      throw AppError.badRequest("Invalid reservation");
    }
   if (reservationRecord.expiresAt < new Date()) {
  throw AppError.conflict("Reservation expired");
}
if (reservationRecord.status === "PURCHASED"){
    throw AppError.conflict("Already purchased");
}

await transaction.reservation.update({
      where: { id: reservationId },
      data: { status: "PURCHASED" }
    });

    await transaction.purchase.create({
      data: {
        userId,
        dropId: reservationRecord.dropId
      }
    });

    getIO().emit("stock:update");

  });
};
