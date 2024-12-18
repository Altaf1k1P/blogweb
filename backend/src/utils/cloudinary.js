import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload File to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) return null;

  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: "blog_images",
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    return { url: response.secure_url, public_id: response.public_id };
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.error(`Cloudinary Upload Error: ${error.message}`);
    return null;
  }
};

// Delete File from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(`Cloudinary Deletion Error: ${error.message}`);
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
