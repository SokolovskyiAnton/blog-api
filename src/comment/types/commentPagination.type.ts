import { CommentPaginationDto } from 'src/comment/dto/pagination.dto';

export type CommentPaginationType = CommentPaginationDto & { total: number };
