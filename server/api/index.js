import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "../src/lib/db.js";
import adminRouter from "../src/routes/admin.routes.js";
import blogRouter from "../src/routes/blog.routes.js";


const app = express();
const PORT = process.env.PORT || 3000;

//Middleware
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);
app.use(express.json());

//Routes
app.use("/api/admin", adminRouter);
app.use("/api/blog", blogRouter);
app.get("/", (req, res) => {
  res.send("Backend is Working.");
});

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
  connectDB();
});


