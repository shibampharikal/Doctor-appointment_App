const JWT = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        message: "No token provided",
        success: false,
      });
    }

    const token = authHeader.split(" ")[1];

    JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Auth Failed",
          success: false,
        });
      }

      // ✅ safer to attach here instead of modifying req.body
      req.user = decoded;
      req.userId = decoded.id;
      next();
    });
  } catch (error) {
    console.log("Auth Middleware Error:", error);
    res.status(401).send({
      message: "Auth Failed",
      success: false,
    });
  }
};
