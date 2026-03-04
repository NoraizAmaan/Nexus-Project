import mongoose from "mongoose";

const projectSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        status: {
            type: String,
            enum: ["Active", "Archived", "On Hold"],
            default: "Active",
        },
        privacy: {
            type: String,
            enum: ["Public", "Private"],
            default: "Private",
        },
        repository: { type: String },
    },
    {
        timestamps: true,
    }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
