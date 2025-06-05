// server/api/user/login.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import bcrypt from "bcrypt";
import {UserLoginDto, type UserLoginDtoType} from "~/server/dto/userDto";
import { generateToken } from '~/server/services/authService'
import prisma from '~/server/database/prisma'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const parsed = UserLoginDto.safeParse(body)
    if (!parsed.success) {
        throw createError({
            statusCode: 400,
            message: parsed.error.errors.map((e) => e.message).join(', '),
        })
    }


    const { email, password } = parsed.data

    console.log(email, password)

    const user = await prisma.user.findFirst({ where: { email, deleted_at: null } })

    if (!user) {
        throw createError({
            statusCode: 404,
            message: 'User does not exist, please register first.',
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        throw createError({
            statusCode: 401,
            message: 'Password is incorrect.',
        })
    }

    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
    }

    const token = generateToken(payload)

    // 返回安全用户数据 + token
    const { password: _p, ...safeUser } = user

    return {
        user: safeUser,
        token,
    }
})