
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PostService } from './post.service';

import { CreateComentarioDto, CreatePostDto, PaginationDto, PostApplicantesDto, UpdatePostDto } from './dto';
import { Auth, GetUser } from 'src/auth/decorators';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}
  
  @Get('allPosts')
  getAllPosts(
    @Query() pagination: PaginationDto
  ) {
    return this.postService.getAllPosts( pagination );
  }

  @Post('create')
  @Auth()
  createPost( 
     @Body() createPostDto: CreatePostDto,
     @GetUser('id') userId: string,
  ) {
    return this.postService.createPost( userId, createPostDto );
  }


  @Get('user')
  @Auth()
  getAllPostsByUser( 
     @GetUser('id') userId: string, 
     @Query() pagination: PaginationDto
    ) {
    return this.postService.getAllPostsByUser( userId, pagination );
  }
   

  @Get(':id')
  getPostById( @Param('id',ParseUUIDPipe) id: string ) {
    return this.postService.getPostById( id );
  }
  

  @Delete(':id')
  @Auth()
  deletePostById( 
    @Param('id',ParseUUIDPipe) id: string,
    @GetUser('id') userId: string, 

 ) {
    return this.postService.deletePostById( id, userId );
  }
  
  @Patch(':id')
  @Auth()
  updatePostById( 
    @Param('id',ParseUUIDPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
    @GetUser('id') userId: string, 
   ) {
    
    return this.postService.updatePostById( id, updatePostDto, userId );

  }
  
  
  @Post('comentario/:id')
  @Auth()
  createComment( 
    @Param('id',ParseUUIDPipe) id: string,
    @Body() createComentarioDto: CreateComentarioDto,
    @GetUser('id') userId: string,
  ) {
    return this.postService.createComment( id, userId, createComentarioDto );
  }
  
  @Get('getComentarios/:id')
  getComentarios( @Param('id',ParseUUIDPipe) id: string ) {
    return this.postService.getComentarios( id );
  }
  
  @Patch('comentario/:id')
  @Auth()
  updateComment( 
    @Param('id',ParseUUIDPipe) id: string,
    @Body() createComentarioDto: CreateComentarioDto,
    @GetUser('id') userId: string,
  ) {
    return this.postService.updateComment( id, userId, createComentarioDto );
  }
   
  
  @Post('EnviaarVacante')
  @Auth()
  EnviaarVacante( 
    @Body() enviarVacantedto: PostApplicantesDto,
    @GetUser('id') userId: string,
  ) {
       return this.postService.EnviaarVacante( enviarVacantedto, userId );
    }
    
  @Get('aplicantes/Jobs')
  @Auth()
  getJobsAplicantes(
    @GetUser('id') userId: string,
  ) {
    return this.postService.getJobsAplicantes( userId );
  }
  
  
  @Post("CalificarVacante")
  @Auth()
  CalificarVacante( 
    @Body() VacanteDto: { isAceept: boolean, id: string },
    @GetUser('id') userId: string,
  ) {
       return this.postService.calificarVacanteUser( VacanteDto );
    }



}
