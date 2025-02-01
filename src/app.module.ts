
import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { TypeOrmModule } from '@nestjs/typeorm';

import { EnvConfiguration, joiValidationSchema } from './config';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { PostModule } from './post/post.module';
import { MessagesWsModule } from './messages-ws/messages-ws.module';
import { MessagesModule } from './messages/messages.module';

@Module({
   
  imports: [
      
    // CONFIGURATION FOR THE ENVIRONMENT AND VALIDATIONS USING JOI
    ConfigModule.forRoot({
      load: [ EnvConfiguration ],
      validationSchema: joiValidationSchema,
    }),
    
    // CONFIGURATION FOR THE STATIC FILES
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'), 
    }),

    // CONFIGURATION FOR THE DATABASE ( ORM )
    TypeOrmModule.forRoot({
      type:             'postgres',
      host:             process.env.DB_HOST,
      port:             +process.env.DB_PORT,
      database:         process.env.DB_NAME,
      username:         process.env.DB_USERNAME,
      password:         process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize:      true,
    }),
    
    // ALL MODULES OF THE APP
    AuthModule,
    
    EmailModule,
    
    PostModule,
    
    MessagesWsModule,
    
    MessagesModule,


  ],


  controllers: [],
  providers: [],
})
export class AppModule {}

