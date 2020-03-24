const jwt = require("jsonwebtoken")
const User = require("../users/users-model");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  const secret = require("../config/secrets").jwtSecret;


  if (authorization) {
    jwt.verify(authorization, secret, (err, decodedToken) => {
      if (err) {
      res.status(401).json({ message: 'Invalid Credentials' });
      }
      else {
        req.decodedToken = decodedToken;
        next();
      }
    })
  }
  else {
    res.status(400).json({message: "NO credentials provided"})
  }
};
