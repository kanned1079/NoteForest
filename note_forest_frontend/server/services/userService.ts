import prisma from "~/server/database/prisma";

export const getUsers = async () => {
    return await prisma.user.findMany()
}