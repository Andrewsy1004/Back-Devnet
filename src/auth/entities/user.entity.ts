
import { ApiProperty } from '@nestjs/swagger';

import { Message } from "src/messages/entities/message.entity";
import { Post, PostApplicantes, PostComentario } from "src/post/entities";

import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('users')
export class user {
    
    @ApiProperty({
        example: 'cd533345-f1f3-48c9-a62e-7dc2da50c8f8',
        description: 'Id User',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;
    

    @ApiProperty({
        example: 'andres@example.com',
        description: 'Email User',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    email: string;
    

    @ApiProperty({
        example: '123456',
        description: 'Password User',
        uniqueItems: true
    })
    @Column('text', {
        select: false
    })
    password: string;
    

    @ApiProperty({
        example: 'Andres',
        description: 'Name User',
        uniqueItems: true
    })
    @Column('text')
    fullName: string;

    @Column('bool', {
        default: false
    })
    isActive: boolean;

    @Column('text', {
        nullable: true,
        select: true 
    })
    verificationCode: string | null;

    @Column('timestamp', {
        nullable: true, 
        select: true
    })
    verificationExpires: Date | null;
     
    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[];
    
    @Column('text',{
        nullable: true
    })
    urlPhoto: string; 

    @Column('text', {
        nullable: true,
        select: true
    })
    Descripcion: string;

    @Column('text', {
        nullable: true,
        select: true
    })
    Rol : string;


    @OneToMany(
        () => Post,
        ( Post ) => Post.user
    )
    post: Post;
   
    @OneToMany(
        () => PostComentario,
        ( PostComentario ) => PostComentario.User
    )
    comentario: PostComentario;


    @OneToMany(
        () => Message,
        (message) => message.sender
    )
    sentMessages: Message[];
    
    @OneToMany(
        () => Message,
        (message) => message.Reciever
    )
    receivedMessages: Message[];


    @OneToMany(
        () => PostApplicantes,
        (postApplicantes) => postApplicantes.user,
        { eager: false } // Match the `eager` option in the `PostApplicantes` relation
      )
      postApplicantes: PostApplicantes[];



    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();   
    }

   
}
