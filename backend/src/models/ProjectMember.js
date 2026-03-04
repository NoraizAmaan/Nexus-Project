import mongoose from "mongoose";

const memberSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        role: { type: String, required: true },
        email: { type: String, required: true },
        status: { type: String, default: "Active" },
        type: { type: String, default: "Internal" }, // Internal vs External
        budget: { type: String, default: "$0/hr" },
        projects: { type: Number, default: 0 },
        expiresIn: { type: String, default: "" },
        expirationDate: { type: String, default: "" },
        roles: [{ type: String }], // Array of specific roles (Developer, Lead, etc)
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Project",
        },
    },
    {
        timestamps: true,
    }
);

const ProjectMember = mongoose.model("ProjectMember", memberSchema);

export default ProjectMember;
