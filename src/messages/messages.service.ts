
import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

import { CreateMessageDto, GetMessageDto } from './dto';
import { Message } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class MessagesService {

  private readonly logger = new Logger('MessagesService');

   constructor(
      @InjectRepository(Message)
      private readonly MessageRepository: Repository<Message>,

     
    ) {}
  

  async create(createMessageDto: CreateMessageDto) {
    try {
      
      const { sender, Reciever, Mensaje } = createMessageDto;

      const message = this.MessageRepository.create({
        sender: { id: sender },
        Reciever: { id: Reciever },
        Fecha: new Date(),
        Mensaje,
      });

      await this.MessageRepository.save(message);

      return message;

    } catch (error) {
       if (error instanceof BadRequestException) throw error;
       this.handleDBErrors(error);
    }
  }
  
  async findAll(getMessageDto: GetMessageDto) {
    try {

      const { sender, Reciever } = getMessageDto;
       
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

      if (!messages) throw new BadRequestException('Messages not found');
      
      
      const messagesWithNames = messages.map((message) => {
        return {
          ...message,
          sender: message.sender.fullName,
          Reciever: message.Reciever.fullName,
        };
      });


      return messagesWithNames;

    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      this.handleDBErrors(error);
    }
  }

  

  private handleDBErrors(error: any): never {
      if (error.code === '23505') {
        const detailMessage = `${error.detail}, so instead generate a new code of verification.`;
        throw new BadRequestException(detailMessage);
      }
      this.logger.error(error);
      throw new InternalServerErrorException('Please check server logs');
  }

  

}
