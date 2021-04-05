import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  username: 'root',
  password: '',
  database: 'angular',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  logging: true,
  synchronize: true,
  port: 3306,
};
