import { IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class PostPaginationDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  limit: number;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  offset: number;
  @IsOptional()
  author?: string;
}
