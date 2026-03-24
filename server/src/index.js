import "dotenv/config";
import dns from 'dns'

if(process.env.NODE_ENV == 'development'){
 dns.setServers(['8.8.8.8', '8.8.4.4']);
}

import express from "express";
import cors from "cors";
import connectDB from "./lib/db.js";
import adminRouter from "./routes/admin.routes.js";
import blogRouter from "./routes/blog.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

const app = express();
const PORT = process.env.PORT || 3000;

// Connect DB
await connectDB();

//Middleware
app.use(cors());

app.use(helmet());
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use(express.json());

//Routes
app.use("/api/admin", adminRouter);
app.use("/api/blogs", blogRouter);
app.get("/", (req, res) => {
  res.status(200).json({
  success: true,
  message: "API is running",
});
});

// Error Handler Middleware 
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});


