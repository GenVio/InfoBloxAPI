import { get } from "config";

export default function(req, res, next) {
  // 401 Unauthorized
  // 403 Forbidden
  if (!get("requiresAuth")) return next();

  if (!req.user.isAdmin) return res.status(403).send("Access denied.");

  next();
};
