import { Router } from "express";
import { reserveController } from "./reservation.controller";
import { validate } from "../../middlewares/validate";
import { reserveSchema } from "./reservation.validation";

const router = Router();

  router.post("/",validate(reserveSchema), reserveController);

export default router;
