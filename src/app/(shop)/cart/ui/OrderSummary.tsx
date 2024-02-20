'use client'
import { useCartStore } from '@/store';
import { currencyFormat } from '@/utils/currencyFormat';
import React, { useEffect, useState } from 'react'

export const OrderSummary = () => {
    const [loaded, setLoaded] = useState(false);
    const { itemsInCart, subTotal, tax, total } = useCartStore(state => state.getSummaryInformation())
    useEffect(() => {
        setLoaded(true);
    },[])

    if (!loaded) return <p>Loading...</p>


    return (

        <div className="grid grid-cols-2">

            <span>No. Productos</span>
            <span className="text-right">
                {itemsInCart === 1 ? '1 producto' : `${itemsInCart} productos`}
            </span>

            <span>Subtotal</span>
            <span className="text-right">{currencyFormat(subTotal)}</span>

            <span>Impuestos (15%)</span>
            <span className="text-right">{currencyFormat(tax)}</span>

            <span className="mt-5 text-2xl">Total:</span>
            <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>

        </div>
    )
}
