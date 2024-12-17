import { supabase } from '../../lib/supabase'

export async function searchItems(query: string) {
    // Search in MenuItems
    const { data: menuItems, error: menuItemsError } = await supabase
        .from('menuitems')
        .select('item_id, name, description, price, image')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(20)

    // Search in MenuCategories
    const { data: menuCategories, error: menuCategoriesError } = await supabase
        .from('menucategories')
        .select('category_id, name, description')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(10)

    if (menuItemsError || menuCategoriesError) {
        console.error('Error searching:', menuItemsError || menuCategoriesError)
        return { error: 'Failed to perform search' }
    }

    return {
        menuItems: menuItems || [],
        menuCategories: menuCategories || []
    }
}

