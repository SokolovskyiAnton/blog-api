import { IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @MinLength(3)
  @MaxLength(25)
  title: string;
  @IsOptional()
  @MinLength(10)
  @MaxLength(700)
  fullText: string;
  @IsOptional()
  @MinLength(10)
  @MaxLength(100)
  description: string;
}
