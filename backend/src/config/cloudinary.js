import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

// Bypass SSL certificate issues in local development environment
if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const originalName = file.originalname;
        const extension = path.extname(originalName).toLowerCase(); // includes the dot
        const nameWithoutExt = path.basename(originalName, extension);

        // Sanitize name: remove spaces and special characters
        const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_');
        const timestamp = Date.now();

        // PDFs and Images are treated by Cloudinary as 'image' resource_type when using 'auto'
        // Cloudinary automatically appends the extension for 'image' types
        // For 'raw' types (docs, excel, etc), we must include the extension in the public_id
        const isImageOrPdf = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".pdf"].includes(extension);

        return {
            folder: "ascendion_documents",
            resource_type: "auto",
            public_id: isImageOrPdf
                ? `${sanitizedName}_${timestamp}`
                : `${sanitizedName}_${timestamp}${extension}`,
            access_mode: 'public'
        };
    },
});

const profileStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "portal_user_profiles",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ width: 200, height: 200, crop: "fill" }],
    },
});

export { cloudinary, storage, profileStorage };
