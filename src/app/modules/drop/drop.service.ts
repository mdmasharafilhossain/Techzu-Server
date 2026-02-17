import { prisma } from "../../config/db";
import { AppError } from "../../utils/helper/AppError";
import { createDropSchema } from "./drop.validation";

export const createDropService = async (dropPayload: unknown) => {
  const parsedData = createDropSchema.safeParse(dropPayload);
  if (!parsedData.success) {
    throw AppError.badRequest(parsedData.error.issues[0].message);
  }
  const validatedDropData = parsedData.data;
 return prisma.drop.create({
   
    data: {
      ...validatedDropData,
      availableStock: validatedDropData.totalStock
    }
  });
};



export const getDropsService = async () => {
  const drops = await prisma.drop.findMany({
    include: { purchases: {
        take: 3,
        orderBy: { createdAt: "desc" },
        include: { user: true }
      }
    }
  });

  return drops;
};
