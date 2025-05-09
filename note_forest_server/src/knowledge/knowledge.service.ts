import {ConflictException, Injectable, Res} from '@nestjs/common';
import {CreateKnowledgeDto} from './dto/create-knowledge.dto';
import {UpdateKnowledgeDto} from './dto/update-knowledge.dto';
import {JwtModule} from "@nestjs/jwt"
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import {QueryBuilder, Repository, SelectQueryBuilder} from "typeorm";
import {Knowledge} from "./entities/knowledge.entity";
import {JwtService} from "@nestjs/jwt"
import {FetchKnowledgeDto,} from "./dto/fetch-knowledge.dto";
import * as bcrypt from "bcrypt";
import {raw} from "express";
import {ResponseCode} from "../common/constants/response-code.enum";

@Injectable()
export class KnowledgeService {
    constructor(
        @InjectRepository(Knowledge)
                private readonly knowledgeRepository: Repository<Knowledge>,
                private readonly jwtService: JwtService,) {
    }


    async create(createKnowledgeDto: CreateKnowledgeDto) {
        // const {email, password} = createUserDto;
        const {title, subtitle, category, content} = createKnowledgeDto
        // const existingUser = await this.userRepository.findOne({
        //     where: {
        //         email,
        //     },
        // });

        const existingKnowledge = await this.knowledgeRepository.findOne({
            where: {
                title: title
            }
        })

        if (existingKnowledge) {
            if (existingKnowledge.deleted_at === null) {
                return {
                    code: ResponseCode.Conflict,
                    message: `this document of the title [${title}] has already existed.`
                }
            }
        }

        // const newKnowledgeItem = this.knowledgeRepository.create({
        //     ...createKnowledgeDto
        // })

        await this.knowledgeRepository.save(this.knowledgeRepository.create({
            ...createKnowledgeDto
        }))

        return {
            code: ResponseCode.OK,
            message: 'new document has been saved.'
        }


        //
        // if (existingUser) {
        //     if (existingUser.deleted_at === null) {
        //         throw new ConflictException('该邮箱已被注册，无法重复注册');
        //     }
        // }
        //
        // const hashedPassword = await bcrypt.hash(password, 10);
        // const user = this.userRepository.create({
        //     ...createUserDto,
        //     password: hashedPassword,
        // });
        // await this.userRepository.save({
        //     ...user,
        // });
        // return {
        //     message: 'register successfully.'
        // }
    }

    async findAll(fetchKnowledgeDto: FetchKnowledgeDto) {
        const { page = 1, size = 10, search = '' } = fetchKnowledgeDto;
        const skip = (page - 1) * size;

        const queryBuilder: SelectQueryBuilder<Knowledge> = this.knowledgeRepository.createQueryBuilder('knowledge');

        if (fetchKnowledgeDto.list) {
            // 如果是列表模式，不查询 content 字段
            queryBuilder.select([
                'knowledge.id',
                'knowledge.title',
                'knowledge.subtitle',
                'knowledge.category',
                'knowledge.created_at',
                'knowledge.updated_at',
                // 可根据需要添加更多字段，但不包含 content
            ]);
        }

        if (search) {
            queryBuilder.where('knowledge.title LIKE :search', { search: `%${search}%` });
        }

        const [knowledges, total] = await queryBuilder
            .skip(skip)
            .take(size)
            .getManyAndCount();

        return {
            code: ResponseCode.OK,
            message: 'ok',
            data: knowledges,
            total,
            page,
            size,
            search,
        };
    }

    findOne(id: number) {
        return `This action returns a #${id} knowledge`;
    }

    update(id: number, updateKnowledgeDto: UpdateKnowledgeDto) {
        return `This action updates a #${id} knowledge`;
    }

    remove(id: number) {
        return `This action removes a #${id} knowledge`;
    }
}
