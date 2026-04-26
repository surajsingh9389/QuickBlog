import User from "../models/user.model.js";
import { AppError } from "../utils/AppError.js";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  // Check if user is already in the database
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError("Email is already registered", 409);
  }

  // Secure password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user record
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // Generate access token for immediate login
  const token = generateToken(user._id, user.role);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  // Find user and explicitly include hidden password field
  const user = await User.findOne({ email }).select("+password"); 
  if (!user) {
    throw new AppError("Invalid email", 401);
  }

  // Verify provided password against hashed version
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid password", 401);
  }

  // Authentication successful; provide token
  const token = generateToken(user._id, user.role);

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

