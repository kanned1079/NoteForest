// server/api/user/username/update/[id].put.ts
import {defineEventHandler, getRouterParam, readBody, createError} from 'h3'
import {UpdateUsernameDto} from '~/server/dto/userDto'
import prisma from '~/server/database/prisma'
import authMiddleware from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
    await authMiddleware(event)

    const targetUserId = getRouterParam(event, 'id') // 从 URL 中获取目标 ID
    const body = await readBody(event)

    // 验证 body
    const parsed = UpdateUsernameDto.safeParse({...body, id: targetUserId})

    if (!parsed.success) {
        throw createError({
            statusCode: 400,
            message: parsed.error.errors.map((e) => e.message).join(', '),
        })
    }

    // 当前登录用户（通过 token 中间件挂载的）
    const currentUser = event.context.auth
    if (!currentUser || currentUser.id !== targetUserId) {
        throw createError({statusCode: 403, message: '禁止操作他人账号'})
    }

    const {username} = parsed.data

    const updatedUser = await prisma.user.update({
        where: {id: targetUserId},
        data: {username},
    })

    return {
        id: updatedUser.id,
        username: updatedUser.username,
    }
})