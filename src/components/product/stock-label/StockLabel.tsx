'use client';

import { getStockBySlug } from '@/actions/products/get-stock-by-slug';
import { titleFont } from '@/config/fonts'
import { useEffect, useState } from 'react';

interface Props {
    slug: string;
}

export const StockLabel = ({ slug }: Props) => {

    const [stock, setStock] = useState(0);
    const [isLoading, setisLoading] = useState(true);

    useEffect(() => {
        const getStock = async () => {
            const inStock = await getStockBySlug(slug);
            setStock(inStock);
            setisLoading(false);
        };

        getStock();
    }, [slug])




    return (
        <>
            {
                isLoading ? (
                    <h1 className={` ${titleFont.style} antialiased font-bold text-lg bg-gray-200 animate-pulse`}>
                        &nbsp;
                    </h1>
                ) : (
                    <h1 className={` ${titleFont.style} antialiased font-bold text-lg`}>
                        Stock: {stock}
                    </h1>
                )
            }
        </>
    )
}
