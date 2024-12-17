import { supabase } from '../../lib/supabase';

export interface ItemDetails {
    item_id: number;
    name: string;
    description: string;
    price: number;
    category_id: number;
    image: string;
    quantity: number;
    sold: number;
    is_available: boolean;
    MenuCategories?: {
        name: string;
    };
}

export async function fetchItemDetails(itemId: string | number): Promise<ItemDetails | null> {
    try {
        const parsedId = typeof itemId === 'string' ? parseInt(itemId, 10) : itemId;

        if (isNaN(parsedId)) {
            throw new Error('Invalid item ID');
        }

        const { data, error } = await supabase
            .from('menuitems')
            .select('*, menucategories(name)')
            .eq('item_id', parsedId)
            .single();

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        if (!data) {
            return null;
        }

        return data as ItemDetails;
    } catch (error) {
        console.error('Error fetching item details:', error);
        throw error;
    }
}
