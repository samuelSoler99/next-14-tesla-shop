"use client";

import { createUpdateProduct } from "@/actions/products/create-update-product";
import { deleteProductImage } from "@/actions/products/delete-product-image";
import { ProductImage } from "@/components";
import { Category, Product, ProductImage as ProductWithImage } from "@/interfaces";
import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
    product: Partial<Product> & { ProductImage?: ProductWithImage[] };
    categories: Category[]
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

interface FormInputs {
    title: string;
    slug: string;
    description: string;
    price: number;
    inStock: number;
    sizes: string[];
    tags: string;
    gender: 'men' | 'women' | 'kid' | 'unisex';
    categoryId: string;
    images?: FileList;
}


export const ProductForm = ({ product, categories }: Props) => {
    const [isLoading, setLoading] = useState(false);
    const router = useRouter();

    const { handleSubmit,
        register,
        formState: { isValid },
        getValues,
        setValue,
        watch
    } = useForm<FormInputs>({
        defaultValues: {
            ...product,
            tags: product.tags?.join(', '),
            sizes: product.sizes ?? [],
            images: undefined
        }
    });

    watch('sizes')

    const onSizeChange = (size: string) => {
        const sizes = new Set(getValues('sizes'));
        sizes.has(size) ? sizes.delete(size) : sizes.add(size);

        setValue('sizes', Array.from(sizes));
    }

    const onSubmit = async (data: FormInputs) => {
        setLoading(true)
        const formData = new FormData();

        const { images, ...productToSave } = data;

        if (product.id) {
            formData.append('id', product.id ?? '');
        }

        formData.append('title', productToSave.title);
        formData.append('slug', productToSave.slug);
        formData.append('description', productToSave.description);
        formData.append('price', productToSave.price.toString());
        formData.append('inStock', productToSave.inStock.toString());
        formData.append('sizes', productToSave.sizes.toString());
        formData.append('tags', productToSave.tags);
        formData.append('categoryId', productToSave.categoryId);
        formData.append('gender', productToSave.gender);

        if (images) {
            for (let i = 0; i < images.length; i++) {
                formData.append('images', images[i]);
            }
        }

        const { ok, product: updatedProduct } = await createUpdateProduct(formData);

        if (!ok) {
            alert('Producto no se pudo actualizar');
            setLoading(false);
            return;
        }
        setLoading(false);
        router.replace(`/admin/product/${updatedProduct?.slug}`)
    }

    const onDeleteImage = async(id:number,imageUrl:string) => {
        setLoading(true)
        await deleteProductImage(id,imageUrl)
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3">
            {/* Textos */}
            <div className="w-full">
                <div className="flex flex-col mb-2">
                    <span>Título</span>
                    <input type="text" {...register('title', { required: true })} className="p-2 border rounded-md bg-gray-200" />
                </div>

                <div className="flex flex-col mb-2">
                    <span>Slug</span>
                    <input type="text" {...register('slug', { required: true })} className="p-2 border rounded-md bg-gray-200" />
                </div>

                <div className="flex flex-col mb-2">
                    <span>Descripción</span>
                    <textarea
                        {...register('description', { required: true })}
                        rows={5}
                        className="p-2 border rounded-md bg-gray-200"
                    ></textarea>
                </div>

                <div className="flex flex-col mb-2">
                    <span>Price</span>
                    <input type="number" {...register('price', { required: true, min: 0 })} className="p-2 border rounded-md bg-gray-200" />
                </div>

                <div className="flex flex-col mb-2">
                    <span>Tags</span>
                    <input type="text" {...register('tags', { required: true })} className="p-2 border rounded-md bg-gray-200" />
                </div>

                <div className="flex flex-col mb-2">
                    <span>Gender</span>
                    <select className="p-2 border rounded-md bg-gray-200" {...register('gender', { required: true })}>
                        <option value="">[Seleccione]</option>
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                        <option value="kid">Kid</option>
                        <option value="unisex">Unisex</option>
                    </select>
                </div>

                <div className="flex flex-col mb-2">
                    <span>Categoria</span>
                    <select {...register('categoryId', { required: true })} className="p-2 border rounded-md bg-gray-200">
                        <option value="">[Seleccione]</option>
                        {
                            categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))
                        }
                    </select>
                </div>

                <button className={
                        clsx({
                            "btn-primary w-full": !isLoading,
                            "btn-disabled w-full": isLoading
                        })
                    }>
                    Guardar
                </button>
                
            </div>

            {/* Selector de tallas y fotos */}
            <div className="w-full">

                <div className="flex flex-col mb-2">
                    <span>Stock</span>
                    <input type="number" {...register('inStock', { required: true, min: 0 })} className="p-2 border rounded-md bg-gray-200" />
                </div>

                {/* As checkboxes */}
                <div className="flex flex-col">

                    <span>Tallas</span>
                    <div className="flex flex-wrap">

                        {
                            sizes.map(size => (
                                // bg-blue-500 text-white <--- si está seleccionado
                                <div
                                    key={size}
                                    onClick={() => onSizeChange(size)}
                                    className={
                                        clsx(
                                            "p-2 border cursor-pointer rounded-md mr-2 mb-2 w-14 transition-all text-center",
                                            {
                                                'bg-blue-500 text-white': getValues('sizes').includes(size)
                                            }
                                        )
                                    }
                                >
                                    <span>{size}</span>
                                </div>
                            ))
                        }

                    </div>


                    <div className="flex flex-col mb-2">

                        <span>Fotos</span>
                        <input
                            {...register('images')}
                            type="file"
                            multiple
                            className="p-2 border rounded-md bg-gray-200"
                            accept="image/png, image/jpeg, image/avif"
                        />

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                        {
                            product.ProductImage?.map(image => (
                                <div key={image.id} className="flex flex-col items-center">
                                    <ProductImage
                                        alt={product.title ?? ''}
                                        src={image.url}
                                        width={300}
                                        height={300}
                                        className="rounded-t shadow-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => onDeleteImage(image.id, image.url)}
                                        className="btn-danger w-full rounded-b-xl">
                                        Eliminar
                                    </button>
                                </div>
                            ))
                        }
                    </div>

                </div>
            </div>
        </form>
    );
};