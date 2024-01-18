import { BadRequestException, Injectable, UploadedFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AWSError, S3 } from 'aws-sdk';
import { FileResponseInterface } from 'src/file/types/fileResponse.interface';
import { DeleteFileDto } from 'src/file/dto/deleteFile.dto';
import { PromiseResult } from 'aws-sdk/lib/request';
@Injectable()
export class FileService {
  s3 = new S3({
    credentials: {
      accessKeyId: this.configService.get<string>('AWS_ACCESS_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_KEY'),
    },
  });
  constructor(private configService: ConfigService) {}
  async save(@UploadedFile() file): Promise<FileResponseInterface> {
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
      const uploadedFile = await this.s3.upload(params).promise();
      return { url: uploadedFile.Location, key: uploadedFile.Key };
    } catch (error) {
      throw new BadRequestException('Bad request');
    }
  }
  async deleteImage(
    deleteFileDto: DeleteFileDto,
  ): Promise<PromiseResult<S3.DeleteObjectOutput, AWSError>> {
    const params = {
      Bucket: this.configService.get<string>('AWS_BUCKET'),
      Key: deleteFileDto.key,
    };
    try {
      return await this.s3.deleteObject(params).promise();
    } catch (error) {
      throw new BadRequestException('Bad request');
    }
  }
}
