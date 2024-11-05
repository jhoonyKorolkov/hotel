import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

export const storageConfig = diskStorage({
  destination: (req, file, callback) => {
    const uploadPath = './uploads';

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    callback(null, uploadPath);
  },
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});
