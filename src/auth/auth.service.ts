
import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { Not, Repository } from 'typeorm';

import { CreateUserDto, LoginUserDto, UpdateUserDto, VerifyCodeDto } from './dto';
import { user } from './entities';

import { EmailService } from 'src/email/email.service';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(user)
    private readonly userRepository: Repository<user>,

    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
        verificationCode: Math.floor(Math.random() * 1000000).toString(),
        verificationExpires: new Date(Date.now() + 30 * 60 * 1000),
      });

      await this.userRepository.save(user);
      delete user.password;

      await this.emailService.sendEmail(
        user.email,
        'Verify your email',
        user.verificationCode,
      );

      return {
        msg: 'User created successfully, check your email for verification code',
      };

    } catch (error) {
      this.handleDBErrors(error);
    }
  }


  async verifyEmailWithCode (verifyCodeDto: VerifyCodeDto) {
    try {
       const { email, verificationCode } = verifyCodeDto;
       
        const user = await this.userRepository.findOne({
          where: {
            email,
            isActive: false,
          },
        });

        if (!user) throw new BadRequestException('User not found');
        

        if (user.verificationCode !== verificationCode) throw new BadRequestException('Invalid verification code');
        
        const currentDate = new Date();
        if (currentDate > user.verificationExpires) throw new BadRequestException('Verification code has expired');
         
        user.isActive = true;
        user.verificationCode = null;
        user.verificationExpires = null;
        
        await this.userRepository.save(user);
        delete user.password;

        return {
          msg: 'User verified successfully',
          token: this.getJwtToken({ id: user.id }),
          user
        };
        
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      this.handleDBErrors(error);
    }
  }
  
  async generateNewVerificationCode(emailData: { email: string }) { 
    try {
        
        const { email } = emailData;

        const user = await this.userRepository.findOne({
          where: {
            email,
            isActive: false,
          },
        });

        if (!user) throw new BadRequestException('User not found');

        user.verificationCode = Math.floor(Math.random() * 1000000).toString();
        user.verificationExpires = new Date(Date.now() + 30 * 60 * 1000);

        await this.userRepository.save(user);

        await this.emailService.sendEmail(
          user.email,
          'Verify your email',
          user.verificationCode,
        );

        return {
          msg: 'Verification code generated successfully, check your email',
        };

    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      this.handleDBErrors(error);
    }
  }


  async login(loginUserDto: LoginUserDto ) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true, isActive: true, roles: true, fullName: true, urlPhoto: true }, 
    });

    if ( !user ) throw new UnauthorizedException('Credentials are not valid (email)');
         
    if( !user.isActive ) throw new UnauthorizedException('User is not verified');
    
    if ( !bcrypt.compareSync( password, user.password ) ) throw new UnauthorizedException('Credentials are not valid (password)');
    
    delete user.password;
    delete user.isActive;

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };
    
  }
  
  
  async updateInfoUser( userId: string, updateData: UpdateUserDto ) {
    try {

      const user = await this.userRepository.preload({
        id: userId,
        ...updateData,
      });

      if (!user) throw new BadRequestException('User not found');

      await this.userRepository.save(user);
       
      return {
        msg: 'User updated successfully'
      };
      
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      this.handleDBErrors(error);
    }
  }
  
  async forgotPassword(emailData: { email: string }) {
    try {
        
        const { email } = emailData;
                
        const user = await this.userRepository.findOne({
          where: {
            email,
            isActive: true,
          },
        });

        if (!user) throw new BadRequestException('User not found');

        user.verificationCode = Math.floor(Math.random() * 1000000).toString();
        user.verificationExpires = new Date(Date.now() + 30 * 60 * 1000);

        await this.userRepository.save(user);

        await this.emailService.sendEmail(
          user.email,
          'Reset your password',
          user.verificationCode,
        );

        return {
          msg: 'Reset password code generated successfully, check your email',
        };
      
    } catch (error) {
      if(error instanceof BadRequestException) throw error;
      this.handleDBErrors(error);
    }
  }


  async verifyCodeResetPassword(verifyCodeDto: VerifyCodeDto) {
    try {
        
        const { email, verificationCode } = verifyCodeDto;

        const user = await this.userRepository.findOne({
          where: {
            email,
            isActive: true,
          },
        });

        if (!user) throw new BadRequestException('User not found');

        if (user.verificationCode !== verificationCode) throw new BadRequestException('Invalid verification code');

        const currentDate = new Date();
        if (currentDate > user.verificationExpires) throw new BadRequestException('Verification code has expired');

        user.verificationCode = null;
        user.verificationExpires = null;

        await this.userRepository.save(user);

        return {
          msg: 'Verification code verified successfully',
        }
         
    } catch (error) {
      if(error instanceof BadRequestException) throw error;
      this.handleDBErrors(error);
    }

  }

  async changePassword(emailData: { email: string, password: string }) {
    try {
        
        const { email, password } = emailData;

        const user = await this.userRepository.findOne({
          where: {
            email,
            isActive: true,
          },
        });

        if (!user) throw new BadRequestException('User not found');

        user.password = bcrypt.hashSync(password, 10);

        await this.userRepository.save(user);

        return {
          msg: 'Password changed successfully',
        };

    } catch (error) {
      if(error instanceof BadRequestException) throw error;
      this.handleDBErrors(error);
    }
  }

  async getInfoUserById( id: string ) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        select: { email: true, fullName: true, urlPhoto: true, id: true, Descripcion: true, Rol: true },
      });

      if (!user) throw new BadRequestException('User not found');

      return {
        ...user,
      };

      
    } catch (error) {
      if(error instanceof BadRequestException) throw error;
      this.handleDBErrors(error); 
    }
  }

  
  async getAllUsers( userId: string ) {
    try {
        
        const users = await this.userRepository.find({
          where: { id: Not(userId) },
          select: { email: true, fullName: true, urlPhoto: true, id: true, Descripcion: true, Rol: true },
        });

        return users;
        
    } catch (error) {
      if( error instanceof BadRequestException ) throw error;
      this.handleDBErrors(error);
    }  
  }

  
  async RevalidateToken(  user: user ) {
    try {

      return {
         ...user,
         token : this.getJwtToken({ id: user.id })
      }
        
    } catch (error) {
      if ( error instanceof BadRequestException ) throw error;
      this.handleDBErrors(error);
    }
  }
 

  
  private getJwtToken( payload: JwtPayload ) {
    const token = this.jwtService.sign( payload );
    return token;
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
