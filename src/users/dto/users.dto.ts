import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  name: string;
}

export class UserUpdateDto {
  @IsOptional()
  name: string;
  @IsOptional()
  password: string;
  @IsOptional()
  @IsOptional()
  email: string;
}
