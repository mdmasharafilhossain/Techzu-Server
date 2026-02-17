import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { reserveSchema } from "./reservation.validation";
import { AppError } from "../../utils/helper/AppError";
import { reserveService } from "./reservation.service";

export const reserveController = async (req: Request, res: Response, next: NextFunction
) => {
    try {
        const parsedData = reserveSchema.safeParse(req.body);

        if (!parsedData.success) {
            return next(AppError.badRequest(parsedData.error.issues[0].message));
        }
        const { userId, dropId } = parsedData.data;
        const result = await reserveService(userId, dropId);

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        next(error);
    }
};
