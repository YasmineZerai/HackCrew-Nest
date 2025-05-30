import { Injectable } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const profilePictureMulterConfig = {
  storage: diskStorage({
    destination: './uploads/profile-pictures',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileExt = extname(file.originalname);
      const fileName = `profile-${uniqueSuffix}${fileExt}`;
      callback(null, fileName);
    },
  }),
};

export const profilePictureFileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
    return callback(
      new Error('Only image files are allowed (jpg, jpeg, png)'),
      false,
    );
  }
  callback(null, true);
};

@Injectable()
export class ProfilePictureUploadInterceptor extends FileInterceptor('file', {
  storage: profilePictureMulterConfig.storage,
  fileFilter: profilePictureFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}) {}
