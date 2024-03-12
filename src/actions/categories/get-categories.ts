'use server'

import prisma from "@/lib/prisma";

export const getCategories = async () => {
    try {
        const countries = await prisma.category.findMany({
            orderBy: {
                name: 'asc'
            }
        })

        return countries;
    } catch (error) {
        console.log(error);
        return [];
    }
}