
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";

import { ExtractJwt, Strategy } from "passport-jwt";

import { JwtPayload } from "../interfaces";
import { Repository } from "typeorm";
import { user } from "../entities";


@Injectable()  // THAT´S A PROVIDER
export class JwtStrategy extends PassportStrategy( Strategy ) {

    constructor(
        @InjectRepository( user )
        private readonly userRepository: Repository<user>,

        configService: ConfigService
    ) {

        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }


    async validate( payload: JwtPayload ): Promise<user> {
        
        const { id } = payload;

        const user = await this.userRepository.findOneBy({ id });

        if ( !user ) throw new UnauthorizedException('Token not valid')
            
        if ( !user.isActive ) throw new UnauthorizedException('User is inactive, talk with an admin');
        
        delete user.verificationCode;
        delete user.verificationExpires;

        return user;
    }

}