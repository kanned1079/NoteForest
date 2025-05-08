import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {User} from "./entities/user.entity";
import {Repository} from "typeorm";
import {raw} from "express";
import * as bcrypt from 'bcrypt';
import {UserLoginDto} from "./dto/auth-user";
import {NotFoundError} from "rxjs";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {
    }

    async login(userLoginDto: UserLoginDto) {
        const {email, password} = userLoginDto;
        const user = await this.userRepository.findOne({
            where: {
                email,
            },
        });

        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
                let payload = {
                    id: user.id,
                    email: user.email,
                    role: user.role
                }
                let token = this.jwtService.sign(payload)
                return {
                    ...user,
                    password: '',
                    token: token
                };
            } else {
                throw new ConflictException('password is not match')
            }
        } else {
            throw new NotFoundException("user is not exist, please register first.")
        }
    }

    async create(createUserDto: CreateUserDto) {
        const {email, password} = createUserDto;
        const existingUser = await this.userRepository.findOne({
            where: {
                email,
            },
        });

        if (existingUser) {
            if (existingUser.deleted_at === null) {
                throw new ConflictException('该邮箱已被注册，无法重复注册');
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({
            ...createUserDto,
            password: hashedPassword,
        });
        await this.userRepository.save({
            ...user,
        });
        return {
            message: 'register successfully.'
        }
    }

    findAll() {
        return this.userRepository.find()
    }

    findOne(id: number) {
        return this.userRepository.findOneBy({
            id: id
        })
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
