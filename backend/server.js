import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import passport from "passport";
import configurePassport from "./src/config/passport.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import memberRoutes from "./src/routes/memberRoutes.js";
import phaseRoutes from "./src/routes/phaseRoutes.js";
import projectRoutes from "./src/routes/projectRoutes.js";
import documentRoutes from "./src/routes/documentRoutes.js";
import activityRoutes from "./src/routes/activityRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
configurePassport();

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/phases", phaseRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/activities", activityRoutes);

app.get("/", (req, res) => {
    res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
