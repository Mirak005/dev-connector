const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSecret = config.get("jwtSecret");

module.exports = function(req, res, next) {
  //Get token from the header
  const token = req.header("x-auth-token");

  //Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token , authorization denied" });
  }

  //Verify token
  try {
    const decoded = jwt.verify(token, jwtSecret);

    req.user = decoded.user;
    next();
    
  } catch (error) {
    res.status(401).json({ msg: "token is not valid " });
  }
};
