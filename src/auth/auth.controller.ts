
import { Controller, Post, Body, Get, UseGuards, Req, Put, Patch, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';

import { CreateUserDto, LoginUserDto, UpdateUserDto, VerifyCodeDto } from './dto';
import { Auth, GetUser } from './decorators';
import { ValidRoles } from './interfaces';
import { user } from './entities';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('register')
  @ApiResponse({ status: 201, description: 'Product was created', type: user  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.createUser(createAuthDto);
  }

  @Post('VerifyEmail')
  verifyEmail(@Body() verifyEmailDto: VerifyCodeDto) {
    return this.authService.verifyEmailWithCode(verifyEmailDto);
  }

  @Post('GenerateCode')
  generateCode(@Body() emailData: { email: string }) {
    return this.authService.generateNewVerificationCode( emailData );
  }
  
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto ) {
    return this.authService.login( loginUserDto );
  }
  
  @Get('getInfoUser')
  @Auth( )  
  getInfoUserbyToken(
    @Req() request: Express.Request,
    @GetUser() User: user,
  ) {
    return {
      ok: true,
      User
    }
  }


  @Patch('updateInfoUser')
  @Auth()
  UpdateinfoUser(
    @Req() request: Express.Request,
    @GetUser('id') userId: string,
    
    @Body() updateData: UpdateUserDto,
  ) {
    return this.authService.updateInfoUser( userId, updateData );
  }
  
   
  @Post('forgotPassword')
  forgotPassword(@Body() emailData: { email: string }) {
    return this.authService.forgotPassword( emailData );
  }
  
  @Post('verifyCodeResetPassword')
  verifyCodeResetPassword(@Body() verifyCodeDto: VerifyCodeDto) {
    return this.authService.verifyCodeResetPassword( verifyCodeDto );
  }
  
  @Post('changePassword')
  changePassword(@Body() emailData: { email: string, password: string }) {
    return this.authService.changePassword( emailData );
  }

  
  @Get('InfoUser/:id')
  getInfoUserById( @Param('id' , ParseUUIDPipe ) id: string) {
    return this.authService.getInfoUserById( id );
  }  

  @Get('AllUsers')
  @Auth()
  getAllUsers(
    @GetUser('id') userId: string,
  ) {
    return this.authService.getAllUsers( userId );
  }

  @Get('revalidate-Token')
  @Auth()
  checkAuthStatus(
    @GetUser() user: user
  ) {
    return this.authService.RevalidateToken( user );
  } 


}
