import multer from "multer";

// Use memory storage so files are held as buffers in memory
// and uploaded directly to Cloudinary without writing to local disk.
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size limit
  },
});

export default upload;
