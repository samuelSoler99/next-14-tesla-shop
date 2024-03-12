'use server'
import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { revalidatePath } from 'next/cache';
cloudinary.config(process.env.CLOUDINARY_URL ?? '');

export const deleteProductImage = async (imageId: number, imageUrl: string) => {
    if (!imageUrl.startsWith('http')) {
        return {
            ok: false,
            error: 'No se pueden borrar las imagenes de FileSystem'
        }
    }

    const imageName = imageUrl
        .split('/')
        .pop()
        ?.split('.')[0] ?? '';

    try {
        await cloudinary.uploader.destroy(imageName);
        const deletedImage = await prisma.productImage.delete({
            where: {
                id: imageId
            },
            select: {
                Product: {
                    select: {
                        slug: true
                    }
                }
            }
        })


        revalidatePath('/admin/products');
        revalidatePath(`/admin/product/${deletedImage.Product.slug}`);
        revalidatePath(`/products/${deletedImage.Product.slug}`);

    } catch (error) {
        return {
            ok: false,
            message: 'No se pudo eliminar la imagen'
        }
    }
}