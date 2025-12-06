import multer from "multer";
import path from "path";
import fs from "fs";

// Créer le dossier uploads/avatars s'il n'existe pas
const uploadDir = path.join(process.cwd(), "uploads", "avatars");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Config multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) cb(null, true);
    else cb(new Error("Only images are allowed"));
  },
});
