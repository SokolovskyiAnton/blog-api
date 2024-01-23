import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UpdateCommentDto {
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(1)
  text: string;
}
