import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/file/file.service';
import { FileResponseInterface } from 'src/file/types/fileResponse.interface';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}
  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any): Promise<FileResponseInterface> {
    return await this.fileService.save(file);
  }
}
