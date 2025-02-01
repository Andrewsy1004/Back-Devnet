import { IsEmail, IsString, Matches } from 'class-validator';

export class VerifyCodeDto {
  
  @IsString()
  verificationCode: string;
  
  @IsString()
  @IsEmail()
  @Matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, {
    message: 'The email must be a valid gmail',
  })
  email: string;


}
