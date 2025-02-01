

import { IsNumber, IsOptional, Max, Min } from "class-validator";

export class PaginationDto {
    
    @IsOptional()
    @IsNumber()
    @Min(0)
    skip?: number = 0;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(50)
    take?: number = 10;

}