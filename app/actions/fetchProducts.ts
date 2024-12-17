import { supabase } from '../../lib/supabase';

export async function fetchHotSales() {
    try {
        const { data: products, error } = await supabase
            .from('menuitems')
            .select('*')
            .order('sold', { ascending: false })
            .limit(6);

        if (error) throw error;
        return products || [];
    } catch (error) {
        console.error('Error fetching hot sales:', error);
        return [];
    }
}

export async function fetchNewProducts() {
    try {
        const { data: products, error } = await supabase
            .from('menuitems')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(6);

        if (error) throw error;
        return products || [];
    } catch (error) {
        console.error('Error fetching new products:', error);
        return [];
    }
}
