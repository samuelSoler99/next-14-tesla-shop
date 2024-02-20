'use server'

import prisma from "@/lib/prisma"
import { Gender } from "@prisma/client";

interface PaginationOptions {
    page?: number;
    take?: number;
    gender?: Gender;
}

export const getPaginatedProductsWithImages = async ({ page = 1, take = 12, gender }: PaginationOptions) => {

    if (isNaN(Number(page))) page = 1;
    if (page < 1) page = 1;

    try {

        //1. obtener productos
        //todo meter estas dos en un promise.all
        const products = await prisma.product.findMany({
            take: take,
            skip: (page - 1) * take,
            include: {
                ProductImage: {
                    take: 2,
                    select: {
                        url: true
                    }
                },
                category: {
                    select: {
                        name: true
                    }
                }
            },
            where: {
                gender: gender
            }
        })


        //2. calcular total de paginas

        const totalCount = await prisma.product.count({
            where: {
                ...(gender ? { gender: gender } : {}),
            }
        });
        const totalPages = Math.ceil(totalCount / take);

        return {
            currentPage: page,
            totalPages: totalPages,
            products: products.map(product => ({
                ...product,
                images: product.ProductImage.map(image => image.url),
                // type: product.category.name
            }))

        }
    } catch (error) {
        throw new Error('no se pudo cargar los productos')
    }
}