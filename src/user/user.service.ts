import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { UpdateUserDto } from 'src/user/dto/updateUser.dto';
import { FileService } from 'src/file/file.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly fileService: FileService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (userByEmail) {
      throw new HttpException(
        'This email is already registered',
        HttpStatus.CONFLICT,
      );
    }

    const user = new UserEntity();
    Object.assign(user, createUserDto);
    return await this.userRepository.save(user);
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    const user = await this.findUserById(userId);
    return await this.userRepository.update(user._id, updateUserDto);
  }

  async findUserById(userId: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: {
        _id: userId,
      },
    });
  }

  async uploadUserAvatar(userId: string, file: any): Promise<UpdateResult> {
    const user = await this.findUserById(userId);

    const response = await this.fileService.save(file);
    const payload = {
      avatar: response.url,
    };
    return await this.userRepository.update(user._id, payload);
  }

  async deleteUser(userId: string): Promise<DeleteResult> {
    return await this.userRepository.delete({ _id: userId });
  }
}
