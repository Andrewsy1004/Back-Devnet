
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostService } from './post.service';
import { PostController } from './post.controller';

import { AuthModule } from 'src/auth/auth.module';
import { Post, PostApplicantes, PostComentario } from './entities';

@Module({
  controllers: [PostController],
  providers: [PostService],
  
  imports: [
    TypeOrmModule.forFeature([ Post, PostComentario, PostApplicantes  ]),
    AuthModule,
 ],

 exports: [ PostService, TypeOrmModule ]

})
export class PostModule {}
