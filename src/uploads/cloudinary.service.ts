import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class CloudinaryService {
  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    throw new NotImplementedException('Cloudinary upload is not yet implemented');
  }
}
