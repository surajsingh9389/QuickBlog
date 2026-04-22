// authenticate the user based on role 
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        const message = `Role ${req.user?.role || "unknown"} is not authorized to access the resource`;
        return next(new AppError(message, 403));
    }
    next();
  }
}