const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cấu hình multer-storage-cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "websitUpload/product",
    allowed_formats: ["jpeg", "jpg", "png", "gif", "webp"],
    public_id: (req, file) => {
      // Loại bỏ đuôi mở rộng từ originalname
      // Date.now().toString() + "-" + file.originalname, // Tạo tên file duy nhất
      const nameWithoutExt = file.originalname
        .split(".")
        .slice(0, -1)
        .join(".");
      return `${Date.now()}-${nameWithoutExt}`;
    },
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
