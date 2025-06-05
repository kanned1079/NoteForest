import {defineEventHandler, getHeader, createError} from "h3";
import {verifyToken} from "~/server/services/authService";

// export default defineEventHandler(async (event) => {
//     const authHeader = getHeader(event, 'authorization')
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         throw createError({ statusCode: 401, message: '未提供 Token' })
//     }
//     const token = authHeader.split(' ')[1]
//     const decoded = verifyToken(token)
//
//     if (!decoded) {
//         throw createError({ statusCode: 401, message: 'Token 无效或过期' })
//     }
//
//     // 挂载到 event.context 里，后续可用
//     event.context.auth = decoded
// })



export default defineEventHandler(async (event) => {
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw createError({ statusCode: 401, message: '未提供 Token' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    if (!decoded) {
        throw createError({ statusCode: 401, message: 'Token 无效' })
    }

    event.context.auth = decoded
})