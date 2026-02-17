import { Request, Response, NextFunction } from "express";
import { purchaseService } from "./purchase.service";
import { purchaseSchema } from "./purchase.validation";
import { AppError } from "../../utils/helper/AppError";

export const purchaseController = async (req: Request,res: Response,next: NextFunction
) => {
  try {
    const parsedData = purchaseSchema.safeParse(req.body);
    if (!parsedData.success) {
      return next(AppError.badRequest(parsedData.error.issues[0].message));
    }
const { userId, reservationId } = parsedData.data;
 await purchaseService(userId, reservationId);

    res.status(200).json({
      success: true,
      message: "Purchased successfully"
    });

  } catch (error) {
    next(error);
  }
};
