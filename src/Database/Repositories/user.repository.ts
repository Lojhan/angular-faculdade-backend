import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository } from 'typeorm';
import { AuthCredentialsDto } from '../../auth/dto/auth-credentials.dto';
import { User } from '../Entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { UserDocument } from '../Schemas/user.schema';

@EntityRepository(User)
export class UserRepository {
  async signUp(
    authCredentialsDto: AuthCredentialsDto,
    userModel: Model<UserDocument>,
  ): Promise<UserDocument> {
    const { username, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();

    try {
      return userModel.create({
        username,
        password: await this.hashPassoword(password, salt),
        salt,
        type: 'adm',
      });
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
    userModel: Model<UserDocument>,
  ): Promise<UserDocument> {
    const { username, password } = authCredentialsDto;

    const user = await userModel.findOne({ username });

    if (await this.validatePassword(password, user.password, user.salt)) {
      return user;
    } else {
      return null;
    }
  }

  private async hashPassoword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  private async validatePassword(
    inputPassword: string,
    password: string,
    salt: string,
  ): Promise<boolean> {
    const hash = await bcrypt.hash(inputPassword, salt);
    return hash == password;
  }
}
