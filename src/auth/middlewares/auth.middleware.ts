import { Injectable, NestMiddleware } from '@nestjs/common';
import { ExpressRequestInterface } from 'src/types/expressRequest.interface';
import { NextFunction, Response } from 'express';
import { UserEntity } from 'src/user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }
    const token = this.extractTokenFromHeader(req);
    try {
      const decode = await this.jwtService.verifyAsync(token);
      req.user = await this.userService.findUserById(decode.id);
      next();
    } catch (e) {
      req.user = null;
      next();
    }
  }

  private extractTokenFromHeader(
    request: ExpressRequestInterface,
  ): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
