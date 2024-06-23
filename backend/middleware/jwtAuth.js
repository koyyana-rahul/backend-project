const JWT = require('jsonwebtoken');

const jwtAuth = (req, res, next) => {
     //code
     //verify token
     //inject user info in req
     const token = (req.cookies && req.cookies.token) || null;

     if(!token) {
          return res.status(400).json({
               success: false,
               message: "Not Authorized"
          })
     }

     try {

          const payload = JWT.verify(token, process.env.SECRET);
          req.user = {id: payload.id, email: payload.email};

     }catch (e) {
          return res.status(400).json({
               success: false,
               message: e.message
          })
     }
     next();

};

module.exports = jwtAuth;


