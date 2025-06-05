// ~/server/api/document/index.put.ts
import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import prisma from '~/server/database/prisma'
import { CreateDocumentDto } from '~/server/dto/documentDto' // 创建和更新用同一套校验
import authMiddleware from '~/server/utils/auth'
import { UserRole } from '@prisma/client'

export default defineEventHandler(async (event) => {
    await authMiddleware(event)

    const currentUser = event.context.auth
    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
        throw createError({ statusCode: 403, message: '只有管理员可以更新文档' })
    }

    // 路由参数中必须有id，假设接口设计为 /api/document/index/[id].put.ts
    const id = getRouterParam(event, 'id')
    if (!id) {
        throw createError({ statusCode: 400, message: '缺少文档ID' })
    }

    const body = await readBody(event)

    // 校验输入，允许部分字段更新，这里用 CreateDocumentDto.optional()
    // 或者自己写一个 UpdateDocumentDto 并全部属性设为 optional
    // 为简便示例，先用 CreateDocumentDto.partial()
    const parsed = CreateDocumentDto.partial().safeParse(body)
    if (!parsed.success) {
        throw createError({
            statusCode: 400,
            message: parsed.error.errors.map((e) => e.message).join(', '),
        })
    }

    // 查找目标文档
    const doc = await prisma.document.findUnique({ where: { id } })
    if (!doc) {
        throw createError({ statusCode: 404, message: `uuid:${id} 未找到` })
    }

    const dataToUpdate = parsed.data
    // 判断是否有变化
    let hasChanged = false
    for (const key of Object.keys(dataToUpdate)) {
        if (dataToUpdate[key] !== undefined && dataToUpdate[key] !== doc[key]) {
            hasChanged = true
            break
        }
    }

    if (!hasChanged) {
        throw createError({ statusCode: 400, message: '无更新字段或无变化' })
    }

    // 更新文档
    await prisma.document.update({
        where: { id },
        data: dataToUpdate,
    })

    return {
        code: 200,
        message: '更新成功',
    }
})