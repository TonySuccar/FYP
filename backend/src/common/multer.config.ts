import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerOptions = {
  storage: diskStorage({
    destination: './uploads', // Ensure this folder exists or create it beforehand.
    filename: (req, file, callback) => {
      // Generate a unique filename using the current timestamp and a random number.
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileExtName = extname(file.originalname);
      callback(null, `${file.fieldname}-${uniqueSuffix}${fileExtName}`);
    },
  }),
  // Optional: set file size limits, etc.
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit files to 5MB (optional)
  },
};
