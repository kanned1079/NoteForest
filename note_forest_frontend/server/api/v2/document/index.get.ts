import { defineEventHandler, getQuery } from 'h3'
import prisma from '~/server/database/prisma'
import { FetchDocumentDto } from '~/server/dto/documentDto'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const parsed = FetchDocumentDto.safeParse(query)

    if (!parsed.success) {
        throw createError({
            statusCode: 400,
            message: parsed.error.errors.map((e) => e.message).join(', '),
        })
    }

    const { page, size, search, list } = parsed.data
    const skip = (page - 1) * size

    console.log(page, size, search, list)

    const whereClause = search
        ? {
            title: {
                contains: search.toLowerCase(),
            },
            deleted_at: null,
        }
        : {
            deleted_at: null,
        }

    const selectClause = list
        ? {
            id: true,
            title: true,
            subtitle: true,
            category: true,
            image_url: true,
            created_at: true,
            updated_at: true,
        }
        : undefined

    const [documents, total] = await Promise.all([
        prisma.document.findMany({
            where: whereClause,
            select: selectClause,
            orderBy: {
                created_at: 'desc',
            },
            skip,
            take: size,
        }),
        prisma.document.count({
            where: whereClause,
        }),
    ])

    return {
        documents,
        total,
        page,
        size,
        search,
    }
})