export const validateUser = (req, res, next) => {
  const { email, password, role_id, is_active } = req.body;

  const errors = [];

  if (!email || typeof email !== "string" || email.trim().length === 0) {
    errors.push("email is required and must be a valid string");
  }

  if (password && password.length < 6) {
    errors.push("password must be at least 6 characters");
  }

  if (role_id && isNaN(role_id)) {
    errors.push("role_id must be a number");
  }

  if (is_active !== undefined && ![0,1,'0','1'].includes(is_active)) {
    errors.push("is_active must be 0 or 1");
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next(); // ✔ Continue to controller
};
