import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtGuard } from './jwt/jwt.guard';
import { JwtStrategy } from './jwt.strategy';
import { AdminGuard } from './admin.guard';

@Module({
    imports: [
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '10m' },
        }),
    ],
    providers: [JwtGuard, JwtStrategy, AdminGuard],
    exports: [JwtModule, JwtGuard, AdminGuard],
})
export class AuthModule {}