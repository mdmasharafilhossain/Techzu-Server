import { z } from "zod";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";

dayjs.extend(customParseFormat);
export const createDropSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name cannot exceed 100 characters")
        .trim(),
    price: z
        .number()
        .positive("Price must be greater than 0")
        .max(1000000, "Price is too large"),
    totalStock: z
        .number()
        .int("Stock must be an integer")
        .positive("Stock must be greater than 0")
        .max(100000, "Stock is too large"),
   startsAt: z
    .string()
    .transform((value) => {
      const parsed = dayjs(value, "DD-MM-YYYY, hh:mm A");

      if (!parsed.isValid()) {
        throw new Error("Invalid date format");
      }

      return parsed.toDate();
    })
    .refine((date) => date >= new Date(), {
      message: "Start date cannot be in the past"
    })

});
