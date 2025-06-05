// ~/server/api/document/index.post.ts
import { defineEventHandler, createError, readBody } from 'h3'
import prisma from '~/server/database/prisma'
import { CreateDocumentDto } from '~/server/dto/documentDto'
import authMiddleware from '~/server/utils/auth'
import { UserRole } from '@prisma/client'

export default defineEventHandler(async (event) => {
    await authMiddleware(event)

    const currentUser = event.context.auth

    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
        throw createError({
            statusCode: 403,
            message: '只有管理员可以创建文档',
        })
    }

    const body = await readBody(event)
    const parsed = CreateDocumentDto.safeParse(body)

    if (!parsed.success) {
        throw createError({
            statusCode: 400,
            message: parsed.error.errors.map((e) => e.message).join(', '),
        })
    }

    const { title, subtitle, category, content, image_url } = parsed.data

    const existing = await prisma.document.findFirst({
        where: {
            title,
            deleted_at: null,
        },
    })

    if (existing) {
        throw createError({
            statusCode: 409,
            message: `已存在标题为 [${title}] 的文档`,
        })
    }

    await prisma.document.create({
        data: {
            title,
            subtitle,
            category,
            content,
            image_url,
        },
    })

    return {
        code: 200,
        message: '新文档已保存',
    }
})