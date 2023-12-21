import * as AWS from 'aws-sdk';
import { BadRequestException, Injectable, UploadedFile } from '@nestjs/common';
@Injectable()
export class FileService {
  async save(@UploadedFile() file) {
    AWS.config.update({
      accessKeyId: 'AKIASRYFAFUBVVHD6V4J',
      secretAccessKey: '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',
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
