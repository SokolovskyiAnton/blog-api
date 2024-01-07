import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty()
  firstName: string;
  @IsOptional()
  @IsNotEmpty()
  lastName: string;
  @IsOptional()
  nickname: string;
  @IsOptional()
  skills: string;
  @IsOptional()
  profession: string;
}
