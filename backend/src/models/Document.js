import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        extension: {
            type: String,
            required: true,
        },
        size: {
            type: Number,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        public_id: {
            type: String,
            required: true,
        },
        resourceType: {
            type: String,
            required: true,
            default: "auto"
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Document = mongoose.model("Document", documentSchema);

export default Document;
