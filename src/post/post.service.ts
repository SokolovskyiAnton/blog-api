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

  async getAll(query: PostPaginationDto): Promise<PostResponseInterface> {
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

    const posts = await queryBuilder.getMany();
    return {
      posts,
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
  ): Promise<UpdateResult> {
    const post = await this.findOne(postId);

    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return await this.postRepository.update(post._id, updatePostDto);
  }
  async deletePost(postId: string): Promise<DeleteResult> {
    return await this.postRepository.delete({ _id: postId });
  }
}
