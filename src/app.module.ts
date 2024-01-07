import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from 'src/post/post.module';
import { AuthMiddleware } from 'src/auth/middlewares/auth.middleware';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'm7az7525jg6ygibs.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
      port: 3306,
      username: 'umrq2l8qeyvdrel2',
      password: 'b5l1se0ejoik6ckr',
      database: 'wj1kcgjyhc9kq1wv',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
