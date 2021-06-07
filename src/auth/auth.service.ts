import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './dto/jwt-payload.dto';
import { UserRepository } from '../Database/Repositories/user.repository';
import * as fs from 'fs';

import { User, UserDocument } from 'src/Database/Schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  private userRepository: UserRepository;

  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    this.userRepository = new UserRepository();
  }

  async signUp(
    authCredentialsDto: AuthCredentialsDto,
    image: {
      originalname: string;
      buffer: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>;
    },
  ): Promise<UserDocument> {
    try {
      const user = await this.userRepository.signUp(
        authCredentialsDto,
        this.userModel,
      );
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
      this.userModel,
    );
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload: JwtPayload = { username: user.username };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken, user };
  }

  async verifyJwt(token: string): Promise<any> {
    try {
      const valid = await this.jwtService.verify(token);
      if (valid) {
        return this.jwtService.sign({ username: valid.username });
      }
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
