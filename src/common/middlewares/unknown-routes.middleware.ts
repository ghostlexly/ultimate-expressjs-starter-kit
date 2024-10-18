import { Response, Request } from "express";

/**
 * For all other undefined routes, we return an error
 */
export const unknownRoutesMiddleware = (req: Request, res: Response) => {
  return res.status(404).json({ message: `This page does not exist.` });
};
