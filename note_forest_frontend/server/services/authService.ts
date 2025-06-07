import jwt from 'jsonwebtoken'
import {useRuntimeConfig} from '#imports'
import {User} from '@prisma/client'

export const generateToken = (user: User): string => {

    console.log('generate Token for ' + user.email)
    const config = useRuntimeConfig()
    // console.log("jwtSecret: ", config.jwtSecret)
    // console.log("jwtExpiresIn: ", config.jwtExpiresIn)
    // console.log("from env: ", process.env.JWT_SECRET)
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
        },
        // config.jwtSecret,
        process.env.JWT_SECRET as string,
        {
            algorithm: 'HS256',
            // expiresIn: config.jwtExpiresIn
            expiresIn: process.env.JWT_EXPIRES_IN as string
        }
    )
}

export const verifyToken = (token: string): {id: string, role: string} | null => {

    console.log('call verifyToken')
    const config = useRuntimeConfig()
    try {
        return jwt.verify(token, config.jwtSecret as string) as {id: string, role: string}
    } catch (e: any) {
        console.error(e)
        return null
    }
}