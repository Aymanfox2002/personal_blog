import type { Request, Response, NextFunction } from "express";

// Middleware to check if the user is authenticated
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.userName) {
    // if we don't put next() here, the request will be left hanging and the client will never receive a response
    next();
  } else {
    res.status(401).send("Access Denied: Please log in first.");
  }
};