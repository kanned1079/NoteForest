import { defineEventHandler, getRouterParam, createError } from 'h3'
import prisma from '~/server/database/prisma'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    const idSchema = z.string().uuid({ message: '无效的文档 ID（UUID）' })
    const parsed = idSchema.safeParse(id)
    console.log('find doc: ', parsed.data)

    if (!parsed.success) {
        throw createError({
            statusCode: 400,
            message: parsed.error.errors.map(e => e.message).join(', '),
        })
    }

    const document = await prisma.document.findUnique({
        where: { id: parsed.data },
    })

    if (!document) {
        throw createError({
            statusCode: 404,
            message: `uuid: ${parsed.data} not found`,
        })
    }

    return document
})