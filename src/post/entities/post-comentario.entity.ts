
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post.entity";
import { user } from "src/auth/entities";


@Entity('comentarios')
export class PostComentario {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column('timestamp')
    fecha: Date;

    @Column('text')
    comentario: string;
    
    @ManyToOne(
        () => Post,
        ( Post ) => Post.comentario,
    )
    Post: Post
    
    @ManyToOne(
        () => user,
        ( user ) => user.comentario,
    )
    User: user





}