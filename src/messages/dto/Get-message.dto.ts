
import { IsString } from "class-validator";

export class GetMessageDto {
  
  @IsString()
  sender: string;

  @IsString()
  Reciever: string;

}
