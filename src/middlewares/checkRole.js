export const checkRole = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Unauthorized: No user info found" });
      }

      const userRole = req.user.role;

      // const userRole = req.user.role?.toLowerCase();
      // const allowed = allowedRoles.map((r) => r.toLowerCase());

      // Check if user's role is in the allowed list

      {
        /*
          if (!allowed.includes(userRole)) {
        return res.status(403).json({ message: "Forbidden: Access denied" });
      }

        
        */
      }
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: "Forbidden: Access denied" });
      }

      next();
    } catch (error) {
      console.error("🚫 Role check error:", error);
      res
        .status(500)
        .json({ message: "Server error during role verification" });
    }
  };
};