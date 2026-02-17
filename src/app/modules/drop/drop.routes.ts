import { Router } from "express";
import { createDropController, getDropsController} from "./drop.controller";
import { validate } from "../../middlewares/validate";
import { createDropSchema } from "./drop.validation";

const router = Router();
router.post("/",validate(createDropSchema), createDropController);

router.get("/", getDropsController);

export default router;
