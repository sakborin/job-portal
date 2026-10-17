import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "Please login first" });
  }

  try {
    const token = header.split(" ")[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const employerOnly = (req, res, next) => {
  if (req.user.role !== "employer") {
    return res.status(403).json({ message: "Employers only" });
  }
  next();
};