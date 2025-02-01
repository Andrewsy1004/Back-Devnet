
import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';


export class CreateUserDto {
     
    @ApiProperty({ example: 'andres@example.com',  description: 'Email User', uniqueItems: true })
    @IsString()
    @IsEmail()
    @Matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, {
        message: 'The email must be a valid gmail',
      })
    email: string;


    @ApiProperty({ example: '123456',  description: 'Password User', uniqueItems: true })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;


    @ApiProperty({ example: 'Andres',  description: 'Name User', uniqueItems: true })
    @IsString()
    @MinLength(4)
    fullName: string;
    
    
    @IsOptional()
    @IsString()
    urlPhoto?: string;

    @IsOptional()
    @IsString()
    Rol?: string;


    @IsOptional()
    @IsString()
    Descripcion?: string;

}
