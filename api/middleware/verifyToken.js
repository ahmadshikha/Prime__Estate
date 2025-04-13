// import jwt from "jsonwebtoken";

// export const verifyToken = (req, res, next) => {
//   console.log("Test token");
  
//   const token = req.cookies.token;
//   console.log("hi","wqferhgyjuyhtejmr4353yhsbwr",token);
    
//   if (!token) return res.status(401).json({ message: "Not Authenticated token!!" });
   
//   jwt.verify(token, "wqferhgyjuyhtejmr4353yhsbwr", async (err, payload) => {
//     if (err) return res.status(403).json({ message: "Token is not Valid!" });
//     req.userId = payload.id;
    
//     next();
//   });
// };



import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  console.log("Test token");

  const authHeader = req.headers.authorization; 
  const token = authHeader && authHeader.split(' ')[1];

  console.log("Token:", token);

  if (!token) return res.status(401).json({ message: "Not Authenticated token!!" });

  jwt.verify(token, "wqferhgyjuyhtejmr4353yhsbwr", (err, payload) => {
    if (err) return res.status(403).json({ message: "Token is not Valid!" });
    req.userId = payload.id;

    next();
  });
};