import {BadRequestException, ConflictException, Injectable, NotFoundException, Res} from '@nestjs/common';
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
        const {title, subtitle, category, content, image_url} = createKnowledgeDto
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
            image_url
        }))

        return {
            code: ResponseCode.OK,
            message: 'new document has been saved.'
        }
    }

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
                'knowledge.image_url',
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

    async update(id: string, updateKnowledgeDto: UpdateKnowledgeDto) {
        console.log(id)
        const doc = await this.knowledgeRepository.findOne({ where: { id } });
        if (!doc) throw new NotFoundException(`uuid:${id} not found`);

        const { title, subtitle, category, content, image_url } = updateKnowledgeDto;

        let hasChanged = false;

        if (title !== undefined && title !== doc.title) {
            doc.title = title;
            hasChanged = true;
        }

        if (subtitle !== undefined && subtitle !== doc.subtitle) {
            doc.subtitle = subtitle;
            hasChanged = true;
        }

        if (category !== undefined && category !== doc.category) {
            doc.category = category;
            hasChanged = true;
        }

        if (content !== undefined && content !== doc.content) {
            doc.content = content;
            hasChanged = true;
        }

        if (image_url !== undefined && image_url !== doc.image_url) {
            doc.image_url = image_url;
            hasChanged = true;
        }

        if (!hasChanged) {
            throw new BadRequestException('No valid field to update or no changes detected.');
        }

        await this.knowledgeRepository.save(doc);

        return {
            code: ResponseCode.OK,
            message: 'Update successful',
        };
    }

    async remove(id: string) {
        const result = await this.knowledgeRepository.softDelete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Knowledge with id ${id} not found or already deleted`);
        }

        return {
            code: ResponseCode.OK,
            message: 'Knowledge soft-deleted successfully',
        };
    }
}
