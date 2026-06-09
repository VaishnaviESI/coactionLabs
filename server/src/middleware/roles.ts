import type { Request, Response, NextFunction } from "express";

/**
 * Gate a route to admins only. Must run after `jwtVerify` has populated
 * req.user. Returns 401 if unauthenticated, 403 if not an admin.
 */
export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  if (!req.user.isAdmin) {
    res.status(403).json({ error: "Admin privileges required" });
    return;
  }
  next();
}
