
import { user } from "src/auth/entities";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('Mensajes')
export class Message {
   @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @ManyToOne(
        () => user,
        (user) => user.sentMessages,
        { eager: true }
    )
    sender: user;

    @ManyToOne(
        () => user,
        (user) => user.receivedMessages,
        { eager: true }
    )
    Reciever: user;

    @Column('timestamp')
    Fecha : Date;

    @Column('text')
    Mensaje : string;



}
