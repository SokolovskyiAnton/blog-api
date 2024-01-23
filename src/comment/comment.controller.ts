import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { User } from 'src/auth/decorators/user.decorator';
import { CreateCommentDto } from 'src/comment/dto/createComment.dto';
import { UserEntity } from 'src/user/user.entity';
import { CommentService } from 'src/comment/comment.service';
import { CommentEntity } from 'src/comment/comment.entity';
import { CommentPaginationDto } from 'src/comment/dto/pagination.dto';
import { CommentResponseInterface } from 'src/comment/types/commentResponse.interface';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateCommentDto } from 'src/comment/dto/updateComment.dto';

@Controller('comments')
@UseInterceptors(ClassSerializerInterceptor)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @Post('post/:postId')
  @UseGuards(AuthGuard)
  async createComment(
    @User() currentUser: UserEntity,
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentEntity> {
    return await this.commentService.createComment(
      postId,
      currentUser,
      createCommentDto,
    );
  }
  @Get('post/:postId')
  async getCommentsByPostId(
    @Query() query: CommentPaginationDto,
    @User('_id') currentUserId: string,
    @Param('postId') postId: string,
  ): Promise<CommentResponseInterface> {
    const getQueryData = Object.keys(query).length
      ? query
      : { limit: 10, offset: 0 };
    return await this.commentService.getCommentsByPostId(
      getQueryData,
      postId,
      currentUserId,
    );
  }

  @Patch(':commentId')
  @UseGuards(AuthGuard)
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @User('_id') currentUserId: string,
  ): Promise<UpdateResult> {
    return await this.commentService.updateComment(
      commentId,
      updateCommentDto,
      currentUserId,
    );
  }
  @Delete(':commentId')
  @UseGuards(AuthGuard)
  async deleteComment(
    @Param('commentId') commentId: string,
    @User('_id') currentUserId: string,
  ): Promise<DeleteResult> {
    return await this.commentService.deleteComment(commentId, currentUserId);
  }

  @Post('/like/:commentId')
  @UseGuards(AuthGuard)
  async setLike(
    @User('id') currentUserId: string,
    @Param('commentId') commentId: string,
  ): Promise<CommentEntity> {
    return await this.commentService.setLike(currentUserId, commentId);
  }
  @Delete('/like/:commentId')
  @UseGuards(AuthGuard)
  async deleteLike(
    @User('id') currentUserId: string,
    @Param('commentId') commentId: string,
  ): Promise<CommentEntity> {
    return await this.commentService.deleteLike(currentUserId, commentId);
  }
}
