import { supabase, logSupabaseError } from '../../lib/supabase';

export interface CartItemProps {
    item_id: number;
    quantity: number;
    price: number;
    name: string;
}

export async function getOrCreateCart(userId: string) {
    const { data: existingCart, error: fetchError } = await supabase
        .from('cart')
        .select('cart_id')
        .eq('user_id', userId)
        .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
        logSupabaseError(fetchError);
        throw new Error('Error fetching cart');
    }

    if (existingCart) {
        return existingCart.cart_id;
    }

    const { data: newCart, error: insertError } = await supabase
        .from('cart')
        .insert({ user_id: userId })
        .select('cart_id')
        .single();

    if (insertError) {
        logSupabaseError(insertError);
        throw new Error('Error creating cart');
    }

    return newCart.cart_id;
}

export async function addItemToCart(userId: string, item: CartItemProps) {
    if (!userId || !item.item_id || !item.quantity) {
        throw new Error('Invalid cart item data');
    }

    const cartId = await getOrCreateCart(userId);

    // First, check if the item already exists in the cart
    const { data: existingItem, error: fetchError } = await supabase
        .from('cartitems')
        .select('quantity')
        .match({ cart_id: cartId, item_id: item.item_id })
        .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
        logSupabaseError(fetchError);
        throw new Error('Error checking existing cart item');
    }

    if (existingItem) {
        // If the item exists, update the quantity
        const newQuantity = existingItem.quantity + item.quantity;
        const { data, error } = await supabase
            .from('cartitems')
            .update({ quantity: newQuantity })
            .match({ cart_id: cartId, item_id: item.item_id })
            .select();

        if (error) {
            logSupabaseError(error);
            throw new Error('Error updating cart item quantity');
        }

        return data;
    } else {
        // If the item doesn't exist, insert a new row
        const { data, error } = await supabase
            .from('cartitems')
            .insert({
                cart_id: cartId,
                item_id: item.item_id,
                quantity: item.quantity,
            })
            .select();

        if (error) {
            logSupabaseError(error);
            throw new Error('Error adding new item to cart');
        }

        return data;
    }
}

export async function removeItemFromCart(userId: string, itemId: number) {
    const cartId = await getOrCreateCart(userId);

    const { error } = await supabase
        .from('cartitems')
        .delete()
        .match({ cart_id: cartId, item_id: itemId });

    if (error) {
        logSupabaseError(error);
        throw new Error('Error removing item from cart');
    }
}

export async function updateCartItemQuantity(userId: string, itemId: number, quantity: number) {
    console.log(quantity);
    console.log(userId);
    console.log(itemId);
    if (!userId || typeof itemId !== 'number' || typeof quantity !== 'number' || isNaN(quantity)) {
        throw new Error('Invalid input: userId, itemId, and quantity must be provided and valid');
    }

    const cartId = await getOrCreateCart(userId);

    const { data, error } = await supabase
        .from('cartitems')
        .update({ quantity })
        .match({ cart_id: cartId, item_id: itemId })
        .select();

    if (error) {
        logSupabaseError(error);
        throw new Error('Error updating item quantity');
    }

    if (!data || data.length === 0) {
        throw new Error('Cart item not found');
    }

    return data[0];
}

export async function getCartItems(userId: string) {
    const cartId = await getOrCreateCart(userId);

    const { data, error } = await supabase
        .from('cartitems')
        .select(`
      item_id,
      quantity,
      menuitems (
        name,
        price
      )
    `)
        .eq('cart_id', cartId);

    if (error) {
        logSupabaseError(error);
        throw new Error('Error fetching cart items');
    }

    return data.map(item => ({
        item_id: item.item_id,
        quantity: item.quantity,
        name: item.menuitems.name,
        price: item.menuitems.price,
    }));
}

