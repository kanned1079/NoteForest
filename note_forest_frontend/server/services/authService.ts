import jwt from 'jsonwebtoken'
import {useRuntimeConfig} from '#imports'
import {User} from '@prisma/client'

export const generateToken = (user: User): string => {
    console.log('generate Token for ' + user.email)
    // const config = useRuntimeConfig()
    return jwt.sign({
                id: user.id,
                email: user.email,
                role: user.role,
    },
        process.env.JWT_SECRET as string,
        {
        algorithm: 'HS512',
        expiresIn: '3d'
    })
}

export const verifyToken = (token: string): {id: string, role: string} | null => {

    // console.log('call verifyToken')
    const config = useRuntimeConfig()
    try {
        return jwt.verify(token, process.env.JWT_SECRET as string) as {id: string, role: string}
    } catch (e: any) {
        console.error(e)
        return null
    }
}