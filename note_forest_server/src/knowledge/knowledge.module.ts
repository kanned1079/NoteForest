import {Module} from '@nestjs/common';
import {KnowledgeService} from './knowledge.service';
import {KnowledgeController} from './knowledge.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Knowledge} from "./entities/knowledge.entity";
import {AuthModule} from "../auth/auth.module";

@Module({
    imports: [TypeOrmModule.forFeature([Knowledge]), AuthModule],
    controllers: [KnowledgeController],
    providers: [KnowledgeService],
})
export class KnowledgeModule {
}
