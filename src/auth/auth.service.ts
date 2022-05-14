import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignupReqDto, ResTokens, SigninReqDto, RefreshTokenReqDto } from './dto/auth.dto';
import { IAuthService } from './interfaces/auth.service.interfaces';
import { UserEntity } from './models/auth.entity';
import * as bcrypt from 'bcrypt'
import { AT_EXPIREIN, RT_EXPIREIN } from './constants/auth.constants';
import { ISaveUserEntity } from './models/auth.entity.interfaces';

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,

        private readonly jwtService: JwtService,
    ){}

    async signup(req: SignupReqDto): Promise<ResTokens> {
        if(req.password !== req.confirmPassword) throw new BadRequestException('Password not match')

        try {
            const hashPassword = await this.hashData(req.password)
            const saveUser: ISaveUserEntity = {
                email: req.email,
                hashPassword,
                username: req.username,
                line_uid: req.line_uid
            }
            
            await this.userRepository.save(saveUser)

            const tokens = await this.getToken(req.line_uid, req.email, req.username)

            await this.updateRtHash(req.line_uid, tokens.refreshToken)

            return tokens
        } catch (error) {
            throw new BadRequestException(error.detail)
        }
        
    }
    signin(req: SigninReqDto): Promise<ResTokens> {
        throw new Error('Method not implemented.');
    }
    logout(line_uid: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    refreshToken(req: RefreshTokenReqDto): Promise<ResTokens> {
        throw new Error('Method not implemented.');
    }

    async updateRtHash(line_uid: string, refreshToken: string) {
        const hashRt = await this.hashData(refreshToken)
        await this.userRepository.update({
            line_uid
        }, {
            hashRt
        })
    }
    async hashData(data: string): Promise<string> {
        return await bcrypt.hash(data, 10)
    }
    async getToken(line_uid: string, email: string, username: string): Promise<ResTokens> {
        const [at, rt] = await Promise.all([
            // access token
            this.jwtService.signAsync({
                sub: line_uid,
                email,
                username
            }, {
                secret: process.env.AT_SECRET,
                expiresIn: AT_EXPIREIN,
            }),

            // refresh token
            this.jwtService.signAsync({
                sub: line_uid,
                email,
                username
            }, {
                secret: process.env.RT_SECRET,
                expiresIn: RT_EXPIREIN,
            }),
        ])

        return {
            accessToken: at,
            refreshToken: rt
        }
    }

    

}