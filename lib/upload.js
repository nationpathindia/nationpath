import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export const uploadImages = async (req) => {
  const uploadDir = path.join(process.cwd(), "/public/uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    multiples: true,
    uploadDir,
    keepExtensions: true,
    maxFileSize: 2 * 1024 * 1024,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);

      const images = [];

      if (files.images) {
        const fileArray = Array.isArray(files.images)
          ? files.images
          : [files.images];

        fileArray.forEach(file => {
          images.push("/uploads/" + path.basename(file.filepath));
        });
      }

      resolve({ fields, images });
    });
  });
};