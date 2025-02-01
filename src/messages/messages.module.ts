
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/auth/auth.module';

import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { Message } from './entities/message.entity';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService],
  
  imports: [
    TypeOrmModule.forFeature([ Message ]),
    AuthModule,
  ],


  exports : [
    MessagesService, TypeOrmModule
  ],
  

})
export class MessagesModule {}
