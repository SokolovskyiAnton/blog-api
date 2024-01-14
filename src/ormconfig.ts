import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import 'dotenv/config';

const config: MysqlConnectionOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  migrationsRun: true,
};
export default config;
