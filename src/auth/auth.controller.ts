import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { User } from 'src/auth/decorators/user.decorator';
import { UserEntity } from 'src/user/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { AuthResponseInterface } from 'src/auth/types/authResponse.interface';

@Controller('/auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async authenticateUser(
    @Body() body: AuthDto,
  ): Promise<AuthResponseInterface> {
    const token = await this.authService.authenticateUser(body);
    return this.authService.buildAuthResponse(token);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async get(@User('_id') currentUserId: string): Promise<UserEntity> {
    return await this.authService.getVerifiedUser(currentUserId);
  }
}
