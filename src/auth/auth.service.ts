import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { AuthDto } from 'src/auth/dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseInterface } from 'src/auth/types/authResponse.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}
  async authenticateUser(authDto: AuthDto): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { email: authDto.email },
    });
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
    const isPasswordsMatch = await bcrypt.compare(
      authDto.password,
      user.password,
    );
    if (!isPasswordsMatch) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
    return await this.jwtService.signAsync({
      id: user._id,
    });
  }
  async getVerifiedUser(userId: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: {
        _id: userId,
      },
    });
  }

  buildAuthResponse(token: string): AuthResponseInterface {
    return {
      token,
    };
  }
}
