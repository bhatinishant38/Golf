// import multer from "multer";

// const storage = multer.diskStorage({
  
//   filename: function (req, file, callback) {
//     callback(null, file.originalname);
//   },
// });

// export const upload = multer({ storage });
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads folder exists - REQUIRED for diskStorage
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  // FIX 1: ADD DESTINATION - you were missing this, causes JPG to fail
  destination: function (req, file, callback) {
    callback(null, uploadDir);
  },
  filename: function (req, file, callback) {
    // FIX 2: DON'T use originalname directly - causes overwrite & security issue
    // Use unique name + keep .jpg extension
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase(); // keeps .jpg, .jpeg
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, "-");
    callback(null, `${baseName}-${unique}${ext}`);
  },
});

// FIX 3: ADD fileFilter to explicitly allow JPG, JPEG, PNG, WEBP
const fileFilter = (req, file, callback) => {
  const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
  const allowedExts = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  const ext = path.extname(file.originalname).toLowerCase();

  // Check mime type OR extension (extension fallback fixes JPG with empty mime)
  if (
    file.mimetype.startsWith("image/") ||
    allowedMimes.includes(file.mimetype.toLowerCase()) ||
    allowedExts.includes(ext)
  ) {
    callback(null, true); // Accept JPG ✓
  } else {
    callback(new Error(`Only JPG, JPEG, PNG, WEBP allowed. Got ${file.mimetype} ${ext}`), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB - matches frontend
  },
});


