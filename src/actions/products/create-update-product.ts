'use server'

import prisma from '@/lib/prisma';
import { Gender, Product, Size } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config(process.env.CLOUDINARY_URL ?? '');

const productSchema = z.object({
    id: z.string().uuid().optional().nullable(),
    title: z.string().min(3).max(255),
    slug: z.string().min(3).max(255),
    description: z.string(),
    price: z.coerce
        .number()
        .min(0)
        .transform(val => Number(val.toFixed(2))),
    inStock: z.coerce
        .number()
        .min(0)
        .transform(val => Number(val.toFixed(0))),
    categoryId: z.string().uuid(),
    sizes: z.coerce.string().transform(val => val.split(',')),
    tags: z.string(),
    gender: z.nativeEnum(Gender),

})

export const createUpdateProduct = async (formData: FormData) => {
    const data = Object.fromEntries(formData);

    const productParsed = productSchema.safeParse(data);
    if (!productParsed.success) {
        console.log(productParsed.error)
        return { ok: false }
    }

    const product = productParsed.data;
    product.slug = product.slug.toLocaleLowerCase().replace(/ /g, '-').trim();

    const { id, ...rest } = product;
    try {
        const prismaTx = await prisma.$transaction(async (tx) => {

            let product: Product;

            const tagsArray = rest.tags.split(',').map(tag => tag.trim().toLocaleLowerCase());

            if (id) {
                //actualizar
                product = await prisma.product.update({
                    where: {
                        id: id
                    },
                    data: {
                        ...rest,
                        sizes: {
                            set: rest.sizes as Size[]
                        },
                        tags: {
                            set: tagsArray
                        }
                    }
                })
            } else {
                //crear
                product = await prisma.product.create({
                    data: {
                        ...rest,
                        sizes: {
                            set: rest.sizes as Size[]
                        },
                        tags: {
                            set: tagsArray
                        }
                    }
                });
            }

            //proceso de carga y guardado de imagenes
            if (formData.getAll('images')) {
                //[https//urlcompletoimagen.jpg,https//urlcompletoimagen2.jpg]
                const images = await uploadImages(formData.getAll('images') as File[])
                if (!images) {
                    throw new Error('no se pudo cargar las imágenes, rollingback')
                }

                await prisma.productImage.createMany({
                    data: images.map(image => ({
                        url: image!,
                        productId: product.id
                    }))
                })
            }

            return {
                product
            }
        });

        //todo revalidate path
        revalidatePath('/admin/products');
        revalidatePath(`/admin/product/${product.slug}`);
        revalidatePath(`/products/${product.slug}`);

        return {
            ok: true,
            product: prismaTx.product
        }
    } catch (error) {
        return {
            ok: false,
            message: 'revisar logs no se pudo crear/actualizar producto'
        }
    }
}


const uploadImages = async (images: File[]) => {
    try {
        const uploadPromises = images.map(async (image) => {
            try {
                const buffer = await image.arrayBuffer();
                const base64Image = Buffer.from(buffer).toString('base64');

                return cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`)
                    .then(response => response.secure_url);
            } catch (error) {
                console.log(error)
                return null;
            }
        })

        const uploadedImages = await Promise.all(uploadPromises);
        return uploadedImages;
    } catch (error) {
        console.log(error)
        return null;
    }
}