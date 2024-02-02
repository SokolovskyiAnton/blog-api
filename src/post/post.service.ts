import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { PostEntity } from 'src/post/post.entity';
import { CreatePostDto } from 'src/post/dto/createPost.dto';
import { UserEntity } from 'src/user/user.entity';
import { UpdatePostDto } from 'src/post/dto/updatePost.dto';
import { PostPaginationDto } from 'src/post/dto/pagination.dto';
import { PostResponseInterface } from 'src/post/types/postResponse.interface';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async createPost(
    user: UserEntity,
    createPostDto: CreatePostDto,
  ): Promise<PostEntity> {
    const post = new PostEntity();
    Object.assign(post, createPostDto);
    post.postedBy = user;
    return await this.postRepository.save(post);
  }

  async getAll(
    query: PostPaginationDto,
    userId: string,
  ): Promise<PostResponseInterface> {
    const queryBuilder = this.dataSource
      .getRepository(PostEntity)
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.postedBy', 'postedBy');
    queryBuilder.orderBy('posts.dateCreated', 'DESC');
    let postsCount = await queryBuilder.getCount();

    if (query.author) {
      queryBuilder.andWhere('posts.postedBy = :id', {
        id: query.author,
      });
      postsCount = await queryBuilder.getCount();
    }

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }
    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    let likesIds: string[] = [];

    if (userId) {
      const user = await this.userRepository.findOne({
        where: { _id: userId },
        relations: ['likeList'],
      });
      likesIds = user.likeList.map((p) => p._id);
    }

    const posts = await queryBuilder.getMany();
    const postsWithLikes = posts.map((post) => {
      const isLiked = likesIds.includes(post._id);
      return { ...post, isLiked };
    });
    return {
      posts: postsWithLikes,
      pagination: {
        total: postsCount,
        limit: query.limit,
        offset: query.offset,
      },
    };
  }
  async findOne(postId: string): Promise<PostEntity> {
    return await this.postRepository.findOne({
      where: { _id: postId },
      relations: ['postedBy'],
    });
  }
  async updatePost(
    postId: string,
    updatePostDto: UpdatePostDto,
    userId: string,
  ): Promise<UpdateResult> {
    const post = await this.checkPost(userId, postId);
    return await this.postRepository.update(post._id, updatePostDto);
  }
  async deletePost(postId: string, userId: string): Promise<DeleteResult> {
    const post = await this.checkPost(userId, postId);
    return await this.postRepository.delete({ _id: post._id });
  }

  async checkPost(userId: string, postId: string) {
    const post = await this.findOne(postId);

    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    if (post.postedBy._id !== userId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return post;
  }

  async setLike(userId: string, postId: string): Promise<PostEntity> {
    const { post, user, isNotFavorited } = await this.getLikeInfo(
      postId,
      userId,
    );
    if (isNotFavorited) {
      user.likeList.push(post);
      post.likes++;
      await this.userRepository.save(user);
      await this.postRepository.save(post);
    }

    return post;
  }

  async deleteLike(userId: string, postId: string): Promise<PostEntity> {
    const { post, user, articleIndex } = await this.getLikeInfo(postId, userId);
    if (articleIndex >= 0) {
      user.likeList.splice(articleIndex, 1);
      post.likes--;
      await this.userRepository.save(user);
      await this.postRepository.save(post);
    }

    return post;
  }

  async getLikeInfo(postId: string, userId: string) {
    const post = await this.findOne(postId);
    const user = await this.userRepository.findOne({
      where: { _id: userId },
      relations: ['likeList'],
    });
    const isNotFavorited =
      user.likeList.findIndex((p) => p._id === post._id) === -1;
    const articleIndex = user.likeList.findIndex((p) => p._id === post._id);
    return {
      post,
      user,
      isNotFavorited,
      articleIndex,
    };
  }
}
