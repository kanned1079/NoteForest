import {getUsers} from "~/server/services/userService";
import {defineEventHandler} from "h3";

import authMiddleware from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
    await authMiddleware(event)

    return await getUsers()
})