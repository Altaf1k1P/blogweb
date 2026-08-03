import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import { logger } from "../utils/logger.js";

export const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) return null;

  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: "blog_images",
      resource_type: "auto",
      quality: "auto:good",
      width: 800,
      crop: "scale",
    });
    // Remove local file
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return { url: response.secure_url, public_id: response.public_id };
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    logger.error(`Cloudinary Upload Error: ${error.message}`);
    return null;
  }
};

export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    logger.error(`Cloudinary Deletion Error: ${error.message}`);
  }
};
