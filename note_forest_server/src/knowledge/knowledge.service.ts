import {ConflictException, Injectable, NotFoundException, Res} from '@nestjs/common';
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
        const {title, subtitle, category, content} = createKnowledgeDto
        const existingKnowledge = await this.knowledgeRepository.findOne({
            where: {
                title: title
            }
        })

        if (existingKnowledge) {
            if (existingKnowledge.deleted_at === null) {
                // return {
                //     code: ResponseCode.Conflict,
                //     message: `this document of the title [${title}] has already existed.`
                // }
                throw new ConflictException(`this document of the title [${title}] has already existed.`)
            }
        }

        await this.knowledgeRepository.save(this.knowledgeRepository.create({
            title,
            subtitle,
            category,
            content,
        }))

        return {
            code: ResponseCode.OK,
            message: 'new document has been saved.'
        }
    }

    // async findAll(fetchKnowledgeDto: FetchKnowledgeDto) {
    //     const { page = 1, size = 10, search = '' } = fetchKnowledgeDto;
    //     const skip = (page - 1) * size;
    //
    //     const queryBuilder: SelectQueryBuilder<Knowledge> = this.knowledgeRepository.createQueryBuilder('knowledge');
    //
    //     if (fetchKnowledgeDto.list) {
    //         queryBuilder.select([
    //             'knowledge.id',
    //             'knowledge.title',
    //             'knowledge.subtitle',
    //             'knowledge.category',
    //             'knowledge.created_at',
    //             'knowledge.updated_at',
    //         ]);
    //     }
    //
    //     if (search) {
    //         queryBuilder.where('knowledge.title LIKE :search', { search: `%${search}%` });
    //     }
    //
    //     const [knowledges, total] = await queryBuilder
    //         .orderBy('knowledge.created_at', 'DESC') // ✅ 按照创建时间倒序排序
    //         .skip(skip)
    //         .take(size)
    //         .getManyAndCount();
    //
    //     return {
    //         code: ResponseCode.OK,
    //         message: 'ok',
    //         data: knowledges,
    //         total,
    //         page,
    //         size,
    //         search,
    //     };
    // }

    async findAll(fetchKnowledgeDto: FetchKnowledgeDto) {
        const { page = 1, size = 10, search = '', list } = fetchKnowledgeDto;
        const skip = (page - 1) * size;

        const queryBuilder = this.knowledgeRepository.createQueryBuilder('knowledge');

        if (list) {
            queryBuilder.select([
                'knowledge.id',
                'knowledge.title',
                'knowledge.subtitle',
                'knowledge.category',
                'knowledge.created_at',
                'knowledge.updated_at',
            ]);
        }

        if (search) {
            queryBuilder.where('knowledge.title LIKE :search', { search: `%${search}%` });
        }

        const [knowledges, total] = await queryBuilder
            .orderBy('knowledge.created_at', 'DESC')
            .skip(skip)
            .take(size)
            .getManyAndCount();

        return {
            documents: knowledges,
            total,
            page,
            size,
            search,
        };
    }

    async findOne(id: string) {
        const doc = await this.knowledgeRepository.findOne({
            where: {id}
        })
        if (!doc) throw new NotFoundException(`uuid:${id} not found`)
        return doc
    }

    update(id: string, updateKnowledgeDto: UpdateKnowledgeDto) {
        return `This action updates a #${id} knowledge`;
    }

    remove(id: string) {
        return `This action removes a #${id} knowledge`;
    }
}
