import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { UserEntity } from 'src/user/user.entity';
import { UpdateUserDto } from 'src/user/dto/updateUser.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { User } from 'src/auth/decorators/user.decorator';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return await this.userService.createUser(createUserDto);
  }
  @Patch()
  @UseGuards(AuthGuard)
  async update(
    @User('_id') currentUserId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return await this.userService.updateUser(currentUserId, updateUserDto);
  }
  @Delete()
  @UseGuards(AuthGuard)
  async deleteUser(@User('_id') currentUserId: string): Promise<DeleteResult> {
    return await this.userService.deleteUser(currentUserId);
  }
  @Put('upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @User('_id') currentUserId: string,
    @UploadedFile() file: any,
  ): Promise<UpdateResult> {
    return await this.userService.uploadUserAvatar(currentUserId, file);
  }
}
