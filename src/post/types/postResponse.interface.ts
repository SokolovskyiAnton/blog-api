import { PostEntity } from 'src/post/post.entity';
import { PostPaginationType } from 'src/post/types/postPagination.type';

export interface PostResponseInterface {
  posts: Array<PostEntity>;
  pagination: PostPaginationType;
}
