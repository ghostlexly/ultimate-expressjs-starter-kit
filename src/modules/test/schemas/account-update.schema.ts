import { z } from "zod";

export const accountUpdateSchema = {
  body: z.object({
    name: z.string(),
    bookings: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    ),
  }),
};
