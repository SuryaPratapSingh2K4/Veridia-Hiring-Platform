export const verifyAdminOnly = (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Not Authenticated" });
    if (!req.user.role)
        return res.status(401).json({ message: "Only Admins are allowed" });
    next();
};
