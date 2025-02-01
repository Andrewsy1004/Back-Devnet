
import { IsString } from "class-validator";

export class PostApplicantesDto {    
    @IsString()
    postId : string;


}
