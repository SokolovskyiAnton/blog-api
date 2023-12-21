import * as AWS from 'aws-sdk';
import { BadRequestException, Injectable, UploadedFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileService {
  constructor(private configService: ConfigService) {}
  async save(@UploadedFile() file) {
    AWS.config.update({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_KEY'),
      region: 'us-east-1',
    });

    const fileContent = await file.buffer;
    const s3 = new AWS.S3();

    const params = {
      Bucket: 'moto-backend-nest-js',
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
      console.error(error);
      throw new BadRequestException('Bad request');
    }
  }
}
