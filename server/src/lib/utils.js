import jwt from "jsonwebtoken"

export const generateToken = (email, res) =>{
    const token = jwt.sign({email}, process.env.JWT_SECRET)
    return token;
}