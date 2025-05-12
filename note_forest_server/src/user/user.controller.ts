import {Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards} from '@nestjs/common';
import {UserService} from './user.service';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {UserLoginDto} from "./dto/auth-user";
import {AdminGuard} from "../auth/admin.guard";
import {JwtGuard} from "../auth/jwt/jwt.guard";

@Controller({
    path: '/user',
    version: '1'
})
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Post('/register')
    @UsePipes(new ValidationPipe({whitelist: true}))
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Get()
    @UseGuards(JwtGuard, AdminGuard)
    findAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtGuard, AdminGuard)
    findOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtGuard)
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(+id, updateUserDto);
    }

    @UseGuards(JwtGuard, AdminGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userService.remove(+id);
    }

    @Post('/login')
    @UsePipes(new ValidationPipe({whitelist: true}))
    login(@Body() userLoginDto: UserLoginDto) {
        return this.userService.login(userLoginDto)
    }

}
