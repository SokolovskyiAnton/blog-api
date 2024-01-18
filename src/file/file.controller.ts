import {
  Body,
  Controller,
  Delete,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/file/file.service';
import { FileResponseInterface } from 'src/file/types/fileResponse.interface';
import { DeleteFileDto } from 'src/file/dto/deleteFile.dto';
import { PromiseResult } from 'aws-sdk/lib/request';
import { AWSError, S3 } from 'aws-sdk';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}
  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any): Promise<FileResponseInterface> {
    return await this.fileService.save(file);
  }
  @Delete()
  @UseGuards(AuthGuard)
  async deleteFile(
    @Body() deleteFileDto: DeleteFileDto,
  ): Promise<PromiseResult<S3.DeleteObjectOutput, AWSError>> {
    return await this.fileService.deleteImage(deleteFileDto);
  }
}
