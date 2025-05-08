import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UserModule} from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { KnowledgeModule } from './knowledge/knowledge.module';
import { CommentModule } from './comment/comment.module';

@Module({
    imports: [
        JwtModule.register({
            secret: 'your-secret-key', // 替换为你的实际密钥
            signOptions: { expiresIn: '1h' }, // 设置令牌过期时间
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',           // 或 'postgres' / 'sqlite' / 'mariadb'
            host: '192.168.0.243',
            port: 3306,
            username: 'note',
            password: 'Passcode1!',
            database: 'note_forest',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,       // 开发环境设为 true，自动建表
        }),
        UserModule,
        AuthModule,
        KnowledgeModule,
        CommentModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
