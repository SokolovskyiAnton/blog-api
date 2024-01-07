import {
  CanActivate,
  ClassSerializerInterceptor,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ExpressRequestInterface } from 'src/types/expressRequest.interface';

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<ExpressRequestInterface>();

    if (request.user) {
      return true;
    }
    throw new UnauthorizedException();
  }
}
