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
  Query,
} from '@nestjs/common';
import { PostService } from 'src/post/post.service';

import { AuthGuard } from 'src/auth/guards/auth.guard';
import { User } from 'src/auth/decorators/user.decorator';
import { PostEntity } from 'src/post/post.entity';
import { CreatePostDto } from 'src/post/dto/createPost.dto';
import { UserEntity } from 'src/user/user.entity';
import { UpdatePostDto } from 'src/post/dto/updatePost.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { PostPaginationDto } from 'src/post/dto/pagination.dto';
import { PostResponseInterface } from 'src/post/types/postResponse.interface';

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
  async getAll(
    @Query() query: PostPaginationDto,
    @User('_id') currentUserId: string,
  ): Promise<PostResponseInterface> {
    const getQueryData = Object.keys(query).length
      ? query
      : { limit: 10, offset: 0 };
    return await this.postService.getAll(getQueryData, currentUserId);
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
    @User('_id') currentUserId: string,
  ): Promise<UpdateResult> {
    return await this.postService.updatePost(
      postId,
      updatePostDto,
      currentUserId,
    );
  }
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deletePost(
    @Param('id') postId: string,
    @User('_id') currentUserId: string,
  ): Promise<DeleteResult> {
    return await this.postService.deletePost(postId, currentUserId);
  }
  @Post('/like/:id')
  @UseGuards(AuthGuard)
  async setLike(
    @User('id') currentUserId: string,
    @Param('id') postId: string,
  ): Promise<PostEntity> {
    return await this.postService.setLike(currentUserId, postId);
  }
  @Delete('/like/:id')
  @UseGuards(AuthGuard)
  async deleteLike(
    @User('id') currentUserId: string,
    @Param('id') postId: string,
  ): Promise<PostEntity> {
    return await this.postService.deleteLike(currentUserId, postId);
  }
}
