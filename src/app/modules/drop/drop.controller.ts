import { Request, Response, NextFunction } from "express";
import { createDropService, getDropsService } from "./drop.service";
import { createDropSchema } from "./drop.validation";
import { AppError } from "../../utils/helper/AppError";

export const createDropController = async ( req: Request, res: Response, next: NextFunction
) => {
  try {
    
    const result = await createDropService(req.body);
    res.status(201).json({
      success: true,
      data: result
    });

  } catch (error: any) {

    if (error.name === "ZodError") {
      return next(AppError.badRequest(error.errors[0].message));
    }

    next(error);
  }
};



export const getDropsController = async (_req: Request,res: Response,next: NextFunction
) => {
  try { const result = await getDropsService();
  
    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    next(error);
  }
};
