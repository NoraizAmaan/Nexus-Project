import Document from "../models/Document.js";
import { cloudinary } from "../config/cloudinary.js";
import path from "path";
import { logActivity } from "../utils/activityLogger.js";

// @desc    Upload a document
// @route   POST /api/documents
// @access  Private
export const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const { projectId } = req.body;
        if (!projectId) {
            return res.status(400).json({ message: "Project ID is required" });
        }

        const fileExtension = path.extname(req.file.originalname).substring(1).toLowerCase();

        const newDocument = new Document({
            name: req.file.originalname,
            extension: fileExtension,
            size: req.file.size,
            url: req.file.path, // Cloudinary URL
            public_id: req.file.filename, // Cloudinary public_id
            resourceType: req.file.resource_type || "auto", // Store exact resource type from Cloudinary
            project: projectId,
            uploadedBy: req.user._id,
        });

        const savedDocument = await newDocument.save();

        // Populate uploader details before sending back
        const populatedDoc = await Document.findById(savedDocument._id).populate("uploadedBy", "name email");

        await logActivity(
            req.user._id,
            req.user.name,
            "uploaded file",
            "Document",
            savedDocument.name,
            projectId
        );

        res.status(201).json(populatedDoc);
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Server error during upload" });
    }
};

// @desc    Get all documents for a project
// @route   GET /api/documents/:projectId
// @access  Private
export const getProjectDocuments = async (req, res) => {
    try {
        const { projectId } = req.params;
        const documents = await Document.find({ project: projectId })
            .populate("uploadedBy", "name email")
            .sort({ createdAt: -1 });

        res.json(documents);
    } catch (error) {
        console.error("Fetch docs error:", error);
        res.status(500).json({ message: "Server error fetching documents" });
    }
};

// @desc    Delete a document
// @route   DELETE /api/documents/:id
// @access  Private
export const deleteDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }

        // Determine correct resource_type for Cloudinary
        let rType = document.resourceType;
        if (rType === "auto") {
            const isImageOrPdf = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".pdf"].includes("." + document.extension.toLowerCase());
            rType = isImageOrPdf ? "image" : "raw";
        }

        // Delete from Cloudinary using the determined or stored resource type
        const cloudinaryRes = await cloudinary.uploader.destroy(document.public_id, {
            resource_type: rType || "image"
        });

        const docName = document.name;
        const projectId = document.project;

        // Delete from Database
        await Document.findByIdAndDelete(req.params.id);

        await logActivity(
            req.user._id,
            req.user.name,
            "deleted file",
            "Document",
            docName,
            projectId
        );

        res.json({ message: "Document removed" });
    } catch (error) {
        console.error("Delete error detailed:", error);
        res.status(500).json({ message: "Server error deleting document" });
    }
};
