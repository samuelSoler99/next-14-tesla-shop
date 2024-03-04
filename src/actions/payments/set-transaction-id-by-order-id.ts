'use server'

import prisma from "@/lib/prisma"

export const setTransactionIdByOrderId = async (id: string, transactionId: string) => {

    try {
        const order = await prisma.order.update({
            where: {
                id: id
            },
            data: {
                transactionId: transactionId
            }
        })

        if (!order) {
            return {
                ok: false,
                message: `No se encontro una orden con el ${id}`
            }
        }

        return {
            ok: true,
        }

    } catch (error) {
        return {
            ok: false,
            message: 'error insertando transaction id en la orden'
        }
    }
}