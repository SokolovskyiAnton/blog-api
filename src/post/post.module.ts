import { Module } from '@nestjs/common';
import { PostService } from 'src/post/post.service';
import { PostController } from 'src/post/post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'src/shared/shared.module';
import { PostEntity } from 'src/post/post.entity';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [TypeOrmModule.forFeature([PostEntity]), SharedModule],
})
export class PostModule {}
