// ~/server/api/document/index/[id].delete.ts
import { defineEventHandler, getRouterParam, createError } from 'h3'
import prisma from '~/server/database/prisma'
import authMiddleware from '~/server/utils/auth'
import { UserRole } from '@prisma/client'

export default defineEventHandler(async (event) => {
    await authMiddleware(event)

    const currentUser = event.context.auth
    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
        throw createError({ statusCode: 403, message: '只有管理员可以删除文档' })
    }

    const id = getRouterParam(event, 'id')
    if (!id) {
        throw createError({ statusCode: 400, message: '缺少文档ID' })
    }

    // 软删除：设置deleted_at为当前时间
    const now = new Date()
    const result = await prisma.document.updateMany({
        where: { id, deleted_at: null },
        data: { deleted_at: now }
    })

    if (result.count === 0) {
        throw createError({ statusCode: 404, message: `文档uuid:${id}不存在或已删除` })
    }

    return {
        code: 200,
        message: '文档已软删除'
    }
})