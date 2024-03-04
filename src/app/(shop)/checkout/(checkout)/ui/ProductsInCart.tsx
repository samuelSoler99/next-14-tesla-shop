'use client'
import { useCartStore } from '@/store'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { currencyFormat } from '@/utils/currencyFormat'

export const ProductsInCart = () => {
    const [loaded, setloaded] = useState(false)
    const productsInCart = useCartStore(state => state.cart);

    useEffect(() => {
        setloaded(true)
    })


    if (!loaded) {
        return <p>Loading...</p>
    }

    return (
        <>
            {productsInCart.map(product => (
                <div key={`${product.slug}-${product.size}`} className="flex mb-5">
                    <Image
                        src={`/products/${product.image}`}
                        width={100}
                        height={100}
                        style={{
                            width: '100px',
                            height: '100px'
                        }}
                        alt={product.title}
                        className="mr-5 rounded"
                    />
                    <div>
                        <span>
                            {product.size} - {product.title} ({product.quantity})
                        </span>

                        <p className='font-bold'>{currencyFormat(product.price * product.quantity)}</p>
                    </div>
                </div>
            ))
            }
        </>
    )
}
