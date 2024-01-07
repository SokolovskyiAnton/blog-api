import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { PostEntity } from 'src/post/post.entity';
import { CreatePostDto } from 'src/post/dto/createPost.dto';
import { UserEntity } from 'src/user/user.entity';
import { UpdatePostDto } from 'src/post/dto/updatePost.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
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

  async getAll(): Promise<Array<PostEntity>> {
    return this.postRepository.find({
      relations: ['postedBy'],
    });
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
