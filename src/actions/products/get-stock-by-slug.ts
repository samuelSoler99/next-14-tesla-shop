'use server';

import prisma from "@/lib/prisma";

export const getStockBySlug = async (slug: string): Promise<number> => {
    try {

         // await sleep(3); solo para ver el skeleton del stock

        const product = await prisma.product.findFirst({
            select: {
                inStock: true
            },
            where: {
                slug: slug
            }
        });

        return product?.inStock ?? 0;
    } catch (error) {
        return 0;
    }
}