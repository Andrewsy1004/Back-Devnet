
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { user } from './entities';
import { EmailModule } from 'src/email/email.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],

  imports: [
    ConfigModule,

    TypeOrmModule.forFeature([ user ]),
    
    PassportModule.register({ defaultStrategy: 'jwt' }),
     
     
    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],

      useFactory: ( configService: ConfigService ) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn:'2h'
          }
        }
      }

    }),
    
    EmailModule,
  ],


  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule,  AuthService]

})
export class AuthModule {}
