import { supabase, logSupabaseError } from "~/lib/supabase";
export const fetchMenuCategories = async () => {
    try {
        const { data, error } = await supabase
            .from('menucategories')
            .select('*')
            .order('name');

        if (error) {
            logSupabaseError(error);
            return [];
        }

        return data;
    } catch (error) {
        logSupabaseError(error);
        return [];
    }
};