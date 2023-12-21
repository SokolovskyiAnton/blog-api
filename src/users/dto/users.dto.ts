import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  firstName: string;
  @IsNotEmpty()
  lastName: string;
}

export class UserUpdateDto {
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
