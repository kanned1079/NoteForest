import prisma from '~/server/database/prisma'
import authMiddleware from '~/server/utils/auth'
import { UserRole } from '@prisma/client'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
    // 鉴权
    await authMiddleware(event)

    const currentUser = event.context.auth
    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
        throw createError({ statusCode: 403, message: '只有管理员可以访问统计信息' })
    }

    // 查询总用户数量
    const usersCount = await prisma.user.count({
        where: {
            deleted_at: null, // 忽略软删除用户
        },
    })

    // 查询文档相关数据
    const [totalDocs, deletedDocs] = await Promise.all([
        prisma.document.count(),
        prisma.document.count({
            where: {
                deleted_at: {
                    not: null,
                },
            },
        }),
    ])

    const result = {
        users: usersCount,
        documents: {
            total: totalDocs,
            deleted: deletedDocs,
            active: totalDocs - deletedDocs,
        },
    }

    return result
})