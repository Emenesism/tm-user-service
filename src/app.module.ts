import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/entities/user.entity';
import globallConfig from './configs/global.config';

console.log(globallConfig);

@Module({
  imports: [
    UserModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: globallConfig.db.dialect as
        | 'mysql'
        | 'postgres'
        | 'mariadb'
        | 'sqlite'
        | 'mongodb',
      host: globallConfig.db.host,
      port: +globallConfig.db.port,
      username: globallConfig.db.user,
      password: globallConfig.db.pass,
      database: globallConfig.db.name,
      synchronize: true,
      entities: [User],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
