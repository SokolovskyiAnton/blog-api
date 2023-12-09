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
  Req,
  NotFoundException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostDto, UpdatePostDto } from 'src/posts/dto/post.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @UseGuards(AuthGuard)
  @Post('/')
  async create(@Body() createPost: PostDto, @Req() request) {
    const { id } = request.user;
    return await this.postsService.save({
      ...createPost,
      postedBy: id,
    });
  }

  @Get('/')
  async findAll() {
    return await this.postsService.find({
      relations: {
        postedBy: true,
      },
    });
  }

  @Get('/:id')
  async findOne(@Param('id') id: number) {
    return await this.postsService.findOne({
      where: { _id: id },
      relations: {
        postedBy: true,
      },
    });
  }
  @UseGuards(AuthGuard)
  @Patch('/:id')
  async update(@Param('id') id: number, @Body() updatePost: UpdatePostDto) {
    const post = await this.findOne(id);

    if (!post) {
      return new NotFoundException('Post not found');
    }
    await this.postsService.update(id, {
      ...post,
      ...updatePost,
    });

    return {
      message: 'success',
    };
  }
  @UseGuards(AuthGuard)
  @Delete('/:id')
  async remove(@Param('id') id: number) {
    await this.postsService.delete(id);
    return {
      message: 'success',
    };
  }
}
