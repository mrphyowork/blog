const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
  try {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
      await jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: "User is not authorized!" });
        }
        req.user = decoded.user;
        return res.status(200).json(token);
        next();
      });
    } else {
      return res
        .status(401)
        .json({ message: "User is not authorized or token is missing!" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = validateToken;
