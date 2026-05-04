import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload function
const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) {
      throw new Error("File path is required");
    }

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    // Cleanup local file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }   
    return result;
  } catch (error) {
    // cleanup if error
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    console.error("Cloudinary error:", error);
    return null;
  }
};

export { uploadOnCloudinary };