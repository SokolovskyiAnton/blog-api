import { CommentEntity } from 'src/comment/comment.entity';
import { CommentPaginationType } from 'src/comment/types/commentPagination.type';

export interface CommentResponseInterface {
  comments: Array<CommentEntity>;
  pagination: CommentPaginationType;
}
