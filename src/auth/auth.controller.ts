import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import * as bcrypt from 'bcrypt';

@Controller('/auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Post('/')
  async auth(@Body() body: AuthDto) {
    const user = await this.userService.findOne({
      where: { email: body.email },
    });
    if (!user) {
      throw new BadRequestException('Wrong credentials');
    }
    const isPasswordsMatch = await bcrypt.compare(body.password, user.password);
    if (!isPasswordsMatch) {
      throw new BadRequestException('Invalid credentials');
    }
    const jwt = await this.jwtService.signAsync({
      id: user._id,
    });

    return {
      token: jwt,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/user')
  async get(@Req() request) {
    const { id } = request.user;
    return this.userService.findOne({
      where: { _id: id },
    });
  }
}
