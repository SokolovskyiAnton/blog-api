import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UserDto, UserUpdateDto } from 'src/users/dto/users.dto';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

import { FileService } from 'src/file/file.service';
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(
    private userService: UsersService,
    private fileService: FileService,
  ) {}

  @Post('/')
  async create(@Body() body: UserDto) {
    const user = await this.userService.findOne({
      where: { email: body.email },
    });

    if (user) {
      throw new NotFoundException('Email already in use');
    }

    const hashed = await bcrypt.hash(body.password, 12);

    await this.userService.save({
      ...body,
      password: hashed,
    });
    return {
      message: 'success',
    };
  }

  @Get('/:id')
  async get(@Param('id') id: number) {
    return await this.userService.findOne({
      where: { _id: id },
    });
  }
  @Get('/')
  async getAll() {
    return await this.userService.find();
  }
  @UseGuards(AuthGuard)
  @Patch('/:id')
  async update(@Param('id') id: number, @Body() body: UserUpdateDto) {
    const user = await this.get(id);

    if (!user) {
      return new BadRequestException('Bad request');
    }

    await this.userService.update(id, {
      ...user,
      ...body,
    });

    return {
      message: 'success',
    };
  }
  @UseGuards(AuthGuard)
  @Delete('/:id')
  async delete(@Param('id') id: number) {
    await this.userService.delete(id);
    return {
      message: 'success',
    };
  }
  @UseGuards(AuthGuard)
  @Put('/upload/:id')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@Req() request, @UploadedFile() file, @Param('id') id: number) {
    try {
      const { id: userId } = request.user;
      if (userId !== id) {
        return new BadRequestException('Bad request');
      }

      const user = await this.get(id);

      if (!user) {
        return new BadRequestException('Bad request');
      }

      const result = await this.fileService.save(file);
      await this.userService.update(id, {
        ...user,
        avatar: result.url,
      });
      return {
        message: 'success',
      };
    } catch (e) {
      throw new BadRequestException('Bad request');
    }
  }
}
