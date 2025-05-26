import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UserModule} from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { KnowledgeModule } from './knowledge/knowledge.module';


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        JwtModule.register({
            secret: 'your-secret-key', // 替换为你的实际密钥
            signOptions: { expiresIn: '1h' }, // 设置令牌过期时间
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule], // 👈 加上这一行！
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'mysql',
                host: config.get('DB_HOST'),
                port: parseInt(config.get('DB_PORT', '3306')),
                username: config.get('DB_USERNAME'),
                password: config.get('DB_PASSWORD'),
                database: config.get('DB_DATABASE'),
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: true,
            }),
        }),
        UserModule,
        AuthModule,
        KnowledgeModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
