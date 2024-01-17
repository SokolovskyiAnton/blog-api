import { BadRequestException, Injectable, UploadedFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { FileResponseInterface } from 'src/file/types/fileResponse.interface';
@Injectable()
export class FileService {
  constructor(private configService: ConfigService) {}
  async save(@UploadedFile() file): Promise<FileResponseInterface> {
    const s3 = new S3({
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_ID'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_KEY'),
      },
    });

    const fileContent = await file.buffer;

    const params = {
      Bucket: this.configService.get<string>('AWS_BUCKET'),
      Key: file.originalname,
      Body: fileContent,
      ACL: 'public-read',
      ContentType: 'text/plain; charset=UTF-8',
    };
    // Upload file to S3
    try {
      const uploadedFile = await s3.upload(params).promise();
      return { url: uploadedFile.Location, key: uploadedFile.Key };
    } catch (error) {
      throw new BadRequestException('Bad request');
    }
  }
}
