import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]},
    password: { type: String, required: true, minlength: 8, select: false},
    role: { type: String, enum: ["admin", "user"], default: "user" }
}, { timestamps: true });

const User = mongoose.model("user", userSchema);
export default User;