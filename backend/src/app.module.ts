import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '@src/config/typeorm.config';
import { TeamModule } from './team/team.module';
import { ProfileModule } from './profile/profile.module';
import { RessourceModule } from './ressource/ressource.module';
import { TodoModule } from './todo/todo.module';
import { MembershipModule } from './membership/membership.module';
import { SseModule } from './sse/sse.module';
import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notification/notification.module';
import { MessageModule } from './message/message.module';
import { SocketModule } from './socket/socket.module';
import { SwaggerModule } from './swagger/swagger.module';
import { GraphQLModule } from '@nestjs/graphql';
import {join} from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // or true
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        typeOrmConfig(configService),
      inject: [ConfigService],
    }),
    SwaggerModule,
    UserModule,
    TeamModule,
    ProfileModule,
    RessourceModule,
    TodoModule,
    MembershipModule,
    SseModule,
    AuthModule,
    NotificationModule,
    MessageModule,
    SocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
