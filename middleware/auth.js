import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

export const generateToken = (userId,role) => {
  const token = jwt.sign({ id: userId,role:role },process.env.JWT_SECRET);
  return token;
};

export const verifyTokenUser = async (req, res, next) => {
  try {
  
    let token = req.headers["authorization"];
   
    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    if(verified.role=="user"){
    next();
    }
    else{
      return res.status(403).send("Access Denied"); 
    }

    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

