const jwt = require('jsonwebtoken');

const secret_key = '123456'; // Should match the secret used in your routes

// Middleware function to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'
  console.log("token",token);
  if (token == null) return res.sendStatus(401); // If no token is present, respond with 401
  jwt.verify(token, secret_key, (err, user) => {
    if (err) return res.sendStatus(403); // If token is invalid or expired, respond with 403  
    req.user = user; // Attach user info to request object
   // console.log("authorized")
    next(); // Proceed to next middleware or route handler
  });
}

module.exports = authenticateToken;
