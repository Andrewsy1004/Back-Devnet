

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Socket } from 'socket.io';
import { Not, Repository } from 'typeorm';

import { user } from 'src/auth/entities/user.entity';
import { Message } from 'src/messages/entities/message.entity';


interface ConnectedClients {
    [id: string]: {
      socket: Socket;
      user: user;
    };
  }


@Injectable()
export class MessagesWsService {

    private connectedClients: ConnectedClients = {};
    
    constructor(
        @InjectRepository(user)
        private readonly userRepository: Repository<user>,

        @InjectRepository(Message)
        private readonly MessageRepository: Repository<Message>,

    ) {}
    
    async registerClient(client: Socket, userId: string) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) throw new Error('User not found');
        if (!user.isActive) throw new Error('User not active');
    
        this.checkUserConnection(user);
    
        this.connectedClients[client.id] = {
          socket: client,
          user: user,
        };
    }

    removeClient(clientId: string) {
     delete this.connectedClients[clientId];
    }
    

    getConnectedClients(): { socketId: string; userId: string; username: string }[] {
      return Object.entries(this.connectedClients).map(([socketId, client]) => ({
        socketId,
        userId: client.user.id,
        username: client.user.email,
        FullName: client.user.fullName
      }));
    }
    

    private checkUserConnection(user: user) {
        for (const clientId of Object.keys(this.connectedClients)) {
          const connectedClient = this.connectedClients[clientId];
    
          if (connectedClient.user.id === user.id) {
            connectedClient.socket.disconnect();
            break;
          }
        }
    }
    

    async CreteNewMessage(Reciever: string, sender: string, Mensaje: string) {
      
        const message = this.MessageRepository.create({
          sender: { id: sender },
          Reciever: { id: Reciever },
          Fecha: new Date(),
          Mensaje,
        });
    
        await this.MessageRepository.save(message);
    
        return message;
    }

    async getAllTheMessages(Reciever: string, sender: string) {
      
      const messages = await this.MessageRepository.find({
        where: [
          {
            sender: { id: sender },
            Reciever: { id: Reciever },
          },
          {
            sender: { id: Reciever },
            Reciever: { id: sender },
          },
        ],
        order: {
          Fecha: 'ASC', 
        },
      });

      const messagesWithNames = messages.map((message) => {
        return {
          ...message,
          sender: message.sender.fullName,
          Reciever: message.Reciever.fullName,
        };
      });


      return messagesWithNames;
     
    }

    

}
