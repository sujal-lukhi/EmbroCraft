import { BadRequestException } from '@nestjs/common';
import { extname } from 'path';
import { UPLOAD_CONSTANTS } from '../constants/upload.constant';

export const customFileFilter = (req: any, file: any, cb: any) => {
  if (!file.originalname.match(UPLOAD_CONSTANTS.ALLOWED_FILE_TYPES)) {
    return cb(new BadRequestException('Invalid file type! Only images and embroidery files (.dst, .pes, etc.) are allowed.'), false);
  }
  cb(null, true);
};

export const customFileName = (req: any, file: any, cb: any) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const ext = extname(file.originalname);
  cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
};
