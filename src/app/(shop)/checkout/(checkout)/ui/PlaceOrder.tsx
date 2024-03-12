'use client'

import { placeOrder } from "@/actions/order/place-order";
import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat } from "@/utils/currencyFormat";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"



export const PlaceOrder = () => {
    const router = useRouter();
    const [loaded, setLoaded] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [errorMessage, seterrorMessage] = useState('');

    const address = useAddressStore(state => state.address);
    const { itemsInCart, subTotal, tax, total } = useCartStore(state => state.getSummaryInformation());

    const cart = useCartStore(state => state.cart);
    const clearCart = useCartStore(state => state.clearCart);

    useEffect(() => {
        setLoaded(true);
    }, [])

    const onPLaceOrder = async () => {
        setIsPlacingOrder(true);

        const productsToOrder = cart.map(product => ({
            productId: product.id,
            quantity: product.quantity,
            size: product.size
        }))
        //server action
        const respose = await placeOrder(productsToOrder, address);

        if (!respose.ok) {
            setIsPlacingOrder(false);
            seterrorMessage(respose.message);
            return;
        }

        clearCart();
        router.replace('/orders/' + respose.order?.id);
        setIsPlacingOrder(false);
    }

    if (!loaded) {
        //todo aqui deberia de añadirse un skeleton del componente
        return <p>Loading...</p>
    }

    return (
        <div className="bg-white rounded-xl shadow-xl p-7">

            <h2 className="text-2xl font-bold mb-2">Dirección de entrega</h2>
            <div className="mb-10">
                <p className="text-xl">{address.firstName} {address.lastName}</p>
                <p>{address.address}</p>
                <p>{address.address2}</p>
                <p>{address.postalCode}</p>
                <p>{address.city}, {address.country}</p>
                <p>{address.phone}</p>
            </div>

            {/* divisor */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

            <h2 className="text-2xl mb-2">
                Resumen de orden
            </h2>

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

            <div className="mt-5 mb-2 w-full">

                <p className="mb-5">
                    <span className="text-xs">
                        Al hacer click en &quot;Confirmar Orden&quot;, aceptas nuestros <a href="#" className="underline" >términos y condiciones</a> y <a href="#" className="underline">política de privacidad</a>
                    </span>
                </p>

                <p className="text-red-500">{errorMessage}</p>

                <button
                    onClick={onPLaceOrder} 
                    className={
                        clsx({
                            "btn-primary": !isPlacingOrder,
                            "btn-disabled": isPlacingOrder
                        })
                    }>
                    Confirmar Orden
                </button>
            </div>


        </div>
    )
}
