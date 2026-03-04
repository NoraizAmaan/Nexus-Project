import mongoose from "mongoose";

const activitySchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        userName: {
            type: String,
            required: true,
        },
        action: {
            type: String,
            required: true,
        },
        targetType: {
            type: String,
            required: true,
        },
        targetName: {
            type: String,
            required: true,
        },
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

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
