// server/api/user/register.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import bcrypt from 'bcrypt'
import prisma from '~/server/database/prisma'
import { CreateUserDto, type CreateUserDtoType } from '~/server/dto/userDto'
import { generateToken } from '~/server/services/authService'
import {UserRole} from "@prisma/client";

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const parsed = CreateUserDto.safeParse(body)
    if (!parsed.success) {
        throw createError({
            statusCode: 400,
            message: parsed.error.errors.map(e => e.message).join(', '),
        })
    }

    const { email, password, username, role = UserRole.USER } = parsed.data

    // TODO 查找不包含软删除记录 注意错误
    const existingUser = await prisma.user.findFirst({
        where: { email, deleted_at: null },
    })

    if (existingUser) {
        if (!existingUser.deleted_at) {
            throw createError({ statusCode: 409, message: '该邮箱已被注册，无法重复注册' })
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
        data: {
            email,
            username,
            password: hashedPassword,
            role,
        },
    })

    const token = generateToken(newUser)

    const { password: _p, ...safeUser } = newUser

    return {
        user: safeUser,
        token,
    }
})