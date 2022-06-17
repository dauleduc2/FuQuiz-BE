import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserService } from '../../user/user.service';
import { JwtToken } from '../../core/interface';
import { Role, UserRole } from '../../core/models';
import { constant } from '../../core';

@Injectable()
export class ExpertGuard implements CanActivate {
    constructor(private readonly authService: AuthService, private readonly userService: UserService, private readonly reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req: Request = context.switchToHttp().getRequest();
        const roles = this.reflector.get<Role[]>('roles', context.getHandler()) || [];

        const authorization = req.headers['authorization'] || '';
        const token = this.getTokenFromHeader(authorization);
        // const token = req.cookies[constant.authController.tokenName] || '';

        const { data, error } = await this.authService.verifyToken<JwtToken>(token);
        if (error) {
            throw new HttpException({}, StatusCodes.UNAUTHORIZED);
        }

        const user = await this.userService.findUser('id', data.id);

        if (!user) {
            throw new HttpException({}, StatusCodes.UNAUTHORIZED);
        }

        if (roles.length && !roles.includes(user.role) && user.role.description !== UserRole.ADMIN && user.role.description !== UserRole.EXPERT) {
            throw new HttpException({}, StatusCodes.UNAUTHORIZED);
        }

        user.password = '';
        req.user = user;

        return true;
    }

    getTokenFromHeader(authorization: string): string {
        const accessToken = authorization.split(' ')[1];
        return accessToken;
    }
}
