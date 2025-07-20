import jwt from "jsonwebtoken";

const protectRoute = async (req, res, next) => {
 try{
      const token =  req.headers.authorization;
      if(!token){
        return res.status(401).json({message: "Unauthorized - No Token Provided"});
        }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if(!decoded){
        return res.status(401).json({message: "Unauthorized - Invalid Token"});
      }
      next();
    } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    res.status(500).json({ messag: "Internal server error" });
  }
};

export default protectRoute;
