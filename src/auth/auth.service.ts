import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './dto/jwt-payload.dto';
import { UserRepository } from '../Database/Repositories/user.repository';
import * as fs from 'fs';
import { User } from 'src/Database/Entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(
    authCredentialsDto: AuthCredentialsDto,
    image: {
      originalname: string;
      buffer: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>;
    },
  ): Promise<User> {
    try {
      const user = await this.userRepository.signUp(authCredentialsDto);
      fs.writeFile(
        `./images/profiles/${user.id}.jpeg`,
        Buffer.from(image.buffer),
        function (err) {
          if (err) {
            throw new InternalServerErrorException(err);
          }
        },
      );
      return user;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    const user = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload: JwtPayload = { username: user.username };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken, user };
  }

  async verifyJwt(token: string): Promise<any> {
    try {
      const valid = await this.jwtService.verify(token);
      console.log(valid);
      if (valid) {
        return this.jwtService.sign({ username: valid.username });
      }
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
