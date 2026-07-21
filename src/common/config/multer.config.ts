import { diskStorage } from 'multer';
import { customFileFilter, customFileName } from '../helpers/file.helper';
import { UPLOAD_CONSTANTS } from '../constants/upload.constant';
import * as fs from 'fs';

const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

export const multerOptions = {
  storage: diskStorage({
    destination: uploadDir,
    filename: customFileName,
  }),
  fileFilter: customFileFilter,
  limits: {
    fileSize: UPLOAD_CONSTANTS.MAX_FILE_SIZE,
  },
};
