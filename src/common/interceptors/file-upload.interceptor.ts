// import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { extname } from 'path';
// import * as fs from 'fs';

// export function FileUploadInterceptor() {
//   return FileInterceptor('file', {
//     storage: diskStorage({
//       destination: (req, file, callback) => {
//         const uploadPath = './uploads';

//         // Проверка и создание папки
//         if (!fs.existsSync(uploadPath)) {
//           fs.mkdirSync(uploadPath, { recursive: true });
//         }

//         callback(null, uploadPath);
//       },
//       filename: (req, file, callback) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//         const ext = extname(file.originalname);
//         callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
//       },
//     }),
//     limits: { fileSize: 5 * 1024 * 1024 }, // Ограничение размера файла (5 MB)
//     fileFilter: (req, file, callback) => {
//       if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
//         return callback(new Error('Only image files are allowed!'), false);
//       }
//       callback(null, true);
//     },
//   });
// }
