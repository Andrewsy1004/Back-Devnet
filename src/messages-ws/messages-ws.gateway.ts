

import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';

import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { JwtPayload } from 'src/auth/interfaces';


@WebSocketGateway({ cors:true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer() wss: Server;

  constructor( 
       private readonly messagesWsService: MessagesWsService,
       private readonly jwtService: JwtService
  ) {}


  handleDisconnect( client: Socket ) {
    this.messagesWsService.removeClient( client.id );
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients() );
  }
   
  async handleConnection( client: Socket ) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;
    
    try {
      
      
      payload = this.jwtService.verify( token );  
      await this.messagesWsService.registerClient( client, payload.id );
      
      
      
      // client.emit('users-list', this.messagesWsService.getConnectedClients() );
      // Representa una conexión única entre el servidor y un cliente específico

    } catch (error) {
      client.disconnect();
      return;
    }

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients() );

  }

  
  @SubscribeMessage('send-private-message')
  async handlePrivateMessage(
    client: Socket,
    @MessageBody() payload: { Reciever: string; sender: string, Mensaje: string },
  ) {
  const { Reciever, sender, Mensaje } = payload;

  this.messagesWsService.CreteNewMessage(Reciever, sender, Mensaje);
  
  // Obtener todos los mensajes
  const messages = await this.messagesWsService.getAllTheMessages(Reciever, sender);

  // Emitir a todos los clientes conectados
  this.wss.emit('private-message', {
    sender,
    Reciever,
    Mensaje,
    messages
  });
  
}


  @SubscribeMessage('get-message-history')
  async getMessageHistory(
    client: Socket,
    payload: { Reciever: string; sender: string },
  ) {
    
    const { Reciever, sender } = payload;

    const messages = await this.messagesWsService.getAllTheMessages(Reciever, sender);

    
    client.emit('message-history', messages);
  }




}


  

  





