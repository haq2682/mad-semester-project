import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { AppState } from 'react-native'

const supabaseUrl = 'https://jgabgrvelmottciwtxnw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnYWJncnZlbG1vdHRjaXd0eG53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3Nzk5MzEsImV4cCI6MjA0NjM1NTkzMX0.zR2A10J581Z6FXvTsBcovN8myCymUSvPyn9x1VOtiSg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})

AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})

// Add this function for detailed error logging
export const logSupabaseError = (error: any) => {
    console.error('Supabase Error:', JSON.stringify(error, null, 2))
}

// Implement logout functionality
export const logout = async (): Promise<{ error: Error | null }> => {
    try {
        const { error } = await supabase.auth.signOut()
        if (error) {
            throw error
        }
        // Clear any local storage or state related to the user session
        await AsyncStorage.removeItem('userToken')
        // You may want to clear other items as well, depending on what you're storing
        return { error: null }
    } catch (error) {
        logSupabaseError(error)
        return { error: error instanceof Error ? error : new Error('An unknown error occurred during logout') }
    }
}

// Function to get the current session
export const getCurrentSession = async () => {
    const { data, error } = await supabase.auth.getSession()
    if (error) {
        logSupabaseError(error)
        return null
    }
    return data.session
}

// Function to get the current user
export const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
        logSupabaseError(error)
        return null
    }
    return user
}

// Function to check if a user is logged in
export const isLoggedIn = async (): Promise<boolean> => {
    const session = await getCurrentSession()
    return session !== null
}