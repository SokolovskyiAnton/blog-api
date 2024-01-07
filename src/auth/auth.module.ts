import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SharedModule } from 'src/shared/shared.module';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UserModule, SharedModule, TypeOrmModule.forFeature([UserEntity])],
})
export class AuthModule {}
