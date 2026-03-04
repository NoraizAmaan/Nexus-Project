import mongoose from "mongoose";

const phaseSchema = mongoose.Schema(
    {
        title: { type: String, required: true },
        date: { type: String, required: true },
        status: { type: String, default: "Pending" },
        description: { type: String, required: true },
        tasks: [{ type: String }],
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

const Phase = mongoose.model("Phase", phaseSchema);

export default Phase;
