'use server';

import { auth } from "@/auth.config";
import { Address, Size } from "@/interfaces";
import prisma from "@/lib/prisma";
import { metadata } from '../../app/layout';

interface ProductToOrder {
    productId: string;
    quantity: number;
    size: Size
}

export const placeOrder = async (productsIds: ProductToOrder[], address: Address) => {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
        return {
            ok: false,
            message: 'No hay sesión de usuario'
        }
    }

    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productsIds.map(p => p.productId)
            }
        }
    })

    const itemsInOrder = productsIds.reduce((count, p) => count + p.quantity, 0)

    const { subTotal, tax, total } = productsIds.reduce((totals, item) => {

        const productQauntity = item.quantity
        const product = products.find(product => product.id === item.productId)

        if (!product) throw new Error(`producto con id #${item.productId} no existe - 500`)

        const subTotal = product.price * productQauntity
        totals.subTotal += subTotal
        totals.tax += subTotal * 0.15; //todo modificar impuesto a variable de entorno
        totals.total += subTotal * 1.15;

        return totals
    }, { subTotal: 0, tax: 0, total: 0 });


    //Transaccion de la creacion de la orden
    try {
        const prismaTx = await prisma.$transaction(async (tx) => {
            //1. Actualizar el stock de los productos
            const updatedPrtoductsPromises = products.map((product) => {
                //acumular los valores
                const productQauntity = productsIds.filter(
                    p => p.productId === product.id
                ).reduce((accumulated, item) => item.quantity + accumulated, 0);

                if (productQauntity === 0) {
                    throw new Error(`${product.id} no tiene cantidad definida`)
                }

                return tx.product.update({
                    where: { id: product.id },
                    data: {
                        // inStock: product.inStock - productQauntity
                        inStock: {
                            decrement: productQauntity
                        }
                    }
                })
            });

            const updatedProducts = await Promise.all(updatedPrtoductsPromises);

            //verificar valores negrativos en el sotck
            updatedProducts.forEach(product => {
                if (product.inStock < 0) {
                    throw new Error(`${product.title} no queda stock suficiente`)
                }
            });


            //2. Crear la orden con sus detalles
            const order = await tx.order.create({
                data: {
                    userId: userId,
                    itemsInOrder: itemsInOrder,
                    subTotal: subTotal,
                    tax: tax,
                    total: total,

                    OrderItem: {
                        createMany: {
                            data: productsIds.map(p => ({
                                quantity: p.quantity,
                                size: p.size,
                                productId: p.productId,
                                price: products.find(product => product.id === p.productId)?.price ?? 0
                            }))
                        }
                    }
                }
            })

            //validar si el price es 0, para lanzar error y revertir la transaccion

            //3. Crear la direccion de la orden
            const { country, ...restAddress } = address;
            const orderAddress = await tx.orderAddress.create({
                data: {
                    ...restAddress,
                    countryId: country,
                    orderId: order.id
                }
            })

            return {
                orden: order,
                updatedProduts: updatedProducts,
                orderAddress: orderAddress
            };
        });

        return {
            ok: true,
            order: prismaTx.orden,
            prismaTx: prismaTx
        }

    } catch (error: any) {
        return {
            ok: false,
            message: error?.message
        }
    }



}