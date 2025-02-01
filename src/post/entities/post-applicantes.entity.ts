

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post.entity";
import { user } from "src/auth/entities";



@Entity("applicantes")
export class PostApplicantes {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('bool', { default: null, nullable: true })
    isAceept?: boolean;
    
    @ManyToOne(
      () => user,
      ( user ) => user.postApplicantes,
      { eager: false }
    )
    user: user


    @ManyToOne(
      () => Post,
      ( Post ) => Post.oferta
    )
    post: Post;

}


