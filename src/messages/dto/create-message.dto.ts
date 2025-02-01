
import { IsString } from "class-validator";

export class CreateMessageDto {

    @IsString()
    sender : string;
    
    @IsString()
    Reciever : string;
 
    @IsString()
    Mensaje : string;

}
