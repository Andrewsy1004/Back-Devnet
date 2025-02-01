

import { IsBoolean, IsDateString, IsOptional, IsString } from "class-validator";


export class CreatePostDto {
   
    @IsString()
    title: string;
    
    @IsString()
    content: string;
    
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
    
    @IsString()
    photo: string;
    
    // @IsDateString()
    // publishedAt: Date;
    
    @IsDateString()
    @IsOptional()
    endedAt: Date;
      
   

}
