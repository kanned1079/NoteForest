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
import {UpdateUsernameDto} from "./dto/update-username.dto";
import {UpdateUserPasswordDto} from "./dto/update-user-password.dto";

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

    // updateUserPassword 修改用户密码
    async updateUserPassword(id: string, updateUserPasswordDto: UpdateUserPasswordDto) {
        const { previousPassword, newPassword } = updateUserPasswordDto;

        const user = await this.userRepository.findOne({ where: { id } });

        if (!user) {
            throw new NotFoundException('User not found.');
        }

        const isOldPasswordCorrect = await bcrypt.compare(previousPassword, user.password);
        if (!isOldPasswordCorrect) {
            throw new ConflictException('Previous password is incorrect.');
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await this.userRepository.save(user);

        return { message: 'Password updated successfully.' };
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

    async updateUsername(id: string, updateUsernameDto: UpdateUsernameDto) {
        const user = await this.userRepository.findOne({
            where: {
                id,
            }
        })
        if (!user) throw new NotFoundException(`user with uuid:${id} not found`)
        if (user.username === updateUsernameDto.username) throw new ConflictException('new username must be different from previous')
        user.username = updateUsernameDto.username.trim()
        await this.userRepository.save(user)
        return {
            username: user.username
        }
    }



    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
