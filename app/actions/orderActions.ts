import { supabase, logSupabaseError } from '../../lib/supabase';
import { CartItemProps } from './cartActions';
import { getCurrentUser } from '../../lib/supabase';

export interface OrderProps {
    order_id?: number;
    total_price: number;
    address: string;
    phone_number: string;
    status?: string;
    items?: CartItemProps[];
    order_number: number
}

export interface OrderItemProps {
    order_id?: number;
    item_id: number;
    quantity: number;
    price: number;
    variant_id?: number | null;
}

export async function placeOrder(
    orderDetails: OrderProps,
    cartItems: CartItemProps[],
    paymentMethod: string
): Promise<{ order?: { order_number: number }, error?: Error }> {
    const generateRandomOrderNumber = () => {
        return Math.floor(1000000000 + Math.random() * 9000000000);
    };

    try {
        // Get current user
        const user = await getCurrentUser();
        if (!user) {
            throw new Error('User not authenticated');
        }

        // Validate input
        if (!orderDetails.address || !orderDetails.phone_number) {
            throw new Error('Address and phone number are required');
        }

        // Generate unique 10-digit order number
        const orderNumber = generateRandomOrderNumber();

        // Start a transaction
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id: user.id,
                total_price: orderDetails.total_price,
                address: orderDetails.address,
                phone_number: orderDetails.phone_number,
                status: 'Pending',
                order_number: orderNumber
            })
            .select()
            .single();

        if (orderError) {
            logSupabaseError(orderError);
            throw new Error('Failed to create order');
        }

        // Prepare order items
        const orderItems: OrderItemProps[] = cartItems.map(item => ({
            order_id: orderData.order_id,
            item_id: item.item_id,
            quantity: item.quantity,
            price: item.price
        }));

        // Insert order items
        const { error: orderItemsError } = await supabase
            .from('orderitems')
            .insert(orderItems);

        if (orderItemsError) {
            logSupabaseError(orderItemsError);
            throw new Error('Failed to add order items');
        }

        console.log(orderData.order_id);
        console.log(orderDetails.total_price);
        console.log(paymentMethod);

        // Insert payment record
        const { error: paymentError } = await supabase
            .from('payments')
            .insert({
                order_id: orderData.order_id,
                amount: orderDetails.total_price,
                payment_method: paymentMethod,
                status: 'Pending'
            });

        if (paymentError) {
            logSupabaseError(paymentError);
            throw new Error('Failed to create payment record');
        }

        // Clear the cart after successful order
        const { error: clearCartError } = await supabase
            .from('cartitems')
            .delete()
            .eq('cart_id', await getCartId(user.id));

        if (clearCartError) {
            logSupabaseError(clearCartError);
            console.warn('Failed to clear cart after order placement');
        }

        return { order: { order_number: orderNumber } };
    } catch (error) {
        console.error('Order placement error:', error);
        return { error: error instanceof Error ? error : new Error('An unknown error occurred') };
    }
}

async function getCartId(userId: string): Promise<number> {
    const { data, error } = await supabase
        .from('cart')
        .select('cart_id')
        .eq('user_id', userId)
        .single();

    if (error) {
        logSupabaseError(error);
        throw new Error('Could not find cart');
    }

    return data.cart_id;
}

export async function getOrderDetails(orderNumber: number): Promise<OrderProps | null> {
    const { data, error } = await supabase
        .from('orders')
        .select(`
            order_number,
            total_price,
            address,
            phone_number,
            items:orderitems(
                item_id,
                menuitems(name),
                quantity,
                price
            )
        `)
        .eq('order_number', orderNumber)
        .single();

    if (error) {
        console.error('Error fetching order details:', error);
        return null;
    }

    // Transform the data to match the expected OrderProps structure
    if (data) {
        return {
            ...data,
            items: data.items.map(item => ({
                item_id: item.item_id,
                name: item.menuitems.name,
                quantity: item.quantity,
                price: item.price
            }))
        };
    }

    return null;
}