import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../Database/Entities/user.entity';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);

export const validateAsADM = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();

    if (req.user.type != 'adm')
      throw new UnauthorizedException(
        'Essa rota é apenas para administradores',
      );
    return req.user;
  },
);

export const validateAsEXP = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();

    if (req.user.type != 'exp')
      throw new UnauthorizedException('Essa rota é apenas para expositores');
    return req.user;
  },
);

export const validateAsDEV = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();

    if (req.user.type != 'dev')
      throw new UnauthorizedException({
        message: 'Essa rota é apenas para desenvolvedores',
      });
    return req.user;
  },
);
