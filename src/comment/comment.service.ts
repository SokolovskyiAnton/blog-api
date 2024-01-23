import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto } from 'src/comment/dto/createComment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/post/post.entity';
import {
  DataSource,
  DeleteResult,
  IsNull,
  Repository,
  UpdateResult,
} from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { CommentEntity } from 'src/comment/comment.entity';
import { CommentResponseInterface } from 'src/comment/types/commentResponse.interface';
import { CommentPaginationDto } from 'src/comment/dto/pagination.dto';
import { UpdateCommentDto } from 'src/comment/dto/updateComment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly dataSource: DataSource,
  ) {}
  async createComment(
    postId: string,
    user: UserEntity,
    createCommentDto: CreateCommentDto,
  ): Promise<CommentEntity> {
    const post = await this.postRepository.findOne({
      where: {
        _id: postId,
      },
    });
    const parentComment = await this.commentRepository.findOne({
      where: {
        _id: createCommentDto.parentId || IsNull(),
      },
    });
    if (!post) {
      throw new HttpException('post not found', HttpStatus.NOT_FOUND);
    }
    const comment = new CommentEntity();
    if (parentComment) {
      comment.parentId = parentComment._id;
    }
    comment.text = createCommentDto.text;
    comment.postId = post;
    comment.commentedBy = user;

    return await this.dataSource.manager.save(comment);
  }
  async getCommentsByPostId(
    query: CommentPaginationDto,
    postId: string,
    userId: string,
  ): Promise<CommentResponseInterface> {
    const post = await this.postRepository.findOne({
      where: {
        _id: postId,
      },
      relations: ['comments'],
    });
    if (!post) {
      throw new HttpException('post not found', HttpStatus.NOT_FOUND);
    }
    const queryBuilder = this.dataSource
      .getRepository(CommentEntity)
      .createQueryBuilder('comments')
      .leftJoin('comments.commentedBy', 'commentedBy')
      .addSelect([
        'commentedBy._id',
        'commentedBy.firstName',
        'commentedBy.lastName',
        'commentedBy.nickname',
      ]);

    queryBuilder.orderBy('comments.dateCreated', 'DESC');
    queryBuilder.andWhere('comments.postId = :id', {
      id: post._id,
    });
    const commentsCount = await queryBuilder.getCount();
    let likesIds: string[] = [];

    if (userId) {
      const user = await this.userRepository.findOne({
        where: { _id: userId },
        relations: ['commentsLikeList'],
      });
      likesIds = user.commentsLikeList.map((c) => c._id);
    }
    const comments = await queryBuilder.getMany();
    const commentsWithLikes = comments.map((comment) => {
      const isLiked = likesIds.includes(comment._id);
      return { ...comment, isLiked };
    });
    return {
      comments: commentsWithLikes,
      pagination: {
        total: commentsCount,
        limit: query.limit,
        offset: query.offset,
      },
    };
  }

  async updateComment(
    commentId: string,
    updateCommentDto: UpdateCommentDto,
    userId: string,
  ): Promise<UpdateResult> {
    const comment = await this.checkComment(commentId, userId);
    return await this.commentRepository.update(comment._id, updateCommentDto);
  }

  async deleteComment(
    commentId: string,
    userId: string,
  ): Promise<DeleteResult> {
    const comment = await this.checkComment(commentId, userId);
    return await this.commentRepository.delete({
      _id: comment._id,
    });
  }

  async checkComment(commentId: string, userId: string) {
    const comment = await this.commentRepository.findOne({
      where: {
        _id: commentId,
      },
      relations: ['commentedBy'],
    });
    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }

    if (comment.commentedBy._id !== userId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return comment;
  }

  async setLike(userId: string, commentId: string): Promise<CommentEntity> {
    const { comment, user, isNotFavorited } = await this.getLikeInfo(
      commentId,
      userId,
    );
    if (isNotFavorited) {
      user.commentsLikeList.push(comment);
      comment.likes++;
      await this.userRepository.save(user);
      await this.commentRepository.save(comment);
    }
    return comment;
  }

  async deleteLike(userId: string, commentId: string): Promise<CommentEntity> {
    const { comment, user, commentIndex } = await this.getLikeInfo(
      commentId,
      userId,
    );
    if (commentIndex >= 0) {
      user.commentsLikeList.splice(commentIndex, 1);
      comment.likes--;
      await this.userRepository.save(user);
      await this.commentRepository.save(comment);
    }
    return comment;
  }

  async getLikeInfo(commentId: string, userId: string) {
    const comment = await this.commentRepository.findOne({
      where: {
        _id: commentId,
      },
    });
    const user = await this.userRepository.findOne({
      where: { _id: userId },
      relations: ['commentsLikeList'],
    });
    const isNotFavorited =
      user.commentsLikeList.findIndex((c) => c._id === comment._id) === -1;
    const commentIndex = user.commentsLikeList.findIndex(
      (c) => c._id === comment._id,
    );
    return {
      comment,
      user,
      isNotFavorited,
      commentIndex,
    };
  }
}
