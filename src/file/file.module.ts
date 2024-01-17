import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from 'src/file/file.controller';

@Module({
  providers: [FileService],
  exports: [FileService],
  controllers: [FileController],
})
export class FileModule {}
