import { defineEventHandler, readBody, getRouterParam, createError } from 'h3'
import { UpdateUserPasswordDto } from '~/server/dto/userDto'
import prisma from '~/server/database/prisma'
import bcrypt from 'bcrypt'
import authMiddleware from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
    await authMiddleware(event)

    const targetUserId = getRouterParam(event, 'id')
    const currentUser = event.context.auth

    if (!currentUser || currentUser.id !== targetUserId) {
        throw createError({ statusCode: 403, message: '禁止操作他人账号' })
    }

    const body = await readBody(event)
    const parsed = UpdateUserPasswordDto.safeParse(body)

    if (!parsed.success) {
        throw createError({
            statusCode: 400,
            message: parsed.error.errors.map((e) => e.message).join(', '),
        })
    }

    const { previousPassword, newPassword } = parsed.data

    const user = await prisma.user.findUnique({ where: { id: targetUserId } })

    if (!user) {
        throw createError({ statusCode: 404, message: '用户不存在' })
    }

    const isOldPasswordCorrect = await bcrypt.compare(previousPassword, user.password)
    if (!isOldPasswordCorrect) {
        throw createError({ statusCode: 409, message: '旧密码错误' })
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
        where: { id: targetUserId },
        data: { password: hashedNewPassword },
    })

    return { message: '密码修改成功' }
})