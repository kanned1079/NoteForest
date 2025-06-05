import jwt from 'jsonwebtoken'
import {useRuntimeConfig} from '#imports'
import {User} from '@prisma/client'

export const generateToken = (user: User) => {

    console.log('generate Token')
    const config = useRuntimeConfig()
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
        },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
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