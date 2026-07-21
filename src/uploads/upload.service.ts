import { Injectable } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Injectable()
export class UploadService {
  constructor(
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async uploadImage(file: Express.Multer.File, folder: string = 'general'): Promise<string> {
    // Return the local file path since multer diskStorage already saved it
    return `/uploads/${file.filename}`;
  }
}
