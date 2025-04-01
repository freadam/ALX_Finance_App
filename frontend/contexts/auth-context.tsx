"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { authApi, getAuthToken, removeAuthToken } from "@/lib/api"

interface User {
    id: string
    username: string
    email: string
}

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (username: string, password: string) => Promise<void>
    logout: () => Promise<void>
    error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    // Check if user is already logged in
    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = getAuthToken()

            if (!token) {
                setIsLoading(false)
                return
            }

            try {
                // Try to get current user data
                const userData = await authApi.getCurrentUser()
                setUser(userData as User)
            } catch (err) {
                // If token is invalid, remove it
                removeAuthToken()
                setError("Session expired. Please log in again.")
            } finally {
                setIsLoading(false)
            }
        }

        checkAuthStatus()
    }, [])

    const login = async (username: string, password: string) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await authApi.login(username, password)
            setUser(response.user)
            router.push("/dashboard")
        } catch (err) {
            setError("Invalid credentials. Please try again.")
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    const logout = async () => {
        setIsLoading(true)

        try {
            await authApi.logout()
            setUser(null)
            router.push("/login")
        } catch (err) {
            setError("Failed to log out. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
                error,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }

    return context
}
