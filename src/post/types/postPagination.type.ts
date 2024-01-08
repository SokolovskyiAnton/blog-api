import { PostPaginationDto } from 'src/post/dto/pagination.dto';

export type PostPaginationType = PostPaginationDto & { total: number };
