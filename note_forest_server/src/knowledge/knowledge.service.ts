import {Injectable} from '@nestjs/common';
import {CreateKnowledgeDto} from './dto/create-knowledge.dto';
import {UpdateKnowledgeDto} from './dto/update-knowledge.dto';
import {JwtModule} from "@nestjs/jwt"
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import {QueryBuilder, Repository, SelectQueryBuilder} from "typeorm";
import {Knowledge} from "./entities/knowledge.entity";
import {JwtService} from "@nestjs/jwt"
import {FetchKnowledgeDto} from "./dto/fetch-knowledge.dto";

@Injectable()
export class KnowledgeService {
    constructor(
        @InjectRepository(Knowledge)
                private readonly knowledgeRepository: Repository<Knowledge>,
                private readonly jwtService: JwtService,) {
    }


    create(createKnowledgeDto: CreateKnowledgeDto) {
        return 'This action adds a new knowledge';
    }

    async findAll(fetchKnowledgeDto: FetchKnowledgeDto) {
        const { page = 1, size = 10, search = '' } = fetchKnowledgeDto;
        const skip = (page - 1) * size;

        const queryBuilder: SelectQueryBuilder<Knowledge> = this.knowledgeRepository.createQueryBuilder('knowledge');

        if (search) {
            queryBuilder.where('knowledge.title LIKE :search', { search: `%${search}%` });
        }

        const [knowledges, total] = await queryBuilder
            .skip(skip)
            .take(size)
            .getManyAndCount();

        return {
            data: knowledges,
            total,
            page,
            size,
            search
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
