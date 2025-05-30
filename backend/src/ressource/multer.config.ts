import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileExt = extname(file.originalname);
      const title = req.body?.title || 'file';
      const sanitizedTitle = title
        .replace(/[^a-zA-Z0-9-_]/g, '-')
        .toLowerCase();
      const fileName = `${sanitizedTitle}-${uniqueSuffix}${fileExt}`;
      callback(null, fileName);
    },
  }),
};

export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf|txt)$/)) {
    return callback(
      new Error('Only image, pdf and txt files are allowed'),
      false,
    );
  }
  callback(null, true);
};
