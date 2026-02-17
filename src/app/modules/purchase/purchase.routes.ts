import { Router } from "express";
import { purchaseController } from "./purchase.controller";
import { validate } from "../../middlewares/validate";
import { purchaseSchema } from "./purchase.validation";

const router = Router();

router.post("/",validate(purchaseSchema), purchaseController);

export default router;
