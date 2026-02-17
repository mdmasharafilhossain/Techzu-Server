import { prisma } from "../../config/db";
import { getIO } from "../../socket";
import { AppError } from "../../utils/helper/AppError";


export const reserveService = async (userId: string, dropId: string) => {
    if (!userId) {
        throw AppError.badRequest("User ID is required");
    }
    if (!dropId) {
        throw AppError.badRequest("Drop ID is required");
    }
    return prisma.$transaction(async (transaction: any) => {
        const dropRecords: any = await transaction.$queryRawUnsafe(
            `SELECT * FROM "Drop" WHERE id = $1 FOR UPDATE`,
            dropId
        );
        if (!dropRecords.length || dropRecords[0].availableStock <= 0) {
            throw AppError.conflict("Item is out of stock");
        }
        await transaction.drop.update({
            where: { id: dropId },
            data: { availableStock: { decrement: 1 } }
        });

        const reservation = await transaction.reservation.create({
            data: {
                userId,
                dropId,
                expiresAt: new Date(Date.now() + 60000)
            }
        });

        getIO().emit("stock:update");

        return reservation;
    });
};
