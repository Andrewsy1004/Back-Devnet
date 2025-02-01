
import { user } from "src/auth/entities";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PostComentario } from "./post-comentario.entity";
import { PostApplicantes } from ".";


@Entity('posts')
export class Post {

    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column('text')
    title: string;

    @Column('text')
    content: string;

    @Column('bool', {
        default: true
    })
    isActive: boolean;
     
    @Column('text')
    photo: string;
    
    @Column('timestamp')
    publishedAt: Date;

    @Column('timestamp', {
        nullable: true  
    })
    endedAt: Date;
    
    @ManyToOne(
        () => user,
        ( user ) => user.post,
        { eager: false }
    )
    user: user
   

    @OneToMany(
        () => PostComentario,
        ( PostComentario ) => PostComentario.Post,
        { eager: false }
    )
    comentario: PostComentario
    
    @OneToMany(
        () => PostApplicantes,
        (postApplicantes) => postApplicantes.post
      )
      oferta: PostApplicantes[];

    


}
