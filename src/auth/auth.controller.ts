import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'src/Database/Entities/user.entity';
import { UserDocument } from 'src/Database/Schemas/user.schema';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { TokenPayload } from './dto/token-payload.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(FileInterceptor('image'))
  signUp(
    @UploadedFile() image: any,
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<UserDocument> {
    return this.authService.signUp(authCredentialsDto, image);
  }

  @Post('signin')
  signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<any> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Post('verify')
  verify(@Body(ValidationPipe) token: TokenPayload): Promise<any> {
    return this.authService.verifyJwt(token.token);
  }
}
