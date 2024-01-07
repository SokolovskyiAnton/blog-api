import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { PostService } from 'src/post/post.service';

import { AuthGuard } from 'src/auth/guards/auth.guard';
import { User } from 'src/auth/decorators/user.decorator';
import { PostEntity } from 'src/post/post.entity';
import { CreatePostDto } from 'src/post/dto/createPost.dto';
import { UserEntity } from 'src/user/user.entity';
import { UpdatePostDto } from 'src/post/dto/updatePost.dto';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
export class PostController {
  constructor(private readonly postService: PostService) {}
  @Post()
  @UseGuards(AuthGuard)
  async createPost(
    @User() user: UserEntity,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostEntity> {
    return await this.postService.createPost(user, createPostDto);
  }

  @Get()
  async getAll(): Promise<Array<PostEntity>> {
    return await this.postService.getAll();
  }

  @Get('/:id')
  async findOne(@Param('id') postId: string): Promise<PostEntity> {
    return await this.postService.findOne(postId);
  }
  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<UpdateResult> {
    return await this.postService.updatePost(postId, updatePostDto);
  }
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deletePost(@Param('id') postId: string): Promise<DeleteResult> {
    return await this.postService.deletePost(postId);
  }
}
