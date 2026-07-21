import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { CloudinaryService } from './cloudinary.service';

@Module({
  providers: [UploadService, CloudinaryService],
  exports: [UploadService],
})
export class UploadModule {}
