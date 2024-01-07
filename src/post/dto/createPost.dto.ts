import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @MinLength(3)
  @MaxLength(25)
  @IsNotEmpty()
  title: string;
  @MinLength(10)
  @MaxLength(700)
  @IsNotEmpty()
  fullText: string;
  @MinLength(10)
  @MaxLength(100)
  @IsNotEmpty()
  description: string;
}
