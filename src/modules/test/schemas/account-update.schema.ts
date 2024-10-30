import { z } from "zod";

export const accountUpdateSchema = z.object({
  name: z.string(),
  bookings: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
});
