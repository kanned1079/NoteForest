import { z } from 'zod'

export const FetchDocumentDto = z.object({
    page: z.coerce.number().optional().default(1),
    size: z.coerce.number().optional().default(10),
    search: z.string().optional().default(''),
    list: z.coerce.boolean().optional(),
})

export type FetchDocumentDtoType = z.infer<typeof FetchDocumentDto>

export const CreateDocumentDto = z.object({
    title: z.string().min(1, '标题不能为空'),
    subtitle: z.string().optional(),
    category: z.string().optional(),
    content: z.string().optional(),
    image_url: z.string().optional(),
})

export type CreateDocumentDtoType = z.infer<typeof CreateDocumentDto>

