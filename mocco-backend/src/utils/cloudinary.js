import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: (process.env.CLOUDINARY_CLOUD_NAME || "").trim(),
  api_key: (process.env.CLOUDINARY_API_KEY || "").trim(),
  api_secret: (process.env.CLOUDINARY_API_SECRET || "").trim(),
});

/**
 * Upload a file (multer file object with buffer or path) to Cloudinary.
 * @param {Object} file - Multer file object (file.buffer or file.path)
 * @param {String} folder - Target Cloudinary folder name (e.g. "mocco/users")
 * @returns {Promise<{ public_id: string, url: string }>}
 */
export const uploadToCloudinary = async (file, folder = "mocco/general") => {
  if (!file) return null;

  return new Promise((resolve, reject) => {
    // If file has a path (disk storage fallback)
    if (file.path) {
      cloudinary.uploader.upload(
        file.path,
        { folder, resource_type: "auto" },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }
      );
    } else if (file.buffer) {
      // Memory storage: upload stream
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: "auto" },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }
      );
      uploadStream.end(file.buffer);
    } else {
      reject(new Error("File has neither buffer nor path for upload."));
    }
  });
};

/**
 * Delete an asset from Cloudinary by its public_id.
 * Ignores default/dummy placeholders.
 * @param {String} public_id
 */
export const deleteFromCloudinary = async (public_id) => {
  if (
    !public_id ||
    typeof public_id !== "string" ||
    public_id === "default-avatar" ||
    public_id === "shop-avatar" ||
    public_id.startsWith("http") ||
    public_id.startsWith("/")
  ) {
    return null;
  }

  try {
    const res = await cloudinary.uploader.destroy(public_id);
    return res;
  } catch (error) {
    console.error(`Failed to delete Cloudinary asset (${public_id}):`, error);
    return null;
  }
};

export default cloudinary;
