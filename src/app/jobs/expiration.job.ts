import { prisma } from "../config/db";
import { getIO } from "../socket";
export const startExpirationJob = () => {
     setInterval(async () => {
       const expiredReservations = await prisma.reservation.findMany({
            where: {
                   status: "RESERVED",
                    expiresAt: { lt: new Date() }
                           }
                    });

            for (const reservation of expiredReservations) {
               await prisma.$transaction(async (transaction:any) => {
               await transaction.reservation.update({
              where: { id: reservation.id },
               data: { status: "EXPIRED" }
        });

        await transaction.drop.update({
                where: { id: reservation.dropId },
                    data: { availableStock: { increment: 1 } }
        });
      });
             getIO().emit("stock:update");
    }

  }, 5000);
  console.log("Expiration job started");
};
