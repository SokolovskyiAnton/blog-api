import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(1)
  text: string;
  @IsOptional()
  parentId: string;
}
