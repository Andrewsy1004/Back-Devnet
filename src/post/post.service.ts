

import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Post } from './entities/post.entity';
import { CreateComentarioDto, CreatePostDto, PaginationDto, PostApplicantesDto, UpdatePostDto } from './dto';
import { PostApplicantes, PostComentario } from './entities';
import { user } from 'src/auth/entities';

@Injectable()
export class PostService {
  
    private readonly logger = new Logger('PostService');
    
   constructor(
          @InjectRepository(Post)
          private readonly postRepository: Repository<Post>,

          @InjectRepository(PostComentario)
          private readonly comentarioRepository: Repository<PostComentario>,
          
          @InjectRepository(PostApplicantes)
          private readonly aplicantesRepository: Repository<PostApplicantes>
   ) {}


   async createPost(userId: string, createPostDto: CreatePostDto) {
    try {
      
      const now = new Date();
      const colombiaDate = new Date(now.setHours(now.getHours()));
  
      const post = this.postRepository.create({
        ...createPostDto,
        publishedAt: colombiaDate,
        user: { id: userId }
      });
  
      await this.postRepository.save(post);
  
      return post;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }


   async getAllPostsByUser( userId: string, pagination: PaginationDto ) {
    try {
      
      const { skip = 0, take = 3 } = pagination;
      
      const posts = await this.postRepository.find({
        where: { 
            user: { id: userId },
            isActive: true   
        },
        relations:{
           comentario: true
        },
        skip,
        take,
        order: { publishedAt: 'DESC' }
    });
      
      if ( !posts ) throw new BadRequestException('Posts not found');

      return posts.map(({ user, ...postData }) => ({
        ...postData,
        publishedAt: new Date(postData.publishedAt).toLocaleString()
    }));
 
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      this.handleDBErrors( error );
    }
   }


   async getPostById( id: string ) {  
     
    try {
          const post = await this.postRepository.findOne( { where: { id, isActive: true }, relations: { user: true }} );  
                    
          if ( !post ) throw new BadRequestException('Post not found');
          
          if (post.user) {
            delete post.user.verificationCode;
            delete post.user.verificationExpires; 
            delete post.user.Descripcion;
        }

          return post;

    } catch (error) {
      if (error instanceof BadRequestException) throw error
      this.handleDBErrors( error );
    }

   }

   
    async deletePostById( id: string, userId: string ) {
      try {
          
          const post = await this.getPostById( id );
          
          if( post.user.id !== userId ) throw new BadRequestException('You are not authorized to delete this post');
        
          post.isActive = false;
          await this.postRepository.save(post);

          return { message: 'Post deleted successfully' };

      }catch (error) {
        if (error instanceof BadRequestException) throw error;
        this.handleDBErrors( error ); 
      }
    }
    
    async updatePostById( id: string, updatePostDto: UpdatePostDto, userId: string ) {
      try {
        
          const post = await this.getPostById( id );
          
          if( post.user.id !== userId ) throw new BadRequestException('You are not authorized to update this post');
          
           const postPreoloaded = await this.postRepository.preload({
              id,
              ...updatePostDto
           });

          //  if ( !postPreoloaded ) throw new BadRequestException('Post not found');

            await this.postRepository.save( postPreoloaded );

            return {
              message: 'Post updated successfully',
              post: postPreoloaded
            };

      } catch (error) {
        if (error instanceof BadRequestException) throw error;
        this.handleDBErrors( error );
      }
    }
    

    async createComment( id: string, userId: string, createComentarioDto: CreateComentarioDto ) {
      try {
          
          const post = await this.getPostById( id );

          if( !post.isActive ) throw new BadRequestException('You cannot comment on a deleted post');
          
          const comentario = this.comentarioRepository.create({
            ...createComentarioDto,
            fecha: new Date(),
            User: { id: userId },
            Post: { id: id }
          });
          
          await this.comentarioRepository.save( comentario );
          
          return {
            message: 'Comment created successfully'
          }
        
      } catch (error) {
        if (error instanceof BadRequestException) throw error;
        this.handleDBErrors( error );
      }
    }
    
    async getAllPosts(pagination: PaginationDto) {
      try {
        const { skip = 0, take = 3 } = pagination;
        
        const posts = await this.postRepository.find({
          where: { isActive: true },
          relations: { user: true },
          select: { user: { id: true, fullName: true, urlPhoto: true } },
          // skip,
          // take,
          order: { publishedAt: 'DESC' }
        });
    
        return posts.map(post => ({
          ...post,
          publishedAt: new Date(post.publishedAt).toLocaleString()
        }));
    
      } catch (error) {
        this.handleDBErrors(error);
      }
    }


    async getComentarios( id: string ) {
      try {
           
          const comentarios = await this.comentarioRepository.find({
            where: { Post: { id: id } },
            relations: { User: true },
            select: { User: { id: true, fullName: true, urlPhoto: true } }
          });
          
          return comentarios.map(comentario => ({
            ...comentario,
            fecha: new Date(comentario.fecha).toLocaleString()
          }));



      } catch (error) {
         if (error instanceof BadRequestException) throw error;
         this.handleDBErrors( error );
      } 

    }


    async updateComment( id: string, userId: string, updateComentarioDto: CreateComentarioDto ) {
      try {

          const comentario = await this.comentarioRepository.findOne({
            where: { id, User: { id: userId } },
            relations: { Post: true, User: true }
          });

          if( !comentario ) throw new BadRequestException('Comment not found');
          
          const comentarioPreloaded = await this.comentarioRepository.preload({
            id,
            ...updateComentarioDto
          });
          
          await this.comentarioRepository.save( comentarioPreloaded );
          
          return {
            message: 'Comment updated successfully',
            comentario: comentarioPreloaded
          };
        
      } catch (error) {
         if (error instanceof BadRequestException) throw error;
         this.handleDBErrors( error );
      }
    }
    

    async EnviaarVacante (enviarVacantedto: PostApplicantesDto, userId: string) {
      try {
          
        const { postId } = enviarVacantedto;

        // Verify If the user has already applied
        const aplicante = await this.aplicantesRepository.findOneBy({
          post: { id: postId },
          user: { id: userId },
        });

        if (aplicante) throw new BadRequestException('You have already applied for this post');
        
        const enviarVacante = this.aplicantesRepository.create({
          post: { id: postId },
          user: { id: userId },
        });
        
        await this.aplicantesRepository.save(enviarVacante);

        return {
          message: 'Vacante enviada correctamente'
        }
          
      } catch (error) {
         if ( error instanceof BadRequestException ) throw error;
         this.handleDBErrors( error );
      }
    }
    

    async getJobsAplicantes( userId: string ) {
      try {
          
        const post = await this.postRepository.find({
          where: { 
              isActive: true,
          },
          relations: ['oferta', 'oferta.user'], 
          order: { publishedAt: 'DESC' }
        });
        
       
        return post.map(post => ({
          ...post,
          publishedAt: new Date(post.publishedAt).toLocaleString(), 
          oferta: post.oferta
            .filter(oferta => oferta.isAceept === null) 
            .map(oferta => ({
              id: oferta.id,
              isAceept: oferta.isAceept,
              user: {
                id: oferta.user.id, 
                fullName: oferta.user.fullName, 
                email: oferta.user.email, 
                urlPhoto: oferta.user.urlPhoto 
              }
            }))
        }));
        
           
          
      } catch (error) {
        if (error instanceof BadRequestException) throw error;
        this.handleDBErrors( error );
      }
    }


    async calificarVacanteUser ( VacanteDto: { isAceept: boolean, id: string } ) {
      try {

          const { isAceept, id } = VacanteDto;


          const vacante = await this.aplicantesRepository.findOneBy({ id: id });

          if ( !vacante ) throw new BadRequestException('Vacante not found');
          
          vacante.isAceept = isAceept;
          await this.aplicantesRepository.save( vacante );

          return {
            message: 'Vacante calificada correctamente'
          }
        
      } catch (error) {
         if ( error instanceof BadRequestException ) throw error;
         this.handleDBErrors( error );
      }

    }


   private handleDBErrors( error: any ): never {
    if ( error.code === '23505' ) throw new BadRequestException( error.detail );
    this.logger.error(error);
    throw new InternalServerErrorException('Please check server logs');
  }
   
}
