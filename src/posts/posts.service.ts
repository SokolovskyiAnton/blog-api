import { Injectable } from '@nestjs/common';
import { AbstractService } from 'src/shared/abstract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from 'src/posts/post.entity';

@Injectable()
export class PostsService extends AbstractService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {
    super(postRepository);
  }
}
