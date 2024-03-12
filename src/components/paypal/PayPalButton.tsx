'use client'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { CreateOrderData, CreateOrderActions, OnApproveData, OnApproveActions } from '@paypal/paypal-js'
import { setTransactionIdByOrderId } from '@/actions/payments/set-transaction-id-by-order-id';
import { paypalCheckPayment } from '@/actions/payments/paypal-check-payment';

interface Props {
    orderId: string;
    amount: number;
}

export const PayPalButton = ({ orderId, amount }: Props) => {
    const [{ isPending }] = usePayPalScriptReducer();

    const rontedAmount = (Math.round(amount * 100)) / 100;

    if (isPending) {
        return (
            <div className='animate-pulse mb-20'>
                <div className='h-10 bg-gray-300 rounded' />
                <div className='h-10 bg-gray-300 rounded mt-2' />
                <div className='h-10 bg-gray-300 rounded mt-2' />
            </div>
        )
    }

    const createOrder = async (data: CreateOrderData, actions: CreateOrderActions): Promise<string> => {

        const transactionId = await actions.order.create({
            purchase_units: [
                {
                    invoice_id: orderId,
                    amount: {
                        value: `${rontedAmount}`,
                        currency_code: 'EUR'
                    },
                }
            ],
            intent: 'CAPTURE'
        });

        const { ok } = await setTransactionIdByOrderId(orderId, transactionId);

        if (!ok) {
            throw new Error('No se pudo actualizar la orden');
        }

        return transactionId;
    }

    const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
        const details = await actions.order?.capture();

        if (!details) return;
        await paypalCheckPayment(String(details.id));
    }

    return (
        <div className='relative z-0'>
            <PayPalButtons
                createOrder={createOrder}
                onApprove={onApprove}
            />
        </div>
    )
}
