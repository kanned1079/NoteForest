import {ConflictException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {User} from "./entities/user.entity";
import {Repository} from "typeorm";
import {raw} from "express";
import * as bcrypt from 'bcrypt';
import {UserLoginDto} from "./dto/auth-user";
import {NotFoundError} from "rxjs";
import {JwtService} from '@nestjs/jwt';
import {ResponseCode} from "../common/constants/response-code.enum";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {
    }

    // async login(userLoginDto: UserLoginDto) {
    //     console.log('Login req', userLoginDto)
    //     const {email, password} = userLoginDto;
    //     const user = await this.userRepository.findOne({
    //         where: {
    //             email,
    //         },
    //     });
    //
    //     if (user) {
    //         const isPasswordValid = await bcrypt.compare(password, user.password);
    //         if (isPasswordValid) {
    //             let payload = {
    //                 id: user.id,
    //                 email: user.email,
    //                 role: user.role
    //             }
    //             let token = this.jwtService.sign(payload)
    //             return {
    //                 code: ResponseCode.OK,
    //                 message: 'ok',
    //                 user: {
    //                     ...user,
    //                     password: '',
    //                     token: token
    //                 }
    //             };
    //         } else {
    //             // throw new ConflictException('password is not match')
    //             return {
    //                 code: ResponseCode.Conflict,
    //                 message: 'password is not match'
    //             }
    //         }
    //     } else {
    //         // throw new NotFoundException("user is not exist, please register first.")
    //         return {
    //             code: ResponseCode.NotFound,
    //             message: 'user is not exist, please register first.'
    //         }
    //     }
    // }

    async login(userLoginDto: UserLoginDto) {
        const {email, password} = userLoginDto;

        const user = await this.userRepository.findOne({where: {email}});

        if (!user) {
            throw new NotFoundException('User does not exist, please register first.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Password is incorrect.');
        }

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        const token = this.jwtService.sign(payload);

        // 移除 password 字段
        const {password: _, ...safeUser} = user;

        return {
            ...safeUser,
            token
        };
    }

    async create(createUserDto: CreateUserDto) {
        const {email, password} = createUserDto;

        const existingUser = await this.userRepository.findOne({
            where: {email},
            withDeleted: true, // 确保也能查到软删除的记录
        });

        if (existingUser) {
            if (existingUser.deleted_at === null) {
                throw new ConflictException('该邮箱已被注册，无法重复注册');
            }
            // 如果之前被删除，可以恢复或允许重新注册，视业务而定
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({
            ...createUserDto,
            password: hashedPassword,
        });

        const savedUser = await this.userRepository.save(user);

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        const token = this.jwtService.sign(payload);

        // 移除敏感信息
        const {password: _, ...safeUser} = savedUser;

        return {
            ...safeUser,
            token
        };
    }

    findAll() {
        return this.userRepository.find()
    }

    findOne(id: string) {
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
