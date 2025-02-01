
import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { MessagesService } from './messages.service';
import { CreateMessageDto, GetMessageDto } from './dto';

@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('createMessage')
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }
   
  @Get("getMessages")
  findAll(@Query() getMessageDto: GetMessageDto) {
     return this.messagesService.findAll(getMessageDto);
  }


}
