import {z} from 'zod'

export const UserLoginDto = z.object({
    email: z.string().email(),
    password: z.string().min(6, '密码不能少于6位'),
})

export type UserLoginDtoType = z.infer<typeof UserLoginDto>

export const CreateUserDto = z.object({
    email: z.string().email('无效的邮箱地址'),
    password: z.string().min(6, '密码不能少于 6 位'),
    username: z.string().optional(),
    role: z.enum(['user', 'admin']).optional(), // 默认值在处理函数中加
})

export type CreateUserDtoType = z.infer<typeof CreateUserDto>

export const UpdateUsernameDto = z.object({
    id: z.string(),
    username: z
        .string()
        .min(4, { message: '用户名长度需在 4 - 20 位之间，且不能以数字开头' })
        .max(20, { message: '用户名长度需在 4 - 20 位之间，且不能以数字开头' })
        .regex(/^[^\d]/, { message: '用户名不能以数字开头' }),
})

export type UpdateUsernameInput = z.infer<typeof UpdateUsernameDto>

export const UpdateUserPasswordDto = z.object({
    previousPassword: z.string().min(6, '旧密码不能为空'),
    newPassword: z.string().min(6, '新密码长度至少为 6 位'),
})

export type UpdateUserPasswordDtoType = z.infer<typeof UpdateUserPasswordDto>